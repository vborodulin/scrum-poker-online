import {
  isEqualsId, spaceHelpers, objectHelpers,
} from '@chpokify/helpers';
import { pokerSessionHelpers } from '@chpokify/helpers/pokerSession';
import { transServer } from '@chpokify/i18n';
import {
  TPokerCardDeck,
  TEntityID,
  TPokerCardDeckScores,
  STORY_SORT,
} from '@chpokify/models-types';
import {
  TInvitePokerSessionTokenPayload,
  TPokerSessionActive,
  TPokerSessionStoryResult,
  TPokerSessionTeamVoting,
  TPokerSessionVoting, TRatingPokerSession,
} from '@chpokify/models-types/pokerSession';
import { getJiraApiErrorMsg, JiraApi } from '@domains/jira/jiraApi';
import { get, set } from 'lodash';

import { BadRequestError, ERROR_CODES } from '@core/lib/errors';
import { jwtToken } from '@core/lib/jwtToken';

import { PokerCardDeckModel } from '@models/pokerCardDeck';
import { TPokerSessionDocument } from '@models/pokerSession';
import { SpaceModel, TSpaceDocument } from '@models/space';
import { TStoryDocument } from '@models/story';

type TCardDataChoose = {
    userId: TEntityID,
    teamId: TEntityID,
    storyId: TEntityID,
    cardId: TEntityID
};

class PokerSessionService {
  public constructor(private pokerSession: TPokerSessionDocument) {
  }

  private static setSortLowScore(storyScorePrev: number, storyScoreNext: number): number {
    if (storyScorePrev < storyScoreNext) {
      return -1;
    }

    return 1;
  }

  private static setSortHighScore(storyScorePrev: number, storyScoreNext: number): number {
    if (storyScorePrev > storyScoreNext) {
      return -1;
    }

    return 1;
  }

  public setSortByScores(sort: STORY_SORT): void {
    const { teamsIds } = this.pokerSession;
    const setSort = sort === STORY_SORT.HIGH_SCORE
      ? PokerSessionService.setSortHighScore
      : PokerSessionService.setSortLowScore;

    this.pokerSession.storiesIds.sort(
      (storyPrevId: TEntityID, storyNextId: TEntityID) => {
        const resultFromStoryPrev = this.pokerSession.results[storyPrevId.toString()];
        const resultFromStoryNext = this.pokerSession.results[storyNextId.toString()];
        const storyScorePrev = this.getStoryScores(teamsIds, resultFromStoryPrev);
        const storyScoreNext = this.getStoryScores(teamsIds, resultFromStoryNext);
        return setSort(storyScorePrev, storyScoreNext);
      }
    );

    this.pokerSession.markModified('storiesIds');
  }

  private getStoryScores(teamsIds: TEntityID[], resultFromStory?: TPokerSessionStoryResult): number {
    let score: number = 0;

    if (!resultFromStory?.teamsResult) {
      return score;
    }

    for (const teamId of teamsIds) {
      const resultFromTeam = resultFromStory.teamsResult[teamId as string] as Record<string, any>;

      if (resultFromTeam) {
        score += resultFromTeam.scores;
      }
    }

    return score;
  }

  public async saveScoreInFieldJira(story: TStoryDocument, jiraIntegrations: Record<string, any>)
        : Promise<string | undefined> {
    const {
      jira,
      results,
      teamsIds,
    } = this.pokerSession;
    const baseUrl = jira?.baseUrl as string;
    const jiraData = story?.jiraData;

    if (objectHelpers.isEmptyObject(jira as {})
            || objectHelpers.isEmptyObject(jiraIntegrations)
            || objectHelpers.isEmptyObject(jiraIntegrations[baseUrl])
            || !jiraData
    ) {
      return;
    }

    const keyIssue = jiraData?.key as string;
    const storyId = story._id;

    const fieldJiraUpdate = jira?.field?.id;
    const integration = jiraIntegrations[baseUrl];
    const jiraClient = JiraApi.getInstance(
      baseUrl,
      integration.accessToken,
      integration.accessTokenSecret
    );

    const resultFromStory = results[storyId];

    const score = this.getStoryScores(teamsIds, resultFromStory);

    const updateField = {
      fields: {
        [fieldJiraUpdate]: score,
      },
    };

    let res;

    try {
      await jiraClient.updateIssue(keyIssue, updateField);
    } catch (err) {
      const errorMessage = err.error.errors[fieldJiraUpdate] as string;
      const error = getJiraApiErrorMsg(err.statusCode, errorMessage);
      res = error;
    }

    return res;
  }

