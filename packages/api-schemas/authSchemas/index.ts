import { transServer } from '@chpokify/i18n';
import {
  INVITE_USER_TO,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  TEntityID,
  TResetPasswordTokenPayload,
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

  export const ResetPasswordTokenSchema = Joi
    .string()
    .messages({
      'string.empty': transServer.t('schemas.auth.resetPasswordToken.string.empty'),
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

  // join session guest
  export type TLogInGuestBodyReq = {
    email: string;
    teamId: TEntityID
    inviteToken: string;
    inviteTo: INVITE_USER_TO
  };

  export const LogInGuestSchema = Joi.object({
    body: {
      email: EmailSchema.required(),
      teamId: Joi.string()
        .messages({
          'string.empty': transServer.t('schemas.authGuest.teamId.string.empty'),
        })
        .required(),
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

  // sign in crypto
  export type TSignInCryptoBodyReq = {
    message: string;
    signature: string;
    inviteSpaceToken?: string;
  }

  export const SignInCryptoReqSchema = Joi.object()
    .keys({
      body: {
        message: Joi.string().required(),
        signature: Joi.string().required(),
        inviteSpaceToken: Joi.string(),
      },
    })
    .unknown(true);

  export type TSignInCryptoResp = {
    user: TUser;
  }

  // sign up in crypto
  export type TSignUpCryptoBodyReq = {
    code: string;
    redirectUri: string;
    message: string;
    signature: string;
    inviteSpaceToken?: string;
  }

  export const SignUpCryptoReqSchema = Joi.object()
    .keys({
      body: {
        code: Joi.string().required(),
        redirectUri: Joi.string().required(),
        message: Joi.string().required(),
        signature: Joi.string().required(),
        inviteSpaceToken: Joi.string(),
      },
    })
    .unknown(true);

  export type TSignUpCryptoResp = {
    user: TUser;
  }

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

  // request restore password

  export type TRestorePasswordBodyReq = {
    email: string;
  };

  export const RestorePasswordReqSchema = Joi.object({
    body: {
      email: EmailSchema.required(),
    },
  })
    .unknown(true);

  export type TRestorePasswordResResp = TSuccessVoidResult;

  // reset password

  export type TResetPasswordBodyReq = {
    token: string;
    password: string;
  };

  export const ResetPasswordReqSchema = Joi.object({
    body: {
      token: Joi.string()
        .required(),
      password: PasswordSchema.required(),
    },
  })
    .unknown(true);

  export type TResetPasswordResResp = TSuccessVoidResult;

  // reset password token

  export type TValidateResetPasswordTokenBodyReq = {
    token: string;
  };

  export const ValidateResetPasswordTokenReqSchema = Joi.object({
    body: {
      token: ResetPasswordTokenSchema.required(),
    },
  })
    .unknown(true);

  export type TValidateResetPasswordTokenResResp = {
    resetPasswordTokenPayload: TResetPasswordTokenPayload;
  };
}
