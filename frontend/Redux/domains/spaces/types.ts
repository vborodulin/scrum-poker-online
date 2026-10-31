import { spacesActions } from '@Redux/domains/spaces/actions';
import { spacesAsyncActions } from '@Redux/domains/spaces/asyncActions';

export namespace spacesTypes {
  export type TActionsUnion =
    | ReturnType<typeof spacesActions.upsert>
    | ReturnType<typeof spacesActions.setCurrId>
    | ReturnType<typeof spacesActions.showUpgradePlanOverlay>
    | ReturnType<typeof spacesActions.remove>
    | ReturnType<typeof spacesActions.inviteTokenClear>
    | ReturnType<typeof spacesAsyncActions.spaceGet.pending>
    | ReturnType<typeof spacesAsyncActions.spaceGet.fulfilled>
    | ReturnType<typeof spacesAsyncActions.spaceGet.rejected>
    | ReturnType<typeof spacesAsyncActions.mySpacesGet.pending>
    | ReturnType<typeof spacesAsyncActions.mySpacesGet.fulfilled>
    | ReturnType<typeof spacesAsyncActions.mySpacesGet.rejected>
    | ReturnType<typeof spacesAsyncActions.spaceCreate.pending>
    | ReturnType<typeof spacesAsyncActions.spaceCreate.fulfilled>
    | ReturnType<typeof spacesAsyncActions.spaceCreate.rejected>
    | ReturnType<typeof spacesAsyncActions.spaceUpdate.pending>
    | ReturnType<typeof spacesAsyncActions.spaceUpdate.fulfilled>
    | ReturnType<typeof spacesAsyncActions.spaceUpdate.rejected>
    | ReturnType<typeof spacesAsyncActions.spaceLeave.pending>
    | ReturnType<typeof spacesAsyncActions.spaceLeave.fulfilled>
    | ReturnType<typeof spacesAsyncActions.spaceLeave.rejected>
    | ReturnType<typeof spacesAsyncActions.teamsCreate.pending>
    | ReturnType<typeof spacesAsyncActions.teamsCreate.fulfilled>
    | ReturnType<typeof spacesAsyncActions.teamsCreate.rejected>
    | ReturnType<typeof spacesAsyncActions.teamsRemove.pending>
    | ReturnType<typeof spacesAsyncActions.teamsRemove.fulfilled>
    | ReturnType<typeof spacesAsyncActions.teamsRemove.rejected>
    | ReturnType<typeof spacesAsyncActions.teamsUpdate.pending>
    | ReturnType<typeof spacesAsyncActions.teamsUpdate.fulfilled>
    | ReturnType<typeof spacesAsyncActions.teamsUpdate.rejected>
    | ReturnType<typeof spacesAsyncActions.inviteGen.pending>
    | ReturnType<typeof spacesAsyncActions.inviteGen.fulfilled>
    | ReturnType<typeof spacesAsyncActions.inviteGen.rejected>
    | ReturnType<typeof spacesAsyncActions.participantTeamsUpdate.pending>
    | ReturnType<typeof spacesAsyncActions.participantTeamsUpdate.fulfilled>
    | ReturnType<typeof spacesAsyncActions.participantTeamsUpdate.rejected>
    | ReturnType<typeof spacesAsyncActions.participantsRemove.pending>
    | ReturnType<typeof spacesAsyncActions.participantsRemove.fulfilled>
    | ReturnType<typeof spacesAsyncActions.participantsRemove.rejected>
    | ReturnType<typeof spacesAsyncActions.participantSetAdminRole.pending>
    | ReturnType<typeof spacesAsyncActions.participantSetAdminRole.fulfilled>
    | ReturnType<typeof spacesAsyncActions.participantSetAdminRole.rejected>
    | ReturnType<typeof spacesAsyncActions.inviteValidate.pending>
    | ReturnType<typeof spacesAsyncActions.inviteValidate.fulfilled>
    | ReturnType<typeof spacesAsyncActions.inviteValidate.rejected>
    | ReturnType<typeof spacesAsyncActions.inviteAccept.pending>
    | ReturnType<typeof spacesAsyncActions.inviteAccept.fulfilled>
    | ReturnType<typeof spacesAsyncActions.inviteAccept.rejected>
    | ReturnType<typeof spacesAsyncActions.getStat.pending>
    | ReturnType<typeof spacesAsyncActions.getStat.fulfilled>
    | ReturnType<typeof spacesAsyncActions.getStat.rejected>;
}