  public validateStoryActive(storyId: TEntityID) {
    if (!pokerSessionHelpers.getIsStoryActive(this.pokerSession, storyId)) {
      throw new BadRequestError(ERROR_CODES.UNMET_CONDITIONS_ERROR, [
        {
          message: transServer.t('errors.pokerSession.storyNotActive'),
          path: [],
        },
      ]);
    }
  }

  public validateStoryNotActive(storyId: TEntityID) {
    if (pokerSessionHelpers.getIsStoryActive(this.pokerSession, storyId)) {
      throw new BadRequestError(ERROR_CODES.UNMET_CONDITIONS_ERROR, [
        {
          message: transServer.t('errors.pokerSession.storyActive'),
          path: [],
        },
      ]);
    }
  }

  public validateStoryVoting(storyId: TEntityID) {
    if (!pokerSessionHelpers.getIsStoryVoting(this.pokerSession, storyId)) {
      throw new BadRequestError(ERROR_CODES.UNMET_CONDITIONS_ERROR, [
        {
          message: transServer.t('errors.pokerSession.storyNotVoting'),
          path: [],
        },
      ]);
    }
  }

  public validateStoryNotVoting(storyId: TEntityID) {
    if (pokerSessionHelpers.getIsStoryVoting(this.pokerSession, storyId)) {
      throw new BadRequestError(ERROR_CODES.UNMET_CONDITIONS_ERROR, [
        {
          message: transServer.t('errors.pokerSession.storyVoting'),
          path: [],
        },
      ]);
    }
  }

  public validateTeamVotingStory(storyId: TEntityID, teamId: TEntityID) {
    if (!pokerSessionHelpers.getIsStoryTeamVoting(this.pokerSession, storyId, teamId)) {
      throw new BadRequestError(ERROR_CODES.UNMET_CONDITIONS_ERROR, [
        {
          message: transServer.t('errors.pokerSession.teamNotVotingStory'),
          path: [],
        },
      ]);
    }
  }

  public validateTeamNotVotingStory(storyId: TEntityID, teamId: TEntityID) {
    if (pokerSessionHelpers.getIsStoryTeamVoting(this.pokerSession, storyId, teamId)) {
      throw new BadRequestError(ERROR_CODES.UNMET_CONDITIONS_ERROR, [
        {
          message: transServer.t('errors.pokerSession.teamVotingStory'),
          path: [],
        },
      ]);
    }
  }

  public addStory(storyId: TEntityID) {
    const hasStory = this.pokerSession.storiesIds.find((id) => isEqualsId(storyId, id));

    if (hasStory) {
      return;
    }

    this.pokerSession.storiesIds.push(storyId);

    this.pokerSession.results[storyId.toString()] = {
      duration: 0,
      teamsResult: {},
    };

    this.pokerSession.markModified('results');
  }

  public addManyStories(storiesIds: TEntityID[]) {
    storiesIds.forEach((storyId) => {
      this.addStory(storyId);
    });
  }

  public setRating(rating: Omit<TRatingPokerSession, 'userId'>, userId: TEntityID) {
    const ratingInPokerSession = this.pokerSession.rating as TRatingPokerSession[];

    const hasUserRatingIdx = ratingInPokerSession.findIndex((el) => isEqualsId(el.userId, userId));

    if (hasUserRatingIdx === -1) {
      ratingInPokerSession.push({
        userId,
        ...rating,
      });
      return;
    }

    ratingInPokerSession[hasUserRatingIdx].result = rating.result;
    ratingInPokerSession[hasUserRatingIdx].comment = rating.comment;
    ratingInPokerSession[hasUserRatingIdx].isAnonym = rating.isAnonym;
    ratingInPokerSession[hasUserRatingIdx].skip = rating.skip;
  }

  /**
   * Only reorders stories of the session: client list may be stale,
   * unknown ids are ignored and missing ids are kept at the end.
   */
  public setManyStories(storiesIds: TEntityID[]) {
    const currStoriesIds = this.pokerSession.storiesIds;

    const orderedStoriesIds = storiesIds.reduce((acc: TEntityID[], storyId) => {
      const currStoryId = currStoriesIds.find((id) => isEqualsId(id, storyId));

      if (currStoryId && !acc.some((id) => isEqualsId(id, currStoryId))) {
        acc.push(currStoryId);
      }

      return acc;
    }, []);

    const missedStoriesIds = currStoriesIds.filter(
      (id) => !orderedStoriesIds.some((orderedId) => isEqualsId(orderedId, id))
    );

    this.pokerSession.storiesIds = [
      ...orderedStoriesIds,
      ...missedStoriesIds,
    ];
  }

  public startStory(storyId: TEntityID) {
    this.storyActiveStop();

    this.pokerSession.active = {
      storyId,
      startedAt: new Date().toISOString(),
      voting: null,
    };

    this.pokerSession.markModified('active');
  }

