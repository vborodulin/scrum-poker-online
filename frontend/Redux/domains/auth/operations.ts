import Router from 'next/router';

import { authActions } from '@Redux/domains/auth/actions';
import { authSelectors } from '@Redux/domains/auth/selectors';
import { TAppOperation } from '@Redux/types';

import { afterLoginRedirect } from '@lib/auth/afterLoginRedirect';

const afterLoginRedirectDataSetFromCookie = (): TAppOperation => async (dispatch) => {
  const dataStr = afterLoginRedirect.getCookie();

  if (dataStr) {
    dispatch(authActions.afterLoginRedirectDataSet(
      JSON.parse(dataStr)
    ));
  }

  afterLoginRedirect.removeCookie();
};

const afterLoginMakeRedirect = (): TAppOperation => async (dispatch, getState) => {
  const data = authSelectors.getAfterLoginRedirectData(getState());

  if (!data) {
    return;
  }

  await Router.push(data.url, data.asPath);
};

export const authOperations = {
  afterLoginRedirectDataSetFromCookie,
  afterLoginMakeRedirect,
};
