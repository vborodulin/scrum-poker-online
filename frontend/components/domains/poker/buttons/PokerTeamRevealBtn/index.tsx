import { TEntityID } from '@chpokify/models-types';
import React from 'react';
import { useSelector } from 'react-redux';

import { pokerSessionsAsyncActions } from '@Redux/domains/pokerSessions/asyncActions';
import { pokerSessionsSelectors } from '@Redux/domains/pokerSessions/selectors';
import { pokerSessionsRepoSelectors } from '@Redux/domains/pokerSessionsRepo/selectors';
import { spacesRepoSelectors } from '@Redux/domains/spacesRepo/selectors';
import { uiActions } from '@Redux/domains/ui/actions';
import { uiTypes } from '@Redux/domains/ui/types';
import { useAppDispatch } from '@Redux/hooks';

import { TButtonProps } from '@components/uiKit/Button';

import { Layout } from './Layout';

export type TPokerTeamRevealBtnProps = Partial<TButtonProps> & {
  storyId: TEntityID;
  teamId: TEntityID;
};

const PokerTeamRevealBtn = (props: TPokerTeamRevealBtnProps): React.ReactElement | null => {
  const {
    storyId,
    teamId,
    ...other
  } = props;

  const dispatch = useAppDispatch();

  const canModerate = useSelector(spacesRepoSelectors.getCanModerateMeCurr);
  const pokerSessionId = useSelector(pokerSessionsSelectors.getCurrId);
  const isVoting = useSelector(pokerSessionsSelectors.getIsTeamVotingStory)(
    pokerSessionId,
    teamId,
    storyId
  );
  const isAllTeamVoted = useSelector(pokerSessionsRepoSelectors.getIsAllTeamVoted)(
    pokerSessionId,
    teamId
  );

  const onRevealSubmit = async () => {
    await dispatch(pokerSessionsAsyncActions.storyTeamRevealCards(
      pokerSessionId,
      storyId,
      teamId
    ));
  };

  const showConfirmModal = async () => {
    dispatch(uiActions.modalOpen(uiTypes.MODAL_TYPES.POKER_STORY_REVEAL_CONFIRM, {
      pokerSessionId,
      storyId,
      teamId,
    }));
  };

  const handleRevealCards = async () => {
    if (!pokerSessionId) {
      return;
    }

    if (!isAllTeamVoted) {
      await showConfirmModal();
      return;
    }

    await onRevealSubmit();
  };

  return (
    <Layout
      isVoting={isVoting}
      canModerate={canModerate}
      onRevealCards={handleRevealCards}
      {...other}
    />
  );
};

export {
  PokerTeamRevealBtn,
};
