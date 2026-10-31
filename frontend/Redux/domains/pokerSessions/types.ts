import { pokerSessionsActions } from '@Redux/domains/pokerSessions/actions';
import { pokerSessionsAsyncActions } from '@Redux/domains/pokerSessions/asyncActions';

export namespace pokerSessionsTypes {
  export type TActionsUnion =

    | ReturnType<typeof pokerSessionsActions.upsert>
    | ReturnType<typeof pokerSessionsActions.inviteTokenClear>
    | ReturnType<typeof pokerSessionsActions.remove>
    | ReturnType<typeof pokerSessionsActions.exportCSVPending>
    | ReturnType<typeof pokerSessionsActions.exportCSVFulfilled>
    | ReturnType<typeof pokerSessionsActions.exportCSVRejected>
    | ReturnType<typeof pokerSessionsActions.pokerSessionIdSet>
    | ReturnType<typeof pokerSessionsActions.pokerSessionIdReset>
    | ReturnType<typeof pokerSessionsActions.pokerSessionRatingTimerSet>
    | ReturnType<typeof pokerSessionsActions.storySelect>
    | ReturnType<typeof pokerSessionsActions.destroy>

    | ReturnType<typeof pokerSessionsAsyncActions.get.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.get.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.get.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.getList.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.getList.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.getList.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.create.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.create.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.create.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.update.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.update.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.update.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.remove.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.remove.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.remove.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.setInSession.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.setInSession.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.setInSession.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storyAdd.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storyAdd.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storyAdd.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storyAddMany.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storyAddMany.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storyAddMany.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storySetMany.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storySetMany.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storySetMany.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storyRemove.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storyRemove.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storyRemove.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storyStop.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storyStop.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storyStop.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storyStart.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storyStart.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storyStart.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storyVoteTeam.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storyVoteTeam.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storyVoteTeam.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storyVoteCancelTeam.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storyVoteCancelTeam.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storyVoteCancelTeam.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storyTeamRevealCards.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storyTeamRevealCards.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storyTeamRevealCards.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.chooseCard.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.chooseCard.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.chooseCard.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storyTeamScoresSet.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storyTeamScoresSet.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storyTeamScoresSet.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.inviteGen.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.inviteGen.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.inviteGen.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.inviteTokenValidate.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.inviteTokenValidate.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.inviteTokenValidate.rejected>

    | ReturnType<typeof pokerSessionsAsyncActions.storiesSetSort.pending>
    | ReturnType<typeof pokerSessionsAsyncActions.storiesSetSort.fulfilled>
    | ReturnType<typeof pokerSessionsAsyncActions.storiesSetSort.rejected>
}
