import { authActionsTypes } from '@Redux/domains/auth/actionsTypes';

const afterLoginRedirectDataSet = (afterLoginRedirect: {
  url: string,
  asPath?: string
}) => ({
  type: authActionsTypes.AFTER_LOGIN_REDIRECT_DATA_SET,
  payload: { afterLoginRedirect },
}) as const;

const afterLoginRedirectDataRemove = () => ({
  type: authActionsTypes.AFTER_LOGIN_REDIRECT_DATA_REMOVE,
  payload: { },
}) as const;

const signOutFromOtherTab = () => ({
  type: authActionsTypes.SIGN_OUT_FORM_OTHER_TAB,
  payload: {},
}) as const;

export const authActions = {
  afterLoginRedirectDataSet,
  afterLoginRedirectDataRemove,
  signOutFromOtherTab,
};
