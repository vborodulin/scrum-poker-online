import { userHelpers } from '@chpokify/helpers';
import { transServer } from '@chpokify/i18n';
import { THEME_TYPES, TUser, USER_ROLES } from '@chpokify/models-types';

import { BadRequestError, ERROR_CODES } from '@core/lib/errors';

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

  /**
   * Guest has no email and password: it is recognized only by session cookie,
   * so nobody can log in as another guest.
   */
  public static createGuest(username: string): TUserDocument {
    return new UserModel({
      username,
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
}

export {
  UserService,
};
