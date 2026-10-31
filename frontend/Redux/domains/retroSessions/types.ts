import { retroSessionsActions } from '@Redux/domains/retroSessions/actions';
import { retroSessionsAsyncActions } from '@Redux/domains/retroSessions/asyncActions';

export namespace retroSessionsTypes {
  export type TActionsUnion =
    | ReturnType<typeof retroSessionsAsyncActions.create.pending>
    | ReturnType<typeof retroSessionsAsyncActions.create.fulfilled>
    | ReturnType<typeof retroSessionsAsyncActions.create.rejected>

    | ReturnType<typeof retroSessionsAsyncActions.getList.pending>
    | ReturnType<typeof retroSessionsAsyncActions.getList.fulfilled>
    | ReturnType<typeof retroSessionsAsyncActions.getList.rejected>

    | ReturnType<typeof retroSessionsAsyncActions.get.pending>
    | ReturnType<typeof retroSessionsAsyncActions.get.fulfilled>
    | ReturnType<typeof retroSessionsAsyncActions.get.rejected>

    | ReturnType<typeof retroSessionsAsyncActions.update.pending>
    | ReturnType<typeof retroSessionsAsyncActions.update.fulfilled>
    | ReturnType<typeof retroSessionsAsyncActions.update.rejected>

    | ReturnType<typeof retroSessionsAsyncActions.remove.pending>
    | ReturnType<typeof retroSessionsAsyncActions.remove.fulfilled>
    | ReturnType<typeof retroSessionsAsyncActions.remove.rejected>

    | ReturnType<typeof retroSessionsAsyncActions.inviteGen.pending>
    | ReturnType<typeof retroSessionsAsyncActions.inviteGen.fulfilled>
    | ReturnType<typeof retroSessionsAsyncActions.inviteGen.rejected>

    | ReturnType<typeof retroSessionsAsyncActions.inviteTokenValidate.pending>
    | ReturnType<typeof retroSessionsAsyncActions.inviteTokenValidate.fulfilled>
    | ReturnType<typeof retroSessionsAsyncActions.inviteTokenValidate.rejected>

    | ReturnType<typeof retroSessionsAsyncActions.resetVotesCards.pending>
    | ReturnType<typeof retroSessionsAsyncActions.resetVotesCards.fulfilled>
    | ReturnType<typeof retroSessionsAsyncActions.resetVotesCards.rejected>

    | ReturnType<typeof retroSessionsAsyncActions.getCountAll.pending>
    | ReturnType<typeof retroSessionsAsyncActions.getCountAll.fulfilled>
    | ReturnType<typeof retroSessionsAsyncActions.getCountAll.rejected>

    | ReturnType<typeof retroSessionsActions.upsert>
    | ReturnType<typeof retroSessionsActions.remove>
    | ReturnType<typeof retroSessionsActions.inviteTokenClear>
    | ReturnType<typeof retroSessionsActions.exportCSVCardsActionPending>
    | ReturnType<typeof retroSessionsActions.exportCSVCardsActionFulfilled>
    | ReturnType<typeof retroSessionsActions.exportCSVCardsActionRejected>
    | ReturnType<typeof retroSessionsActions.setCurrId>
    | ReturnType<typeof retroSessionsActions.removeCurrId>
    | ReturnType<typeof retroSessionsActions.columnActionsSidebarToggle>
    | ReturnType<typeof retroSessionsActions.columnActionsSidebarClose>

}
