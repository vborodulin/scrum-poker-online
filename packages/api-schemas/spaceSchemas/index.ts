import { transServer } from '@chpokify/i18n';
import {
  SPACE_NAME_MAX_LENGTH,
  SPACE_NAME_MIN_LENGTH,
  TInviteTokenPayload,
  TSpace,
  TSpaceStat,
} from '@chpokify/models-types';
import Joi from '@hapi/joi';

export { teamsSchemas } from '../teamsSchemas';
export { pokerSessionsSchemas } from '../pokerSessionsSchemas';
export { participantsSchemas } from '../participantsSchemas';

export namespace spacesSchemas {
  export const spaceNameSchema = Joi
    .string()
    .min(SPACE_NAME_MIN_LENGTH)
    .max(SPACE_NAME_MAX_LENGTH)
    .messages({
      'string.min': transServer.t('schemas.space.name.string.min', {
        min: SPACE_NAME_MIN_LENGTH,
        max: SPACE_NAME_MAX_LENGTH,
      }),
      'string.max': transServer.t('schemas.space.name.string.max', {
        min: SPACE_NAME_MIN_LENGTH,
        max: SPACE_NAME_MAX_LENGTH,
      }),
      'string.empty': transServer.t('schemas.space.name.string.empty'),
    });

  export const inviteSpaceTokenSchema = Joi
    .string()
    .messages({
      'string.empty': transServer.t('schemas.space.inviteToken.string.empty'),
    });

  // get space

  export type TGetResResp = {
    space: TSpace;
  }

  // user participant in

  export type TMyListResResp = {
    spaces: TSpace[];
  };

  // create space

  export type TCreateBodyReq = {
    name: string
  }

  export const createReqSchema = Joi.object({
    body: {
      name: spaceNameSchema.required(),
    },
  })
    .unknown(true);

  export type TCreateResResp = {
    space: TSpace;
  };

  // update space

  export type TUpdateBodyReq = {
    name?: string
  }

  export const updateReqSchema = Joi.object({
    body: Joi.object({
      name: spaceNameSchema,
    }),
  })
    .unknown(true);

  export type TUpdateResResp = {
    space: TSpace;
  }

  // delete space
  export type TDeleteResResp = {
    space: TSpace
  };

  // invite validate

  export type TValidateInviteBodyReq = {
    token: string;
  }

  export const validateInviteReqSchema = Joi.object({
    body: {
      token: inviteSpaceTokenSchema.required(),
    },
  })
    .unknown(true);

  export type TValidateInviteResResp = {
    inviteTokenPayload: TInviteTokenPayload
  };

  // invite gen
  export type TGenInviteResResp = {
    url: string;
  };

  // invite accept
  export type TInviteAcceptBodyReq = {
    token: string;
  }

  export const inviteAcceptReqSchema = Joi.object({
    body: {
      token: inviteSpaceTokenSchema.required(),
    },
  })
    .unknown(true);

  export type TInviteAcceptResResp = {
    space: TSpace
  };

  // get stat
  export type TGetStatResResp = TSpaceStat;
}
