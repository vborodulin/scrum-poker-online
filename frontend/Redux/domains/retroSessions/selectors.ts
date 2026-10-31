import { TEntityID, TRetroSession } from '@chpokify/models-types';
import { createSelector } from '@reduxjs/toolkit';
import { compact } from 'lodash';

import { TAppState } from '@Redux/types';

const getRetroSessions = ({ retroSessions }: TAppState) => retroSessions;

const getEntities = createSelector(
  getRetroSessions,
  (retroSessions) => retroSessions.entities
);

const getCurrId = createSelector(
  getRetroSessions,
  (retroSessions) => retroSessions.retroSessionId
);

const getIsColumnActionsSidebarOpen = createSelector(
  getRetroSessions,
  (retroSessions) => retroSessions.isColumnActionsSidebarOpen
);

const getInvite = createSelector(
  getRetroSessions,
  (retroSessions) => retroSessions.invite
);

const getCountAllEntities = createSelector(
  getRetroSessions,
  (retroSessions) => retroSessions.countEntities
);

const getIdsList = createSelector(
  getRetroSessions,
  (retroSessions) => Object.keys(retroSessions.entities)
);

const getCountEntities = createSelector(
  getIdsList,
  (entitiesIds) => entitiesIds.length
);

const getList = createSelector(
  getEntities,
  (entities) => compact(Object.values(entities)) as TRetroSession[]
);

const getTemplatesIdsList = createSelector(
  getList,
  (retroSessions) => {
    if (!retroSessions.length) {
      return [];
    }

    return retroSessions.map((retroSession) => retroSession.templateId);
  }
);

const getById = createSelector(
  getEntities,
  (entities) => (retroSessionId: TEntityID | undefined) => {
    if (!retroSessionId) {
      return undefined;
    }

    return entities[retroSessionId.toString()];
  }
);

const getListSortDeskCreatedAt = createSelector(
  getList,
  (list) =>
    list.sort((a, b) =>
      // @ts-ignore
      (a?.createdAt > b?.createdAt ? -1 : 1))
);

const getListIdsSortDesk = createSelector(
  getListSortDeskCreatedAt,
  (retroSessionsList) => retroSessionsList.map((retroSession) => retroSession._id)
);

const getLastEntity = createSelector(
  getListSortDeskCreatedAt,
  (list) => {
    if (!list.length) {
      return undefined;
    }

    return list[0] as TRetroSession;
  }
);

const getLastEntityId = createSelector(
  getLastEntity,
  (retroSession) => {
    if (!retroSession) {
      return undefined;
    }

    return retroSession._id;
  }
);

const getLastEntityTemplateId = createSelector(
  getLastEntity,
  (retroSession) => {
    if (!retroSession) {
      return undefined;
    }

    return retroSession.templateId;
  }
);

/**
 * SELECTORS FROM CURR SESSION
 */
const getCurr = createSelector(
  [
    getEntities,
    getCurrId,
  ],
  (entities, retroSessionId) => entities[retroSessionId.toString()]
);

const getTemplateId = createSelector(
  getCurr,
  (retroSession) => retroSession?.templateId
);

const getIsHiddenCards = createSelector(
  getCurr,
  (retroSession) => !!retroSession?.isHiddenCards
);

const getCanEditCards = createSelector(
  getCurr,
  (retroSession) => !!retroSession?.canEditCards
);

const getIsHiddenUserNameCards = createSelector(
  getCurr,
  (retroSession) => !!retroSession?.isHiddenUserNameCards
);

const getCanMoveCards = createSelector(
  getCurr,
  (retroSession) => !!retroSession?.canMoveCards
);

const getIsDisableVotingCards = createSelector(
  getCurr,
  (retroSession) => !!retroSession?.isDisableVotingCards
);

const getMaxVotesCard = createSelector(
  getCurr,
  (retroSession) => retroSession?.maxVotesCard || 0
);

const getIsHiddenVoteCountCards = createSelector(
  getCurr,
  (retroSession) => !!retroSession?.isHiddenVoteCountCards
);

const getIsOneVoteCards = createSelector(
  getCurr,
  (retroSession) => !!retroSession?.isOneVoteCards
);

const getIsSortByVotesCount = createSelector(
  getCurr,
  (retroSession) => !!retroSession?.isSortByVotesCount
);

const getIsHiddenDescriptionCards = createSelector(
  getCurr,
  (retroSession) => !!retroSession?.isHiddenDescriptionCards
);

const getInviteTokenPayload = createSelector(
  getInvite,
  (invite) => invite?.payload
);

const getInviteToken = createSelector(
  getInvite,
  (invite) => invite?.token
);

const getTitle = createSelector(
  getCurr,
  (retroSession) => retroSession?.title
);

const getDescription = createSelector(
  getCurr,
  (retroSession) => retroSession?.description
);

const getTitleById = createSelector(
  getById,
  (getByIdSelector) => (retroSessionId: TEntityID | undefined) => {
    const entity = getByIdSelector(retroSessionId);

    if (!entity) {
      return undefined;
    }

    return entity.title;
  }
);

const getCreatedAtById = createSelector(
  getById,
  (getByIdSelector) => (retroSessionId: TEntityID | undefined) => {
    const entity = getByIdSelector(retroSessionId);

    if (!entity) {
      return undefined;
    }

    return entity.createdAt;
  }
);

export const retroSessionsSelectors = {
  getEntities,
  getIdsList,
  getById,
  getLastEntity,
  getLastEntityId,
  getListIdsSortDesk,
  getCurrId,
  getCurr,
  getTemplateId,
  getIsColumnActionsSidebarOpen,
  getIsHiddenCards,
  getCanEditCards,
  getTemplatesIdsList,
  getIsHiddenUserNameCards,
  getCanMoveCards,
  getLastEntityTemplateId,

  getIsDisableVotingCards,
  getIsHiddenVoteCountCards,
  getMaxVotesCard,

  getInviteTokenPayload,
  getInviteToken,

  getTitle,
  getDescription,
  getIsOneVoteCards,
  getIsSortByVotesCount,
  getIsHiddenDescriptionCards,
  getCountAllEntities,
  getCountEntities,

  getTitleById,
  getCreatedAtById,
};
