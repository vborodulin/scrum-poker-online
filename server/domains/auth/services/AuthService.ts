import { transServer } from '@chpokify/i18n';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { SiweMessage } from 'siwe';

import { BadRequestError, ERROR_CODES, UnprocessableEntityError } from '@core/lib/errors';
import { passport } from '@core/lib/passport';
import { TAppRequest, TAppResponse } from '@core/types';

import { TUser, TUserDocument, UserModel } from '@models/user';

import { UserService } from '@users/services';

const GOOGLE_CLIENT_ID = '238943843598-9iefbdc3npjlpsndj2aooch979djru26.apps.googleusercontent.com';

const googleOAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthService {
  public constructor(
    private readonly req: TAppRequest,
    private readonly res: TAppResponse<{}>
  ) {}

  public logIn(user: TUser) {
    return new Promise((resolve, reject) => {
      this.req.logIn(user, (logInError) => {
        if (logInError) {
          return reject(logInError);
        }

        return resolve(user);
      });
    });
  }

  public async verifyOAuthIdToken(
    idToken: string,
    audience: string | string[]
  ) {
    try {
      const ticket = await googleOAuthClient.verifyIdToken({
        idToken,
        audience,
      });

      return {
        payload: ticket.getPayload(),
      };
    } catch (err) {
      return {
        err,
      };
    }
  }

  public async validateSigningMessage(message: string, signature: string, nonce: string): Promise<SiweMessage> {
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.validate(signature);

    if (fields.nonce !== nonce) {
      throw new UnprocessableEntityError('Invalid nonce');
    }

    return fields;
  }

  public async getCrypto(email: string, address: string) {
    const currUser = await UserModel.findOne({
      address,
    });

    if (currUser) {
      if (currUser.email !== email) {
        currUser.email = email;
        await currUser.save();
      }

      return currUser;
    }

    const userService = new UserService();
    const newUser = await userService.createCryptoUser(
      email,
      address
    );

    await newUser.save();
    return newUser;
  }

  public async getGoogleOAuthUser(googleId: string, payload: TokenPayload) {
    const {
      email,
      picture,
    } = payload;

    const currUser = await UserModel.findOne({
      googleId,
    });

    if (currUser) {
      return currUser;
    }

    if (!email) {
      return null;
    }

    const userWithEmail = await UserModel.findOne({
      email,
    });

    if (userWithEmail) {
      userWithEmail.set({
        googleId,
        imageUrl: picture,
      });

      await userWithEmail.save();
      return userWithEmail;
    }

    const userService = new UserService();
    const newUser = await userService.createGoogleOAuth({
      email,
      googleId,
      imageUrl: picture,
    });

    await newUser.save();
    return newUser;
  }

  public async getAppleAOAuthUser(email: string) {
    const userWithEmail = await UserModel.findOne({
      email,
    });

    if (userWithEmail) {
      return userWithEmail;
    }

    const userService = new UserService();
    const newUser = await userService.createAppleOAuth(email);
    await newUser.save();

    return newUser;
  }

  public signIn(): Promise<TUserDocument> {
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user: TUserDocument) => {
        if (err) {
          return reject(err);
        }

        if (!user) {
          const userNotFoundErr = new BadRequestError(ERROR_CODES.INVALID_PARAM, [
            {
              message: transServer.t('errors.auth.invalidSignIn'),
              path: ['body'],
            },
          ]);
          return reject(userNotFoundErr);
        }

        this.req.logIn(user, (logInError) => {
          if (logInError) {
            return reject(logInError);
          }

          return resolve(user);
        });
      })(this.req, this.res);
    });
  }

  public signOut() {
    this.req.logOut();
    this.res.clearCookie(process.env.APP_COOKIE_SESSION_NAME as string, { path: '/' });
  }
}

export {
  AuthService,
};