  public storyActiveStop() {
    const activeStoryId = pokerSessionHelpers.getActiveStoryId(this.pokerSession);

    if (!activeStoryId) {
      return;
    }

    pokerSessionHelpers.incStoryResultActiveDuration(
            this.pokerSession as TPokerSessionActive,
            activeStoryId
    );

    this.pokerSession.active = null;

    this.pokerSession.markModified('active');
    this.pokerSession.markModified('results');
  }

  public removeStory(storyId: TEntityID) {
    const activeStoryId = pokerSessionHelpers.getActiveStoryId(this.pokerSession);

    if (isEqualsId(storyId, activeStoryId)) {
      this.storyActiveStop();
    }

    const updatedStoriesIds = this.pokerSession.storiesIds.filter((id) => !isEqualsId(id, storyId));
    this.pokerSession.set({
      storiesIds: updatedStoriesIds,
    });

    delete this.pokerSession.results[storyId.toString()];

    this.pokerSession.markModified('results');
  }

  public async voteAll(storyId: TEntityID) {
    this.validateStoryActive(storyId);

    const { teamsIds } = this.pokerSession;
    const activeVotingPokerSession = this.pokerSession as TPokerSessionDocument<TPokerSessionActive>;
    const { usersIds } = activeVotingPokerSession;
    const space = await SpaceModel.findById(activeVotingPokerSession.spaceId);

    if (!space) {
      throw new BadRequestError(ERROR_CODES.INVALID_PARAM, [
        {
          message: transServer.t('errors.space.notFound'),
          path: ['pokerSession', 'spaceId'],
        },
      ]);
    }

    activeVotingPokerSession.active.voting = teamsIds.reduce((acc, teamId) => {
      const teamUserIds = spaceHelpers.getTeamUsersIds(space, teamId);

      const hasUsersInSession = teamUserIds.some((teamUserId) =>
        usersIds.some((userId) =>
          isEqualsId(userId, teamUserId)));

      if (hasUsersInSession) {
        acc[teamId.toString()] = {
          teamId,
          userCards: {},
        } as TPokerSessionTeamVoting;
      }

      return acc;
    }, {});

    activeVotingPokerSession.markModified('active');
  }

  public voteAllCancel(storyId: TEntityID) {
    this.validateStoryActive(storyId);

    const activeVotingPokerSession = this.pokerSession as TPokerSessionActive;

    activeVotingPokerSession.active.voting = null;

    this.pokerSession.markModified('active');
  }

  public voteTeam(storyId: TEntityID, teamId: TEntityID) {
    this.validateStoryActive(storyId);

    const { active } = this.pokerSession as TPokerSessionActive;

    if (!active.voting) {
      active.voting = {};
    }

    active.voting[teamId.toString()] = {
      teamId,
      userCards: {},
    };

    this.pokerSession.markModified('active');
  }

  public voteTeamCancel(storyId: TEntityID, teamId: TEntityID) {
    this.validateStoryActive(storyId);
    this.validateStoryVoting(storyId);

    const { active } = this.pokerSession as TPokerSessionVoting;

    delete active.voting[teamId.toString()];

    if (!Object.keys(active.voting).length) {
      (this.pokerSession as TPokerSessionActive).active.voting = null;
    }

    this.pokerSession.markModified('active');
  }

  private async getCardSet(): Promise<TPokerCardDeck> {
    const { cardSetId } = this.pokerSession;

    // deck can be deleted while session uses it
    const cardSet = await PokerCardDeckModel.findOne({
      _id: cardSetId,
      withDeleted: true,
    });

    if (!cardSet) {
      throw new BadRequestError(ERROR_CODES.NOT_FOUND, [
        {
          message: transServer.t('errors.pokerCardDeck.notFound'),
          path: ['pokerSession', 'cardSetId'],
        },
      ]);
    }

    return cardSet;
  }

  public async reveal(storyId: TEntityID) {
    this.validateStoryActive(storyId);
    this.validateStoryVoting(storyId);

    const cardSet = await this.getCardSet();

    pokerSessionHelpers.incStoryResultVotingScores(
            this.pokerSession as TPokerSessionVoting,
            storyId,
            cardSet
    );

    set(this.pokerSession, 'active.voting', null);

    this.pokerSession.markModified('results');
    this.pokerSession.markModified('active');
  }

    public revealTeam = async (storyId: TEntityID, teamId: TEntityID) => {
      this.validateStoryActive(storyId);
      this.validateTeamVotingStory(storyId, teamId);

      const cardSet = await this.getCardSet();

      pokerSessionHelpers.incStoryResultTeamVotingScores(
            this.pokerSession as TPokerSessionVoting,
            storyId,
            teamId,
            cardSet
      );

      delete (this.pokerSession as TPokerSessionVoting).active.voting[teamId.toString()];

      this.pokerSession.markModified('results');
      this.pokerSession.markModified('active');
    };

