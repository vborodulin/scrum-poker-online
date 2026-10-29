import { transServer } from '@chpokify/i18n';
import {
  THEME_TYPES, TUser, TUserProtected, USER_ROLES, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH,
} from '@chpokify/models-types';
import { io } from '@socket';
import bcrypt from 'bcryptjs';
import config from 'config';
import jsonwebtoken from 'jsonwebtoken';
import { omit } from 'lodash';
import mongoose from 'mongoose';

import { BadRequestError, ERROR_CODES } from '@core/lib/errors';

import { SpaceModel } from '@models/space';

const APP_SECRET = process.env.APP_SECRET as string;
const RESET_PASSWORD_EXPIRATION = config.get('app.resetPasswordExpiration') as string;

/**
 * mongoose types
 */
type TUserDocument<T extends TUser = TUser> = mongoose.Document & T & {
  validatePassword: (candidatePassword: string) => boolean;
  signResetPasswordToken: () => string;
  protect: () => TUserProtected
};

type TUserModel = mongoose.Model<TUserDocument> & {
  validateToken: <T extends Record<string, any>>(token: string) => {
    data: T;
  } | {
    err: Error
  }
};

/**
 * schema
 */

const UserSettingsSchema = new mongoose.Schema({
  themeType: {
    type: String,
    enum: [THEME_TYPES.LIGHT, THEME_TYPES.DARK],
    required: true,
  },
}, {
  _id: false,
});

const UserSchema = new mongoose.Schema<TUserDocument>({
  googleId: {
    type: String,
  },
  address: {
    type: String,
  },
  username: {
    type: String,
    trim: true,
    minlength: USERNAME_MIN_LENGTH,
    maxlength: USERNAME_MAX_LENGTH,
    lowercase: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
  },
  role: {
    type: Number,
    enum: [USER_ROLES.USER, USER_ROLES.ADMIN],
    required: true,
  },
  showSpaceOnboarding: {
    type: Boolean,
    required: true,
    default: true,
  },
  showPokerOnboarding: {
    type: Boolean,
    required: true,
    default: true,
  },
  settings: {
    type: UserSettingsSchema,
    required: true,
  },
  jiraIntegrations: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  customerId: {
    type: mongoose.Schema.Types.String,
  },
  isGuest: {
    type: mongoose.Schema.Types.Boolean,
  },
}, {
  timestamps: true,
  strict: true,
  strictQuery: true,
  minimize: false,
  toJSON: {
    // never send password hash to clients (http responses and socket events)
    transform: (doc, ret) => omit(ret, ['password']),
  },
});

/**
 * methods
 *
 */

UserSchema.methods.validatePassword = function (candidatePassword: string) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

UserSchema.methods.signResetPasswordToken = function () {
  return jsonwebtoken.sign({
    email: this.email,
  }, APP_SECRET, {
    expiresIn: RESET_PASSWORD_EXPIRATION,
  });
};

UserSchema.methods.protect = function (): TUserProtected {
  // @ts-ignore
  return omit(this.toObject(), [
    'password',
    'settings',
    'googleId',
    'jiraIntegrations',
    'customerId',
  ]);
};

/**
 * indexes
 *
 */
UserSchema.index({
  googleId: 1,
});

/**
 * static
 *
 */

UserSchema.statics.validateToken = function <T extends {}> (token: string) {
  try {
    return {
      data: jsonwebtoken.verify(token, APP_SECRET) as T,
    };
  } catch (err) {
    return {
      err,
    };
  }
};

/**
 * middleware
 *
 */

UserSchema.pre<TUserDocument>('save', function () {
  this.$locals.wasNew = this.isNew;
  this.$locals.wasModified = this.isModified();
});

UserSchema.pre<TUserDocument>('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = Math.ceil(Math.random() * 5) + 1;
  this.password = bcrypt.hashSync(this.password, saltRounds);

  return next();
});

UserSchema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new BadRequestError(ERROR_CODES.INVALID_PARAM, [
      {
        message: transServer.t('errors.user.duplicated'),
        path: [],
      },
    ]));
  } else {
    next(error);
  }
});

/**
 * socket update
 */
UserSchema.post<TUserDocument>('save', async function (this: TUserDocument) {
  if (!this.$locals.wasModified) {
    return;
  }

  const spaces = await SpaceModel.findWhereParticipant(this._id);

  spaces.forEach((space) => {
    const roomId = `userSpace:${space._id.toString()}`;
    const eventName = roomId;

    io.to(roomId)
      .emit(eventName, {
        user: this.protect(),
      });
  });
});

UserSchema.post<TUserDocument>('save', async function (this: TUserDocument) {
  if (!this.$locals.wasModified) {
    return;
  }

  const roomId = `user:${this._id.toString()}`;
  const eventName = roomId;

  io.to(roomId)
    .emit(eventName, {
      user: this,
    });
});

const UserModel = mongoose.model<TUserDocument, TUserModel>('User', UserSchema);

export {
  UserModel,
};

export type {
  TUser,
  TUserDocument,
  TUserModel,
};
