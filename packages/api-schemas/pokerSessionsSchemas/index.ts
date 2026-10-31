import { transServer } from '@chpokify/i18n';
import {
  TEntityID, TPokerCardDeckScores, STORY_SORT,
} from '@chpokify/models-types';
import {
  POKER_SESSION_TITLE_MAX_LENGTH,
  POKER_SESSION_TITLE_MIN_LENGTH, TInvitePokerSessionTokenPayload,
  TPokerSession,
} from '@chpokify/models-types/pokerSession';
import Joi from '@hapi/joi';

import { coreSchemas, TSuccessVoidResult } from '../coreSchemas';

export namespace pokerSessionsSchemas {
  export const TitleSchema = Joi.string()
    .min(POKER_SESSION_TITLE_MIN_LENGTH)
    .max(POKER_SESSION_TITLE_MAX_LENGTH)
    .empty('')
    .messages({
      'string.min': transServer.t('schemas.pokerSession.title.string.min', {
        min: POKER_SESSION_TITLE_MIN_LENGTH,
        max: POKER_SESSION_TITLE_MAX_LENGTH,
      }),
      'string.max': transServer.t('schemas.pokerSession.title.string.max', {
        min: POKER_SESSION_TITLE_MIN_LENGTH,
        max: POKER_SESSION_TITLE_MAX_LENGTH,
      }),
    });

  const RatingSchema = Joi.object({
    skip: Joi.boolean(),
    comment: Joi.string()
      .empty(''),
    isAnonym: Joi.alternatives()
      .conditional('skip', {
        is: false,
        then: Joi.boolean()
          .required(),
      }),
    result: Joi.alternatives()
      .conditional('skip', {
        is: false,
        then: Joi.number()
          .required(),
      }),
  });

  export const DESCRIPTION_LENGTH_MAX = 300;

  export const DescriptionSchema = Joi.string()
    .max(DESCRIPTION_LENGTH_MAX)
    .empty('')
    .messages({
      'string.max': transServer.t('schemas.pokerSession.description.string.max', {
        max: DESCRIPTION_LENGTH_MAX,
      }),
    });

  export const TeamIdsSchema = Joi.array()
    .items(coreSchemas.ObjectIdSchema);

  const ScoresSchema = Joi.number()
    .positive()
    .allow(0)
    .allow(null)
    .required();

  const PokerSessionCreateSchema = Joi.object({
    spaceId: coreSchemas.ObjectIdSchema.required(),
    cardSetId: coreSchemas.ObjectIdSchema.required(),
    title: TitleSchema,
    description: DescriptionSchema,
    teamsIds: TeamIdsSchema.required(),
    isAutoReveal: Joi.bool(),
  })
    .unknown(true);

  const inviteSpaceTokenSchema = Joi
    .string()
    .messages({
      'string.empty': transServer.t('schemas.pokerSession.inviteToken.string.empty'),
    });

  export const validateInviteReqSchema = Joi.object({
    body: {
      token: inviteSpaceTokenSchema.required(),
    },
  })
    .unknown(true);

  export const inviteGenSchema = Joi.object({
    body: {
      teamsIds: TeamIdsSchema.required(),
      locale: Joi.string()
        .required(),
    },
  })
    .unknown(true);

  export type TValidateInviteBodyReq = {
    token: string;
  }
  export type TGenInviteBodyReq = {
    teamsIds: TEntityID[];
    locale: string
  }

  export type TValidateInviteResResp = {
    inviteTokenPayload: TInvitePokerSessionTokenPayload
  };

  // get
  export type TGetResResp = {
    pokerSession: TPokerSession
  }

  // get list

  export type TGetListResResp = {
    pokerSessions: TPokerSession[];
  }
  export type TGenInviteResResp = {
    url: string;
  };
  export type TRatingBodyReq = {
    comment?: string;
    result?: number,
    isAnonym?: boolean,
    skip?: boolean,
  }

  // create
  export type TCreateBodyReq = {
    spaceId: TPokerSession['spaceId'];
    cardSetId: TPokerSession['cardSetId'];
    title?: TPokerSession['title'];
    description?: TPokerSession['description'];
    teamsIds?: TEntityID[];
    isAutoReveal?: boolean;
  }

  export const createSchema = Joi.object({
    body: PokerSessionCreateSchema,
  })
    .unknown(true);

  export type TCreateResResp = {
    pokerSession: TPokerSession
  }

