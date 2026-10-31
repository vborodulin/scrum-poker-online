import { TEntityID } from '@chpokify/models-types';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled, { css } from 'styled-components';

import { CardAuthor } from '@components/domains/retro/RetroSession/RetroSessionCard/CardAuthor';
import { CardCombined } from '@components/domains/retro/RetroSession/RetroSessionCard/CardCombined';
import { CardDescription } from '@components/domains/retro/RetroSession/RetroSessionCard/CardDescription';
import { CardMenuBtn, TCardMenuBtnProps } from '@components/domains/retro/RetroSession/RetroSessionCard/CardMenuBtn';
import { CardTitle } from '@components/domains/retro/RetroSession/RetroSessionCard/CardTitle';
import { SettingVotesCard } from '@components/domains/retro/RetroSession/RetroSessionCard/SettingVotesCard';

import { Box, TBoxProps } from '@components/uiKit/Box';
import { Flex, TFlexProps } from '@components/uiKit/Flex';

const StylesRetroCardMenuWithBtn = styled(CardMenuBtn)<TCardMenuBtnProps>`
  position: absolute;
  right: 0;
  top: 0;
`;

export const rootBlurCardMixin = css`
   filter: blur(8px);
   user-select: none;
`;

const rootCombinedTargetForMixin = css`
  border-color:${({ theme }) => theme.colors.primary.normal};
`;

const rootDraggingActiveMixin = css`
  border-color:${({ theme }) => theme.colors.baseInvert.normal};
  cursor: grab;
`;

export const RootBoxCard = styled(Flex)<TFlexProps & { isHiddenCard: boolean }>`
   align-items: flex-start;
  ${({ isHiddenCard }) => isHiddenCard && rootBlurCardMixin};
`;

const Root = styled(Box)<TBoxProps & { isDragging: boolean, isCombineTargetFor: boolean }>`
  border:4px solid ${({ theme }) => theme.colors.transparent};
  &:hover{
    background-color: ${({ theme }) => theme.colors.base.a_20};
    & .retroCardMenuBtn{
      display:inline-flex;
    }
  }

  & .retroCardMenuBtn{
     display:none;
  }

  ${({ isDragging }) => isDragging && rootDraggingActiveMixin};
  ${({ isCombineTargetFor }) => isCombineTargetFor && rootCombinedTargetForMixin};
`;

export type TLayoutProps = Partial<TFlexProps> & {
  cardId: TEntityID;
  columnId: TEntityID;
  hasMenuBtnItem: boolean;
  hasVotesItem: boolean;
  hasUserNameItem: boolean;
  hasDescriptionItem: boolean;
  isHiddenCard: boolean;
  isDragEnabled: boolean;
  index: number;
  hasDescription: boolean;
  title: string | undefined
  description: string | undefined
};

const Layout = (props: TLayoutProps): React.ReactElement | null => {
  const {
    cardId,
    columnId,
    hasMenuBtnItem,
    hasVotesItem,
    hasUserNameItem,
    isHiddenCard,
    isDragEnabled,
    index,
    title,
    hasDescription,
    description,
    hasDescriptionItem,
    ...other
  } = props;

  const renderMenuBtn = () => {
    if (!hasMenuBtnItem) {
      return null;
    }

    return (
      <StylesRetroCardMenuWithBtn
        cardId={cardId}
        columnId={columnId}
        className="retroCardMenuBtn"
      />
    );
  };

  const renderVotes = () => {
    if (!hasVotesItem) {
      return null;
    }

    return (
      <SettingVotesCard
        cardId={cardId.toString()}
      />
    );
  };

  const renderUserName = () => {
    if (!hasUserNameItem) {
      return null;
    }

    return (
      <CardAuthor
        cardId={cardId}
        isHiddenCard={isHiddenCard}
      />
    );
  };

  const renderTitleCard = () => {
    if (!title) {
      return null;
    }

    return (
      <CardTitle
        title={title}
        hasDescription={hasDescription}
      />
    );
  };

  const renderDescriptionCard = () => {
    if (!hasDescriptionItem) {
      return null;
    }

    return (
      <CardDescription
        description={description}
      />
    );
  };

  const renderInfo = () => {
    if (!hasVotesItem && !hasUserNameItem) {
      return null;
    }

    return (
      <Flex
        mt={2}
        alignItems="center"
        height="28px"
        gap={2}
      >
        {
          renderVotes()
        }
        {
          renderUserName()
        }
      </Flex>
    );
  };

  return (
    <Draggable
      draggableId={cardId.toString()}
      isDragDisabled={!isDragEnabled}
      index={index}
    >
      {
        (provided, snapshot) => (
          <Root
            ref={provided.innerRef}
            position="relative"
            borderRadius={2}
            py={2}
            px={3}
            bg="surface.a_20"
            boxShadow="card"
            isDragging={snapshot.isDragging}
            isCombineTargetFor={!!snapshot.combineTargetFor}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            {...other}
          >
            <RootBoxCard
              isHiddenCard={isHiddenCard}
            >
              <Flex
                gap={2}
                flexDirection="column"
                flexGrow={1}
              >
                {
                  renderTitleCard()
                }
                {
                  renderDescriptionCard()
                }
              </Flex>
            </RootBoxCard>
            <CardCombined
              cardId={cardId}
              isHiddenCard={isHiddenCard}
            />
            {
              renderMenuBtn()
            }
            {
              renderInfo()
            }
          </Root>
        )
      }
    </Draggable>
  );
};

export {
  Layout,
};
