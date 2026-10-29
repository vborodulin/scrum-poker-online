import { authActions } from '@Redux/domains/auth/actions';
import { authAsyncActions } from '@Redux/domains/auth/asyncActions';

export namespace authTypes {
  export type TActionsUnion =
    | ReturnType<typeof authActions.afterLoginRedirectDataSet>
    | ReturnType<typeof authActions.afterLoginRedirectDataRemove>
    | ReturnType<typeof authActions.signOutFromOtherTab>
    | ReturnType<typeof authActions.cryptoAuthFulfilled>
    | ReturnType<typeof authAsyncActions.get.pending>
    | ReturnType<typeof authAsyncActions.get.fulfilled>
    | ReturnType<typeof authAsyncActions.get.rejected>
    | ReturnType<typeof authAsyncActions.logIn.pending>
    | ReturnType<typeof authAsyncActions.logIn.fulfilled>
    | ReturnType<typeof authAsyncActions.logIn.rejected>
    | ReturnType<typeof authAsyncActions.logInGuest.pending>
    | ReturnType<typeof authAsyncActions.logInGuest.fulfilled>
    | ReturnType<typeof authAsyncActions.logInGuest.rejected>
    | ReturnType<typeof authAsyncActions.googleOAuth.fulfilled>
    | ReturnType<typeof authAsyncActions.googleOAuth.pending>
    | ReturnType<typeof authAsyncActions.googleOAuth.rejected>
    | ReturnType<typeof authAsyncActions.appleOAuth.fulfilled>
    | ReturnType<typeof authAsyncActions.appleOAuth.pending>
    | ReturnType<typeof authAsyncActions.appleOAuth.rejected>
    | ReturnType<typeof authAsyncActions.signUp.pending>
    | ReturnType<typeof authAsyncActions.signUp.fulfilled>
    | ReturnType<typeof authAsyncActions.signUp.rejected>
    | ReturnType<typeof authAsyncActions.signOut.pending>
    | ReturnType<typeof authAsyncActions.signOut.fulfilled>
    | ReturnType<typeof authAsyncActions.signOut.rejected>
    | ReturnType<typeof authAsyncActions.restorePassword.pending>
    | ReturnType<typeof authAsyncActions.restorePassword.fulfilled>
    | ReturnType<typeof authAsyncActions.restorePassword.rejected>
    | ReturnType<typeof authAsyncActions.resetPassword.pending>
    | ReturnType<typeof authAsyncActions.resetPassword.fulfilled>
    | ReturnType<typeof authAsyncActions.resetPassword.rejected>
    | ReturnType<typeof authAsyncActions.resetPasswordValidate.pending>
    | ReturnType<typeof authAsyncActions.resetPasswordValidate.fulfilled>
    | ReturnType<typeof authAsyncActions.resetPasswordValidate.rejected>
}
