import { TEntityID } from '@chpokify/models-types';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled, { css } from 'styled-components';

import { CardCombined } from '@components/domains/retro/RetroSession/RetroSessionCard/CardCombined';
import { CardMenuBtn, TCardMenuBtnProps } from '@components/domains/retro/RetroSession/RetroSessionCard/CardMenuBtn';
import { CardTitle } from '@components/domains/retro/RetroSession/RetroSessionCard/CardTitle';
import {
  SettingCompletedCard,
} from '@components/domains/retro/RetroSession/RetroSessionCardAction/SettingCompletedCard';

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

const RootBoxCard = styled(Flex)<TFlexProps & { isHiddenCard: boolean }>`
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
  hasCompletedItem: boolean;
  hasMenuBtnItem: boolean;
  isDragEnabled: boolean;
  index: number;
  title: string | undefined
};

const Layout = (props: TLayoutProps): React.ReactElement | null => {
  const {
    cardId,
    columnId,
    hasCompletedItem,
    hasMenuBtnItem,
    isDragEnabled,
    index,
    title,
    ...other
  } = props;

  const renderCheckBoxCompleted = () => {
    if (!hasCompletedItem) {
      return null;
    }

    return (
      <SettingCompletedCard
        cardId={cardId.toString()}
        mr={3}
      />
    );
  };

  const renderMenuBtn = () => {
    if (!hasMenuBtnItem) {
      return null;
    }

    return (
      <StylesRetroCardMenuWithBtn
        cardId={cardId}
        columnId={columnId}
        className="retroCardMenuBtn"
        isColumnAction
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
        hasDescription={false}
      />
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
            isCombineTargetFor={false}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            {...other}
          >
            <RootBoxCard>
              {
                renderCheckBoxCompleted()
              }
              <Flex
                gap={2}
                flexDirection="column"
                flexGrow={1}
              >
                {
                  renderTitleCard()
                }
              </Flex>
            </RootBoxCard>
            <CardCombined
              cardId={cardId}
              isColumnAction
            />
            {
              renderMenuBtn()
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
