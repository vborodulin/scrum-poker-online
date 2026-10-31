import { transServer } from '@chpokify/i18n';
import {
  INVITE_USER_TO,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  TEntityID,
  TUser,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEXP,
  PASSWORD_REGEXP,
} from '@chpokify/models-types';
import Joi from '@hapi/joi';

import { TSuccessVoidResult } from '../coreSchemas';

export namespace AuthSchemas {
  export const EmailSchema = Joi.string()
    .email({
      minDomainSegments: 2,
      allowUnicode: false,
    })
    .messages({
      'string.empty': transServer.t('schemas.auth.email.string.empty'),
      'string.email': transServer.t('schemas.auth.email.string.email'),
    });

  export const UsernameSchema = Joi
    .string()
    .pattern(USERNAME_REGEXP)
    .messages({
      'string.empty': transServer.t('schemas.auth.username.string.empty'),
      'string.pattern.base': transServer.t('schemas.auth.username.string.pattern.base', {
        min: USERNAME_MIN_LENGTH,
        max: USERNAME_MAX_LENGTH,
      }),
    });

  export const PasswordSchema = Joi
    .string()
    .pattern(PASSWORD_REGEXP)
    .messages({
      'string.empty': transServer.t('schemas.auth.password.string.empty'),
      'string.pattern.base': transServer.t('schemas.auth.password.string.pattern.base', {
        min: PASSWORD_MIN_LENGTH,
        max: PASSWORD_MAX_LENGTH,
      }),
    });

  // get curr user
  export type TGetResResp = {
    user?: TUser;
    isLoggedIn: boolean;
  };

  // sign up
  export type TSignUpBodyReq = {
    username: string;
    email: string;
    password: string;
    inviteSpaceToken?: string;
  }

  // guest name: any letters (not only latin), digits, spaces; unlike username of registered user
  const GUEST_NAME_REGEXP = /^[\p{L}\p{N}][\p{L}\p{N} _.'-]*$/u;

  export const GuestNameSchema = Joi.string()
    .trim()
    .min(USERNAME_MIN_LENGTH)
    .max(USERNAME_MAX_LENGTH)
    .pattern(GUEST_NAME_REGEXP)
    .messages({
      'any.required': transServer.t('schemas.authGuest.username.string.empty'),
      'string.empty': transServer.t('schemas.authGuest.username.string.empty'),
      'string.min': transServer.t('schemas.authGuest.username.string.invalid', {
        min: USERNAME_MIN_LENGTH,
        max: USERNAME_MAX_LENGTH,
      }),
      'string.max': transServer.t('schemas.authGuest.username.string.invalid', {
        min: USERNAME_MIN_LENGTH,
        max: USERNAME_MAX_LENGTH,
      }),
      'string.pattern.base': transServer.t('schemas.authGuest.username.string.invalid', {
        min: USERNAME_MIN_LENGTH,
        max: USERNAME_MAX_LENGTH,
      }),
    });

  // join session guest: no email, guest is recognized by session cookie
  export type TLogInGuestBodyReq = {
    username: string;
    // may be omitted when the invite link has only one team
    teamId?: TEntityID;
    inviteToken: string;
    inviteTo: INVITE_USER_TO
  };

  export const LogInGuestSchema = Joi.object({
    body: {
      username: GuestNameSchema.required(),
      teamId: Joi.string(),
      inviteToken: Joi.string().required(),
      inviteTo: Joi.number().valid(INVITE_USER_TO.RETRO, INVITE_USER_TO.POKER).required(),
    },
  })
    .unknown(true);

  export const SignUpReqSchema = Joi.object({
    body: {
      username: UsernameSchema.required(),
      email: EmailSchema.required(),
      password: PasswordSchema.required(),
      inviteSpaceToken: Joi.string(),
    },
  })
    .unknown(true);

  export type TLogInGuestResResp = {
    user: TUser
  }

  export type TSignUpResResp = {
    user: TUser
  };

  // login
  export type TLogInBodyReq = {
    email: string;
    password: string;
    inviteSpaceToken?: string;
  };

  export const LogInReqSchema = Joi.object()
    .keys({
      body: {
        email: EmailSchema.required(),
        password: Joi.string()
          .required()
          .messages({
            'string.empty': transServer.t('schemas.auth.password.string.empty'),
          }),
        inviteSpaceToken: Joi.string(),
      },
    })
    .unknown(true);

  export type TLogInResResp = {
    user: TUser;
  };

  // google oauth
  export type TGoogleOauthBodyReq = {
    idToken: string;
    googleId: string;
    inviteSpaceToken?: string;
  };

  export type TGoogleOAuthResp = {
    user: TUser
  };

  // apple auth
  export type TAppleOauthBodyReq = {
    idToken: string;
    inviteSpaceToken?: string;
  };

  export type TAppleOauthResp = {
    user: TUser
  }

  // sign out
  export type TSignOutResResp = TSuccessVoidResult;
}