    public async chooseCard({
      userId,
      teamId,
      storyId,
      cardId,
    }: TCardDataChoose) {
      this.validateStoryActive(storyId);
      this.validateTeamVotingStory(storyId, teamId);

      set(this.pokerSession, `active.voting.${teamId}.userCards.${userId}`, cardId);

      if (this.pokerSession.isAutoReveal) {
        const space = await SpaceModel.findById(this.pokerSession.spaceId);

        if (!space) {
          throw new BadRequestError(ERROR_CODES.INVALID_PARAM, [
            {
              message: transServer.t('errors.space.notFound'),
              path: ['pokerSession', 'spaceId'],
            },
          ]);
        }

        const isAllTeamVoted = pokerSessionHelpers.getIsAllTeamStoryVoted(
          this.pokerSession,
          space,
          teamId,
          storyId
        );

        if (isAllTeamVoted) {
          await this.revealTeam(storyId, teamId);
        }
      }

      this.pokerSession.markModified('active');
    }

    /**
     * Someone left the session: remaining online team members may have already voted.
     */
    public async autoRevealVotedTeams(space: TSpaceDocument) {
      const storyId = pokerSessionHelpers.getActiveStoryId(this.pokerSession);

      if (
        !this.pokerSession.isAutoReveal
        || !storyId
        || !pokerSessionHelpers.getIsStoryVoting(this.pokerSession, storyId)
      ) {
        return;
      }

      const { active } = this.pokerSession as TPokerSessionVoting;

      // collect teams before reveal: revealTeam removes team from voting
      const votedTeamsIds = Object.keys(active.voting).filter(
        (teamId) => pokerSessionHelpers.getIsAllTeamStoryVoted(this.pokerSession, space, teamId, storyId)
      );

      await Promise.all(
        votedTeamsIds.map((teamId) => this.revealTeam(storyId, teamId))
      );
    }

    public clearVoting() {
      this.pokerSession.set('active.voting', null);
      this.pokerSession.markModified('active');
    }

    public clearUsersCards() {
      Object.keys(this.pokerSession.results)
        .forEach((storyId) => {
          Object.keys(this.pokerSession.results[storyId].teamsResult)
            .forEach((teamId) => {
              const storyTeamResultPath = `results.${storyId}.teamsResult.${teamId}.userCards`;
              set(this.pokerSession, storyTeamResultPath, {});
            });
        });
      this.pokerSession.markModified('results');
    }

    public setTeamScore(storyId: TEntityID, teamId: TEntityID, scores: TPokerCardDeckScores) {
      const storyTeamResultPath = `results.${storyId}.teamsResult.${teamId}`;

      const storyTeamScores = get(
        this.pokerSession, storyTeamResultPath
      );

      if (storyTeamScores) {
        set(this.pokerSession, `${storyTeamResultPath}.scores`, scores);
      } else {
        set(this.pokerSession, storyTeamResultPath, {
          teamId,
          userCards: {},
          scores,
        });
      }

      set(this.pokerSession, `${storyTeamResultPath}.isEdited`, true);

      this.pokerSession.markModified('results');
    }

    public removeTeam(teamId: TEntityID) {
      const {
        results,
        teamsIds,
      } = this.pokerSession;

      this.pokerSession.teamsIds = teamsIds.filter((pokerTeamId) => !isEqualsId(pokerTeamId, teamId));

      Object.keys(results)
        .forEach((storyId) => {
          delete results[storyId].teamsResult[teamId.toString()];
        });

      const activeStoryId = pokerSessionHelpers.getActiveStoryId(this.pokerSession);

      if (activeStoryId && pokerSessionHelpers.getIsStoryVoting(this.pokerSession, activeStoryId)) {
        const { active } = this.pokerSession as TPokerSessionVoting;

        delete active.voting[teamId.toString()];

        if (!Object.keys(active.voting).length) {
          (this.pokerSession as TPokerSessionActive).active.voting = null;
        }

        this.pokerSession.markModified('active');
      }

      this.pokerSession.markModified('results');
    }

    public genInviteToken(space: TSpaceDocument, teamsIds: TEntityID[]) {
      const spaceId = space._id;
      const teams = space.teams.filter((team) => teamsIds.includes(team._id.toString()));
      const payload: TInvitePokerSessionTokenPayload = {
        spaceId,
        teams,
        pokerSessionId: this.pokerSession._id,
      };
      return jwtToken.signInInviteToken(payload);
    }
}

export { PokerSessionService };
