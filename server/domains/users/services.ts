import { userHelpers } from '@chpokify/helpers';
import { transServer } from '@chpokify/i18n';
import { THEME_TYPES, TUser, USER_ROLES } from '@chpokify/models-types';
import shortid from 'shortid';

import { BadRequestError, ERROR_CODES, ForbiddenError } from '@core/lib/errors';

import { TUserDocument, UserModel } from '@models/user';

export type TCreateGoogleOAuthData = {
  email: string;
  googleId: string;
  imageUrl?: string;
}

class UserService {
  private async createWithEmail(email: string, userProps: Partial<TUser>) {
    const userDuplicate = await UserModel.findOne({
      email,
    }) as TUserDocument;

    if (userDuplicate) {
      if (userDuplicate.isGuest) {
        userDuplicate.set({ isGuest: false });
        await userDuplicate.save();
        return userDuplicate;
      }

      throw new BadRequestError(ERROR_CODES.INVALID_PARAM, [
        {
          message: transServer.t('errors.user.emailAlreadyExists'),
          path: ['email'],
        },
      ]);
    }

    const {
      username,
      ...other
    } = userProps;

    const currUsername = username || userHelpers.getUsernameFromEmail(email);

    return new UserModel({
      email,
      username: currUsername,
      role: USER_ROLES.USER,
      showSpaceOnboarding: true,
      showPokerOnboarding: true,
      settings: {
        themeType: THEME_TYPES.LIGHT,
      },
      ...other,
    } as TUser);
  }

  public async createLocal(email: string, username: string, password: string) {
    return this.createWithEmail(email, {
      username,
      password,
    });
  }

  public static async createLocalGuest(email: string): Promise<TUserDocument> {
    const userNameDuplicate = await UserModel.findOne({
      email,
    });

    if (userNameDuplicate) {
      if (userNameDuplicate.isGuest) {
        return userNameDuplicate;
      }

      throw new ForbiddenError(ERROR_CODES.INVALID_PERMISSIONS, [
        {
          message: transServer.t('errors.auth.guest.forbidden'),
          path: ['body', 'email'],
        },
      ]);
    }

    const username = userHelpers.getUsernameFromEmail(email);

    const password = shortid.generate();

    return new UserModel({
      email,
      username,
      password,
      role: USER_ROLES.USER,
      showSpaceOnboarding: true,
      showPokerOnboarding: true,
      settings: {
        themeType: THEME_TYPES.LIGHT,
      },
      isGuest: true,
    } as TUser);
  }

  public async createGoogleOAuth(data: TCreateGoogleOAuthData) {
    const {
      email,
      googleId,
      imageUrl,
    } = data;

    return this.createWithEmail(email, {
      googleId,
      imageUrl,
    });
  }

  public async createAppleOAuth(email: string) {
    return this.createWithEmail(email, {});
  }

  public async createCryptoUser(email: string, address: string) {
    return this.createWithEmail(email, {
      address,
    });
  }
}

export {
  UserService,
};