  // update
  export type TUpdateBodyReq = {
    title?: TPokerSession['title'];
    cardSetId?: TPokerSession['cardSetId'];
    description?: TPokerSession['description'];
    teamsIds?: TPokerSession['teamsIds'];
    isAutoReveal?: boolean;
  };
  // setRating
  export type TSetRatingBodyReq = {
    rating: TRatingBodyReq
  };

  export const setRatingSchema = Joi.object({
    body: {
      rating: RatingSchema.required(),
    },
  })
    .unknown(true);

  export const updateSchema = Joi.object({
    body: {
      title: TitleSchema,
      description: DescriptionSchema,
      teamsIds: TeamIdsSchema,
      isAutoReveal: Joi.bool(),
      cardSetId: coreSchemas.ObjectIdSchema,
    },
  })
    .unknown(true);

  export type TUpdateResResp = {
    pokerSession: TPokerSession
  }

  // remove
  export type TRemoveResResp = TSuccessVoidResult;

  // set in session
  export type TSetInSessionResResp = TSuccessVoidResult;

  // story add
  export type TStoryAddResResp = {
    pokerSession: TPokerSession
  }

  // story add many
  export type TStoryAddManyReq = {
    storiesIds: TEntityID[];
  };

  export const storiesAddManySchema = Joi.object({
    body: {
      storiesIds: Joi.array()
        .items(coreSchemas.ObjectIdSchema),
    },
  })
    .unknown(true);

  export type TStoryAddManyResResp = {
    pokerSession: TPokerSession
  };

  // story add manu
  export type TStorySetManyReq = {
    storiesIds: TEntityID[];
  }

  // story sort
  export type TStoriesSetSortReq = {
    sort: STORY_SORT;
  }

  export const storiesSetManySchema = Joi.object({
    body: {
      storiesIds: Joi.array()
        .items(coreSchemas.ObjectIdSchema),
    },
  })
    .unknown(true);

  export const storiesSetSortSchema = Joi.object({
    body: {
      sort: Joi.number()
        .valid(STORY_SORT.LOW_SCORE, STORY_SORT.HIGH_SCORE),
    },
  })
    .unknown(true);

  export type TStorySetManyResResp = {
    pokerSession: TPokerSession
  };

  export type TStoriesSetSortResResp = {
    pokerSession: TPokerSession
  };

  // story remove
  export type TStoryRemoveResResp = {
    pokerSession: TPokerSession
  }

  // story start
  export type TStoryStartResResp = {
    pokerSession: TPokerSession
  }

  // story stop
  export type TStoryStopResResp = {
    pokerSession: TPokerSession
  }

  // vote all start
  export type TStoryVoteAllResResp = {
    pokerSession: TPokerSession
  }

  // vote all cancel
  export type TStoryVoteAllCancelResResp = {
    pokerSession: TPokerSession
  }

  // vote start
  export type TStoryVoteBodyReq = {
    teamId: TEntityID;
  }

  export const storyVoteSchema = Joi.object({
    body: {
      teamId: coreSchemas.ObjectIdSchema.required(),
    },
  })
    .unknown(true);

  export type TStoryVoteResResp = {
    pokerSession: TPokerSession
  }

  // vote cancel
  export type TStoryVoteCancelBodyReq = {
    teamId: TEntityID;
  };

  export const storyVoteCancelSchema = Joi.object({
    body: {
      teamId: coreSchemas.ObjectIdSchema.required(),
    },
  })
    .unknown(true);

  export type TStoryVoteCancelResResp = {
    pokerSession: TPokerSession
  };

  // reveal cards
  export type TRevealResResp = {
    pokerSession: TPokerSession
  }

  // team reveal cards
  export type TTeamRevealResResp = {
    pokerSession: TPokerSession
  }

  // choose cards

  export type TChooseCardsBodyReq = {
    teamId: TEntityID;
    cardId: TEntityID;
  };

  export const chooseCardsSchema = Joi.object({
    body: {
      teamId: coreSchemas.ObjectIdSchema.required(),
      cardId: Joi.string()
        .required(),
    },
  })
    .unknown();

  export type TChooseCardsResResp = {
    pokerSession: TPokerSession
  }

  // team scores set
  export type TTeamScoresSetBodyReq = {
    scores: TPokerCardDeckScores
  }

  export const TeamScoresSetSchema = Joi.object({
    body: {
      scores: ScoresSchema,
    },
  })
    .unknown();

  export type TTeamScoresSetResResp = {
    pokerSession: TPokerSession,
  };
}
