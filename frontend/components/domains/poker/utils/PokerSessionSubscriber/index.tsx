import React from 'react';
import { useSelector } from 'react-redux';

import { pokerSessionsSelectors } from '@Redux/domains/pokerSessions/selectors';
import { uiActions } from '@Redux/domains/ui/actions';
import { uiTypes } from '@Redux/domains/ui/types';
import { useAppDispatch } from '@Redux/hooks';

import { useSocketSubscribe } from '@components/utils/socket/useSocketSubscribe';

const PokerSessionSubscriber = (): React.ReactElement | null => {
  const dispatch = useAppDispatch();

  const pokerSessionId = useSelector(pokerSessionsSelectors.getCurrId);

  useSocketSubscribe(
    `pokerSessionRatingModal:${pokerSessionId}`, () => {
      dispatch(uiActions.modalOpen(uiTypes.MODAL_TYPES.POKER_SESSION_RATING, {
        pokerSessionId,
      }));
    }
  );

  return null;
};

export {
  PokerSessionSubscriber,
};
