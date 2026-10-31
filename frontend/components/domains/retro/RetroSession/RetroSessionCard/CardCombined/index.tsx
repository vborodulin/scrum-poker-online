import { TEntityID } from '@chpokify/models-types';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { retroSessionsCardsSelectors } from '@Redux/domains/retroSessionsCards/selectors';

import { retroHelpers } from '@components/domains/retro/helpers';
import { CardDescription } from '@components/domains/retro/RetroSession/RetroSessionCard/CardDescription';
import { CardTitle } from '@components/domains/retro/RetroSession/RetroSessionCard/CardTitle';
import { rootBlurCardMixin } from '@components/domains/retro/RetroSession/RetroSessionCard/Layout';

import { Divider } from '@components/uiKit/Divider';
import { Flex, TFlexProps } from '@components/uiKit/Flex';

const RootCombinedCard = styled(Flex)<TFlexProps & {isHiddenCard: boolean }>`
${({ isHiddenCard }) => isHiddenCard && rootBlurCardMixin};
`;

type TCardCombinedProps = {
  cardId: TEntityID;
  isHiddenCard?: boolean
  isColumnAction?: boolean
};

const CardCombined = (props: TCardCombinedProps): React.ReactElement | null => {
  const {
    cardId,
    isColumnAction,
    isHiddenCard,
  } = props;

  const combinedCards = useSelector(retroSessionsCardsSelectors.getCombinedCards)(cardId);

  if (!combinedCards.length) {
    return null;
  }

  return (
    <RootCombinedCard
      flexDirection="column"
      isHiddenCard={isHiddenCard}
    >
      {
        combinedCards.map((card) => (
          <React.Fragment
            key={card.title}
          >
            <Divider
              my={2}
            />
            <Flex
              gap={2}
              flexDirection="column"
            >
              <CardTitle
                title={isHiddenCard ? retroHelpers.maskHiddenText(card.title) as string : card.title}
                hasDescription={!!card.description && !isColumnAction}
              />
              {
                !isColumnAction
                && (
                <CardDescription
                  description={isHiddenCard ? retroHelpers.maskHiddenText(card.description) : card.description}
                />
                )
              }

            </Flex>

          </React.Fragment>
        ))
      }
      <Divider
        my={2}
      />
    </RootCombinedCard>
  );
};

export {
  CardCombined,
};
