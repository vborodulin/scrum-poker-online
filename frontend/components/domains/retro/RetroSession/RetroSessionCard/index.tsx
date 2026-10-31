import React from 'react';
import { useSelector } from 'react-redux';

import { retroSessionsSelectors } from '@Redux/domains/retroSessions/selectors';
import { retroSessionsCardsSelectors } from '@Redux/domains/retroSessionsCards/selectors';
import { retroSessionsCardsRepoSelectors } from '@Redux/domains/retroSessionsCardsRepo/selectors';
import { spacesRepoSelectors } from '@Redux/domains/spacesRepo/selectors';

import { retroHelpers } from '@components/domains/retro/helpers';

import { TFlexProps } from '@components/uiKit/Flex';

import { Layout } from './Layout';

export type TRetroSessionCardProps = Partial<TFlexProps> & {
  index: number;
  cardId: string;
  columnId: string;
};

const RetroSessionCard = (props: TRetroSessionCardProps): React.ReactElement | null => {
  const {
    index,
    cardId,
    columnId,
    ...other
  } = props;

  const title = useSelector(retroSessionsCardsSelectors.getTitle)(cardId);
  const description = useSelector(retroSessionsCardsSelectors.getDescription)(cardId);
  const isMyCard = useSelector(retroSessionsCardsRepoSelectors.getIsMyCard)(cardId);
  const isHiddenCard = useSelector(retroSessionsCardsRepoSelectors.getIsHiddenCard)(cardId);

  const canModerate = useSelector(spacesRepoSelectors.getCanModerateMeCurr);
  const isHiddenUserNameCards = useSelector(retroSessionsSelectors.getIsHiddenUserNameCards);
  const isDisableVotingCards = useSelector(retroSessionsSelectors.getIsDisableVotingCards);
  const isHiddenDescriptionCards = useSelector(retroSessionsSelectors.getIsHiddenDescriptionCards);
  const canEditCards = useSelector(retroSessionsSelectors.getCanEditCards);
  const canMoveCards = useSelector(retroSessionsSelectors.getCanMoveCards);

  return (
    <Layout
      index={index}
      cardId={cardId}
      columnId={columnId}
      isHiddenCard={isHiddenCard}
      isColumnAction={false}
      isDragEnabled={canModerate || (canMoveCards && isMyCard)}
      hasUserNameItem={!isHiddenUserNameCards}
      hasVotesItem={!isDisableVotingCards}
      hasMenuBtnItem={canModerate || (canEditCards && isMyCard)}
      hasDescriptionItem={!isHiddenDescriptionCards}
      hasDescription={!!description}
      title={isHiddenCard ? retroHelpers.maskHiddenText(title) : title}
      description={isHiddenCard ? retroHelpers.maskHiddenText(description) : description}
      {...other}
    />
  );
};

export {
  RetroSessionCard,
};
