import {
  arrayHelpers,
  isEqualsId,
  spaceHelpers,
} from '@chpokify/helpers';
import { pokerSessionHelpers } from '@chpokify/helpers/pokerSession';
import {
  SPACE_PARTICIPANT_ROLE,
  TEntityID,
  TSpaceStat,
  TTeam,
} from '@chpokify/models-types';
import { leaveSpaceRooms } from '@socket';
import { ObjectID } from 'bson';

import { jwtToken } from '@core/lib/jwtToken';

import { PokerSessionModel } from '@models/pokerSession';
import {
  SpaceModel,
  TInviteTokenPayload,
  TSpaceDocument,
  TTeamDocument,
} from '@models/space';
import { StoryModel } from '@models/story';

class SpaceService {
  public hasParticipant(userId: TEntityID) {
    const participant = spaceHelpers.getParticipant(this.space, userId);
    return !!participant;
  }

  private async addParticipant(userId: TEntityID, teamId?: TEntityID) {
    const participant = spaceHelpers.getParticipant(this.space, userId);
    const participantId = participant ? participant._id : new ObjectID();

    if (!participant) {
      this.space.participants.push({
        _id: participantId,
        userId,
        role: SPACE_PARTICIPANT_ROLE.PLAYER,
      });
    }

    if (teamId) {
      this.addParticipantToTeam(participantId, teamId);
    }

    await this.space.save();
  }

  private async transferAdminRoleToRandom(isSave?: boolean) {
    const randomParticipant = this.space.participants[arrayHelpers.getRandomIndex(this.space.participants.length)];

    if (!randomParticipant) {
      return;
    }

    randomParticipant.role = SPACE_PARTICIPANT_ROLE.ADMIN;

    if (isSave) {
      await this.space.save();
    }
  }

  public hasParticipantsDoubleTeams(participantsIds: TTeam['participantsIds']) {
    return this.space.teams.some(
      (team) => team.participantsIds.some(
        (participantId) => participantsIds.includes(participantId.toString())
      )
    );
  }

  public async removeParticipant(participantId: TEntityID) {
    const isLastAdmin = spaceHelpers.getIsLastAdmin(this.space, participantId);

    if (isLastAdmin) {
      await this.transferAdminRoleToRandom();
    }

    const participant = this.space.participants.find((p) => isEqualsId(p._id, participantId));

    this.space.participants.pull(participantId);

    this.space.teams.forEach((team) => {
      team.participantsIds = team.participantsIds.filter((id) => !isEqualsId(id, participantId));
    });

    // post save hook notifies removed user via space room, so leave rooms only after save
    await this.space.save();

    if (participant) {
      leaveSpaceRooms(participant.userId, this.space._id);
    }
  }

  public constructor(private space: TSpaceDocument) {
  }

  public async getIsUserInTeam(userId: TEntityID) {
    const userParticipant = this.space.participants.find(
      (participant) => isEqualsId(participant.userId, userId)
    );

    if (!userParticipant) {
      return false;
    }

    return this.space.teams.some(
      (team) => team.participantsIds.some(
        (participantId) => isEqualsId(participantId, userParticipant._id)
      )
    );
  }

  public async addParticipantByInvitePokerSession(
    userId: TEntityID,
    teamId: TEntityID
  ): Promise<void> {
    await this.addParticipant(userId, teamId);
  }

  public static async addParticipantByInvite(
    userId: TEntityID,
    userEmail: string,
    inviteToken?: string
  ): Promise<{ space?: TSpaceDocument, tokenPayload?: TInviteTokenPayload }> {
    try {
      if (!inviteToken) {
        return {};
      }

      const validateTokenRes = jwtToken.validateToken<TInviteTokenPayload>(inviteToken);

      if ('err' in validateTokenRes) {
        return {};
      }

      const tokenPayload = validateTokenRes.data;
      const {
        email,
        team,
        space: spacePreview,
      } = tokenPayload;

      if (email && email !== userEmail) {
        return {};
      }

      const space = await SpaceModel.findById(spacePreview._id);

      if (!space) {
        return {
          tokenPayload,
        };
      }

      const spaceService = new SpaceService(space);
      await spaceService.addParticipant(userId, team?._id);

      return {
        space,
        tokenPayload,
      };
    } catch (err) {
      return {};
    }
  }

  public genInviteToken(email: string = '', teamId?: TEntityID) {
    const team: TTeamDocument | null = teamId && this.space.teams.id(teamId) || null;

    const payload: TInviteTokenPayload = {
      space: {
        _id: this.space._id,
        name: this.space.name,
      },
      team,
      email,
    };

    return jwtToken.signInInviteToken(payload);
  }

  public updateTeamsFromParticipant(participantId: TEntityID, teamsIds: TEntityID[]) {
    this.space.teams.forEach((team) => {
      if (teamsIds.includes(team._id.toString())) {
        this.addParticipantToTeam(participantId, team._id);
      } else {
        team.participantsIds = team.participantsIds.filter((id) => !isEqualsId(id, participantId));
      }
    });
  }

  public addParticipantToTeam(participantId: TEntityID, teamId: TEntityID) {
    const team = this.space.teams.id(teamId);

    if (!team) {
      return;
    }

    const isUserInTeam = team.participantsIds.some((id) => isEqualsId(participantId, id));

    if (isUserInTeam) {
      return;
    }

    team.participantsIds.push(participantId);
  }

  public async getStat(): Promise<TSpaceStat> {
    const storiesCount = await StoryModel.find({
      spaceId: this.space._id,
      withDeleted: true,
    })
      .count();

    const pokerSessions = await PokerSessionModel.find({
      spaceId: this.space._id,
      withDeleted: true,
    });
    const sessionsCount = pokerSessions.length;

    let storiesSumCount = 0;
    let storiesSumDuration = 0;
    pokerSessions.forEach((pokerSession) => {
      pokerSession.storiesIds.forEach((storyId) => {
        const storyDuration = pokerSessionHelpers.getStoryDuration(pokerSession, storyId);

        if (storyDuration > 0) {
          storiesSumDuration += storyDuration;
          storiesSumCount++;
        }
      });
    });

    const storyAverageTime = Math.round(storiesSumDuration / storiesSumCount);

    let sessionsSumCount = 0;
    let sessionsSumDuration = 0;
    pokerSessions.forEach((pokerSession) => {
      const duration = pokerSessionHelpers.getDuration(pokerSession);

      if (duration > 0) {
        sessionsSumDuration += duration;
        sessionsSumCount++;
      }
    });

    const sessionAverageTime = Math.round(sessionsSumDuration / sessionsSumCount);

    return {
      storiesCount,
      sessionsCount,
      storyAverageTime,
      sessionAverageTime,
    };
  }
}

export {
  SpaceService,
};
