import { pokerSessionsSchemas, TSuccessResponse } from '@chpokify/api-schemas';
import { TEntityID } from '@chpokify/models-types';

import { api } from '@lib/api';

const get = async (pokerSessionId: TEntityID) =>
  api.get<TSuccessResponse<pokerSessionsSchemas.TGetResResp>>(
    `/poker-sessions/${pokerSessionId}`
  );

const openRatingModal = async (pokerSessionId: TEntityID) =>
  api.get(
    `/poker-sessions/${pokerSessionId}/rating/modal`
  );

const setRatingModal = async (pokerSessionId: TEntityID, data: pokerSessionsSchemas.TSetRatingBodyReq) =>
  api.post(
    `/poker-sessions/${pokerSessionId}/rating/modal`,
    data
  );

const getList = async (spaceId: TEntityID) =>
  api.get<TSuccessResponse<pokerSessionsSchemas.TGetListResResp>>(`/poker-sessions/spaces/${spaceId}`);

const inviteGen = async (pokerSessionId: TEntityID, data:pokerSessionsSchemas.TGenInviteBodyReq) =>
  api.post<TSuccessResponse<pokerSessionsSchemas.TGenInviteResResp>>(
    `/poker-sessions/${pokerSessionId}/invite`,
    data
  );

const inviteTokenValidate = async (data: pokerSessionsSchemas.TValidateInviteBodyReq) =>
  api.post<TSuccessResponse<pokerSessionsSchemas.TValidateInviteResResp>>(
    '/poker-sessions/invite/validate',
    data
  );

const setInSession = async (
  pokerSessionId: TEntityID
) => api.post<TSuccessResponse<pokerSessionsSchemas.TSetInSessionResResp>>(
  `/poker-sessions/${pokerSessionId}/in-session`
);

// fetch with keepalive: request must survive page unload (axios can't do it)
const leaveSession = async (
  pokerSessionId: TEntityID
) => fetch(`${api.defaults.baseURL}/poker-sessions/${pokerSessionId}/out-session`, {
  method: 'POST',
  credentials: 'include',
  keepalive: true,
}).catch(() => undefined);

// moderate

const create = async (data: pokerSessionsSchemas.TCreateBodyReq) =>
  api.post<TSuccessResponse<pokerSessionsSchemas.TCreateResResp>>('/poker-sessions', data);

const remove = async (pokerSessionId: TEntityID) =>
  api.delete<TSuccessResponse<pokerSessionsSchemas.TRemoveResResp>>(
    `/poker-sessions/${pokerSessionId}/moderate`
  );

const update = async (pokerSessionId: TEntityID, data: pokerSessionsSchemas.TUpdateBodyReq) =>
  api.patch<TSuccessResponse<pokerSessionsSchemas.TUpdateResResp>>(
    `/poker-sessions/${pokerSessionId}/moderate`,
    data
  );

const storyAdd = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID
) => api.post<TSuccessResponse<pokerSessionsSchemas.TStoryAddResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}`
);

const storyAddMany = async (
  pokerSessionId: TEntityID,
  data: pokerSessionsSchemas.TStoryAddManyReq
) => api.post<TSuccessResponse<pokerSessionsSchemas.TStoryAddManyResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/many`,
  data
);

const storySetMany = async (
  pokerSessionId: TEntityID,
  data: pokerSessionsSchemas.TStorySetManyReq
) => api.post<TSuccessResponse<pokerSessionsSchemas.TStorySetManyResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/many/set`,
  data
);

const storiesSetSort = async (
  pokerSessionId: TEntityID,
  data: pokerSessionsSchemas.TStoriesSetSortReq
) => api.post<TSuccessResponse<pokerSessionsSchemas.TStoriesSetSortResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/sort`,
  data
);

const storyRemove = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID
) => api.delete<TSuccessResponse<pokerSessionsSchemas.TStoryAddResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}`
);

const storyStart = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID
) => api.post<TSuccessResponse<pokerSessionsSchemas.TStoryStartResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}/start`
);

const storyStop = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID
) => api.post<TSuccessResponse<pokerSessionsSchemas.TStoryStopResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}/stop`
);

const storyVoteAll = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID
) => api.post<TSuccessResponse<pokerSessionsSchemas.TStoryVoteAllResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}/vote-all`
);

const storyVoteAllCancel = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID
) => api.post<TSuccessResponse<pokerSessionsSchemas.TStoryVoteAllCancelResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}/vote-all/cancel`
);

const storyVoteTeam = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID,
  data: pokerSessionsSchemas.TStoryVoteBodyReq
) => api.post<TSuccessResponse<pokerSessionsSchemas.TStoryVoteResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}/vote`,
  data
);

const storyVoteCancelTeam = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID,
  data: pokerSessionsSchemas.TStoryVoteCancelBodyReq
) => api.post<TSuccessResponse<pokerSessionsSchemas.TStoryVoteCancelResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}/vote/cancel`,
  data
);

const storyRevealCards = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID
) => api.post<TSuccessResponse<pokerSessionsSchemas.TRevealResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}/reveal`
);

const storyTeamRevealCards = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID,
  teamId: TEntityID
) => api.post<TSuccessResponse<pokerSessionsSchemas.TTeamRevealResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}/teams/${teamId}/reveal`
);

const storyTeamScoresSet = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID,
  teamId: TEntityID,
  data: pokerSessionsSchemas.TTeamScoresSetBodyReq
) => api.post<TSuccessResponse<pokerSessionsSchemas.TTeamScoresSetResResp>>(
  `/poker-sessions/${pokerSessionId}/moderate/stories/${storyId}/teams/${teamId}/scores`,
  data
);

// play
const chooseCard = async (
  pokerSessionId: TEntityID,
  storyId: TEntityID,
  data: pokerSessionsSchemas.TChooseCardsBodyReq
) => api.post<TSuccessResponse<pokerSessionsSchemas.TChooseCardsResResp>>(
  `/poker-sessions/${pokerSessionId}/play/stories/${storyId}/choose-card`,
  data
);

// export
const exportCSV = async (pokerSessionId: TEntityID) =>
  api.get(`/poker-sessions/${pokerSessionId}/export/csv`, {
    responseType: 'blob',
  });

export const pokerSessionsApi = {
  get,
  openRatingModal,
  setRatingModal,
  getList,
  create,
  update,
  remove,
  storyAdd,
  storyAddMany,
  storySetMany,
  storyRemove,
  setInSession,
  leaveSession,
  storyStart,
  storyStop,
  storyVoteAll,
  storyVoteAllCancel,
  storyVoteTeam,
  storyVoteCancelTeam,
  storyRevealCards,
  storyTeamRevealCards,
  storyTeamScoresSet,
  chooseCard,
  exportCSV,
  inviteGen,
  inviteTokenValidate,
  storiesSetSort,
};
