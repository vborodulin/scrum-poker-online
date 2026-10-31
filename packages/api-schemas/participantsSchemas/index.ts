import {
  SPACE_PARTICIPANT_ROLE,
  TEntityID,
  TSpace,
} from '@chpokify/models-types';
import Joi from '@hapi/joi';

import { coreSchemas } from '../coreSchemas';

export namespace participantsSchemas {
  // update participant

  export type TUpdateBodyReq = {
    role?: SPACE_PARTICIPANT_ROLE
  };

  export const updateSchema = Joi.object({
    body: Joi.object({
      role: Joi.number()
        .min(1)
        .max(4)
        .integer(),
    }),
  })
    .unknown(true);

  export type TUpdateResResp = {
    space: TSpace
  };

  // remove participant

  export type TRemoveResResp = {
    space: TSpace;
  };

  // participant leave

  export type TLeaveResResp = {
    space: TSpace
  };

  // toggle admin
  export type TSetAdminRoleReq = {
    isAdmin: boolean;
  };

  export const setAdminRoleReqSchema = Joi.object({
    body: Joi.object({
      isAdmin: Joi.bool()
        .required(),
    }),
  })
    .unknown(true);

  const TeamsIdsSchema = Joi.array()
    .items(coreSchemas.ObjectIdSchema);

  export const UpdateToManyTeamSchema = Joi.object({
    params: {
      participantId: coreSchemas.ObjectIdSchema.required(),
    },
    body: {
      teamsIds: TeamsIdsSchema.required(),
    },
  })
    .unknown(true);

  export type TUpdateTeamsBodyReq = {
    teamsIds: TEntityID[];
  }

  export type TUpdateTeamsResResp = {
    space: TSpace
  }

  export type TSetAdminRoleResp = {
    space: TSpace
  };
}
