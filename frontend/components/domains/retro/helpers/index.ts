import { TEntityID } from '@chpokify/models-types';
import { routing } from '@chpokify/routing';
import { differenceInDays } from 'date-fns';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { authSelectors } from '@Redux/domains/auth/selectors';
import { retroSessionsSelectors } from '@Redux/domains/retroSessions/selectors';
import { TAppStore } from '@Redux/types';

import { LOCAL_STORAGE_KEYS } from '@components/domains/core/types';

import { isomorphicLocalStorage } from '@lib/isomorphicStorage';

const redirectRetroSessionPageByToken = (
  ctx: GetServerSidePropsContext,
  reduxStore: TAppStore
): GetServerSidePropsResult<{}> | undefined => {
  const { getState } = reduxStore;
  const isLoggedIn = authSelectors.getIsLoggedIn(getState());

  const inviteTokenPayload = retroSessionsSelectors.getInviteTokenPayload(getState());

  if (isLoggedIn && inviteTokenPayload) {
    const redirectUrl = routing.getRetroSessionUrl(inviteTokenPayload.spaceId, inviteTokenPayload.retroSessionId);

    return {
      redirect: {
        permanent: false,
        destination: redirectUrl,
      },
    };
  }
};

const clearOldRetroSessionActionsInStorage = (retroSessionsIds: TEntityID[]) => {
  if (!retroSessionsIds.length) {
    return;
  }

  const DIFF_REMOVE_KEY = 30;

  for (const retroSessionId of retroSessionsIds) {
    const keyStorageActions = `${LOCAL_STORAGE_KEYS.SHOW_RETRO_SESSION_ACTIONS}-${retroSessionId}`;
    const showDate = isomorphicLocalStorage.getItem(keyStorageActions);

    if (showDate) {
      const diff = differenceInDays(
        new Date(),
        new Date(showDate)
      );

      if (diff > DIFF_REMOVE_KEY) {
        isomorphicLocalStorage.removeItem(keyStorageActions);
      }
    }
  }
};

// hidden cards must not render real text: blur alone leaves it in the DOM (copy-paste, find in page)
const maskHiddenText = (text: string | undefined): string | undefined => text?.replace(/\S/g, 'x');

const retroHelpers = {
  maskHiddenText,
  redirectRetroSessionPageByToken,
  clearOldRetroSessionActionsInStorage,
};

export {
  retroHelpers,
};
