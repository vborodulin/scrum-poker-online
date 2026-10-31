import { TSuccessResponse, spacesSchemas } from '@chpokify/api-schemas';
import { TEntityID } from '@chpokify/models-types';

import { api } from '@lib/api';

const create = async (data: spacesSchemas.TCreateBodyReq) =>
  api.post<TSuccessResponse<spacesSchemas.TCreateResResp>>(
    '/spaces/',
    data
  );

const getMyList = async () =>
  api.get<TSuccessResponse<spacesSchemas.TMyListResResp>>(
    '/spaces/list/me'
  );

const inviteValidate = async (data: spacesSchemas.TValidateInviteBodyReq) =>
  api.post<TSuccessResponse<spacesSchemas.TValidateInviteResResp>>(
    '/spaces/invite/validate',
    data
  );

const inviteAccept = async (spaceId: TEntityID, data: spacesSchemas.TInviteAcceptBodyReq) =>
  api.post<TSuccessResponse<spacesSchemas.TInviteAcceptResResp>>(
    '/spaces/invite/accept',
    data
  );

const inviteGen = async (spaceId: TEntityID) =>
  api.post<TSuccessResponse<spacesSchemas.TGenInviteResResp>>(
    `/spaces/${spaceId}/invite`
  );

const get = async (spaceId: TEntityID) =>
  api.get<TSuccessResponse<spacesSchemas.TGetResResp>>(
    `/spaces/${spaceId}`
  );

const update = async (
  spaceId: TEntityID,
  data: spacesSchemas.TUpdateBodyReq
) =>
  api.patch<TSuccessResponse<spacesSchemas.TUpdateResResp>>(
    `/spaces/${spaceId}`,
    data
  );

const remove = async (spaceId: TEntityID) =>
  api.delete<TSuccessResponse<spacesSchemas.TDeleteResResp>>(
    `/spaces/${spaceId}`
  );

const getStat = async (spaceId: TEntityID) => (
  api.get<TSuccessResponse<spacesSchemas.TGetStatResResp>>(
    `/spaces/${spaceId}/stat`
  ));

export { participantsApi } from './participants';
export { pokerSessionsApi } from './pokerSessions';
export { teamsApi } from './teams';

export const spacesApi = {
  create,
  getMyList,
  inviteValidate,
  inviteAccept,
  inviteGen,
  get,
  update,
  remove,
  getStat,
};
