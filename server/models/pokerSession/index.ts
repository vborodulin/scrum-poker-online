import { transServer } from '@chpokify/i18n';
import { SPACE_PARTICIPANT_ROLE, TEntityID } from '@chpokify/models-types';
import {
  TPokerSession,
  TPokerSessionInit,
} from '@chpokify/models-types/pokerSession';
import { io } from '@socket';
import { ObjectID } from 'bson';
import mongoose from 'mongoose';

import { softDeletePlugin } from '@core/lib/db/plugins';
import { ERROR_CODES, NotFoundError } from '@core/lib/errors';

import { RatingSchema } from '@models/pokerSession/rating';
import { SpaceModel } from '@models/space';

/**
 * mongoose types
 */

export type TPokerSessionDocumentMethods = {
  getUserRoleInSpace: (
    this: TPokerSessionDocument,
    userId: TEntityID,
  ) => Promise<SPACE_PARTICIPANT_ROLE>
};

export type TPokerSessionDocumentStatic = {
  createNew: (
    this: TPokerSessionModel,
    pokerSessionInit: TPokerSessionInit,
  ) => TPokerSessionDocument,
  findByTeamId: (
    this: TPokerSessionModel,
    teamId: TEntityID
  ) => TPokerSessionDocument[]
};

export type TPokerSessionDocument<T = TPokerSession> =
  mongoose.Document &
  T &
  TPokerSessionDocumentMethods;

export type TPokerSessionModel = mongoose.Model<TPokerSessionDocument> & TPokerSessionDocumentStatic;

/**
 * schema
 */

const PokerSessionSchema = new mongoose.Schema<TPokerSessionDocument>({
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
  },
  title: {
    type: String,
    maxlength: 150,
  },
  description: {
    type: String,
    maxlength: 300,
  },
  teamsIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
  usersIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
  storiesIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
  results: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  active: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  cardSetId: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  isAutoReveal: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  isVideoCall: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  jira: {
    baseUrl: mongoose.Schema.Types.String,
    project: mongoose.Schema.Types.Mixed,
    field: mongoose.Schema.Types.Mixed,
  },
  rating: [RatingSchema],
}, {
  strict: true,
  strictQuery: true,
  timestamps: true,
  minimize: false,
  // concurrent saves (votes of different users, moderator actions) must not overwrite each other:
  // save fails with VersionError and is retried in updatePokerSession
  optimisticConcurrency: true,
});

/**
 * indexes
 *
 */
PokerSessionSchema.index({
  spaceId: 1,
  isDeleted: 1,
});
PokerSessionSchema.index({
  spaceId: 1,
  withDeleted: 1,
});
PokerSessionSchema.index({
  teamsIds: 1,
});

/**
 * plugins
 */

PokerSessionSchema.plugin(softDeletePlugin);

/**
 * methods
 *
 */

PokerSessionSchema.methods.getUserRoleInSpace = async function (
  this: TPokerSessionDocument,
  userId: TEntityID
): Promise<SPACE_PARTICIPANT_ROLE> {
  const { spaceId } = this;

  const space = await SpaceModel.findById(spaceId);

  if (!space) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        message: transServer.t('errors.space.notFound'),
        path: ['pokerSession', 'spaceId'],
      },
    ]);
  }

  return space.getRole(userId);
};

/**
 * static
 *
 */

PokerSessionSchema.statics.createNew = function (
  this: TPokerSessionModel,
  pokerSessionInit: TPokerSessionInit
): TPokerSessionDocument {
  const pokerSession = {
    _id: new mongoose.Types.ObjectId(),
    title: '',
    description: '',
    teamsIds: [],
    usersIds: [],
    storiesIds: [],
    rating: [],
    isAutoReveal: false,
    isVideoCall: false,
    results: {},
    active: null,
    cardSetId: new ObjectID(),
    ...pokerSessionInit,
  };

  return new this(pokerSession);
};

PokerSessionSchema.statics.findByTeamId = async function (
  this: TPokerSessionModel,
  teamId: TEntityID
) {
  return this.find({
    teamsIds: {
      $in: [teamId],
    },
  });
};

/**
 * middleware
 *
 */

PokerSessionSchema.pre<TPokerSessionDocument>('save', async function () {
  this.$locals.wasModified = this.isModified();
});

/**
 * socket update
 */

const emitPokerSessionUpdate = (pokerSession: TPokerSessionDocument) => {
  const roomId = `pokerSession:${pokerSession.spaceId.toString()}`;
  const eventName = roomId;

  io.to(roomId)
    .emit(eventName, {
      pokerSession,
    });
};

PokerSessionSchema.post<TPokerSessionDocument>('save', async function (this: TPokerSessionDocument) {
  if (!this.$locals.wasModified) {
    return;
  }

  emitPokerSessionUpdate(this);
});

const PokerSessionModel = mongoose.model<TPokerSessionDocument, TPokerSessionModel>(
  'PokerSession', PokerSessionSchema
);

export {
  PokerSessionModel,
  emitPokerSessionUpdate,
};

export type {
  TPokerSession,
};
