import { isEqualsId, spaceHelpers } from '@chpokify/helpers';
import { SPACE_PARTICIPANT_ROLE, TEntityID } from '@chpokify/models-types';
import { updatePokerSession } from '@pokerSessions/services/updatePokerSession';
import config from 'config';

import { log } from '@core/lib/logger';

import { emitPokerSessionUpdate, PokerSessionModel, TPokerSessionDocument } from '@models/pokerSession';
import { SpaceModel } from '@models/space';

const POKER_SESSION_USER_REMOVE_ONLINE_INTERVAL = config.get('poker.userRemoveOnlineInterval') as number;
const POKER_SESSION_USER_LEAVE_INTERVAL = config.get('poker.userLeaveInterval') as number;

/**
 * Online in poker session:
 * - heartbeat keeps user in session; without heartbeat (locked phone) user stays for a long interval,
 * - closed page sends leave: user is removed after a short delay.
 * Timers live in process memory, so the server must run as a single instance.
 * usersIds are updated atomically ($addToSet / $pull) to avoid lost updates
 * between concurrent heartbeats of different users.
 */
class UsersInSessions {
  private timers = new Map<string, NodeJS.Timeout>();

  private getTimerKey(pokerSessionId: TEntityID, userId: TEntityID): string {
    return `${pokerSessionId}:${userId}`;
  }

  private removeTimer(timerKey: string) {
    const timerId = this.timers.get(timerKey);

    if (!timerId) {
      return;
    }

    global.clearTimeout(timerId);
    this.timers.delete(timerKey);
  }

  private runTimeoutRemoveUserFromSession(
    pokerSessionId: TEntityID,
    userId: TEntityID,
    interval: number = POKER_SESSION_USER_REMOVE_ONLINE_INTERVAL
  ) {
    const timerKey = this.getTimerKey(pokerSessionId, userId);

    this.removeTimer(timerKey);

    this.timers.set(timerKey, global.setTimeout(async () => {
      this.timers.delete(timerKey);

      try {
        await this.removeFromSession(pokerSessionId, userId);
      } catch (err) {
        log.error({
          err,
          methodName: 'UsersInSessions.removeFromSession',
          pokerSessionId,
          userId,
        }, 'failed to remove user from poker session');
      }
    }, interval));
  }

  private async removeFromSession(pokerSessionId: TEntityID, userId: TEntityID) {
    const pokerSession = await PokerSessionModel.findOneAndUpdate(
      {
        _id: pokerSessionId,
        usersIds: userId,
      },
      { $pull: { usersIds: userId } },
      { new: true }
    );

    if (!pokerSession) {
      return;
    }

    const space = await SpaceModel.findById(pokerSession.spaceId);

    if (!space) {
      emitPokerSessionUpdate(pokerSession);
      return;
    }

    const isAdmin = (id: TEntityID) => spaceHelpers.getParticipantRole(space, id) === SPACE_PARTICIPANT_ROLE.ADMIN;

    // story is stopped only when the last moderator left the session
    const needStopStory = isAdmin(userId) && !pokerSession.usersIds.some((id) => isAdmin(id));

    const updatedPokerSession = await updatePokerSession(
      pokerSession,
      async (_, pokerSessionService) => {
        if (needStopStory) {
          pokerSessionService.storyActiveStop();
          return;
        }

        // left user is not waited for anymore: others may have already voted
        await pokerSessionService.autoRevealVotedTeams(space);
      }
    );

    // post save hook emits socket update only if something was changed
    if (!updatedPokerSession.$locals.wasModified) {
      emitPokerSessionUpdate(updatedPokerSession);
    }
  }

  public async setInSession(pokerSession: TPokerSessionDocument, userId: TEntityID) {
    const isUserInSession = pokerSession.usersIds.some((id) => isEqualsId(id, userId));

    if (!isUserInSession) {
      const updatedPokerSession = await PokerSessionModel.findOneAndUpdate(
        { _id: pokerSession._id },
        { $addToSet: { usersIds: userId } },
        { new: true }
      );

      if (updatedPokerSession) {
        emitPokerSessionUpdate(updatedPokerSession);
      }
    }

    this.runTimeoutRemoveUserFromSession(pokerSession._id, userId);
  }

  /**
   * User closed the page. Not removed immediately: page reload sends heartbeat right after
   * and cancels removal (e.g. moderator reload does not stop the story).
   */
  public leaveSession(pokerSessionId: TEntityID, userId: TEntityID) {
    this.runTimeoutRemoveUserFromSession(pokerSessionId, userId, POKER_SESSION_USER_LEAVE_INTERVAL);
  }

  /**
   * Timers are lost on restart: arm them again for everybody who was in session.
   * Users are not removed right away: phones may be locked and send no heartbeat for a long time.
   */
  public async restoreTimers() {
    const pokerSessions = await PokerSessionModel.find(
      { 'usersIds.0': { $exists: true } },
      { usersIds: 1 }
    );

    pokerSessions.forEach((pokerSession) => {
      pokerSession.usersIds.forEach((userId) => {
        this.runTimeoutRemoveUserFromSession(pokerSession._id, userId);
      });
    });
  }
}

const usersInSessions = new UsersInSessions();

export {
  usersInSessions,
};
