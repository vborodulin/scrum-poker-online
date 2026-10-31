import { TEntityID } from '@chpokify/models-types';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';

import { retroSessionsCardsSelectors } from '@Redux/domains/retroSessionsCards/selectors';
import { retroSessionsCardsRepoSelectors } from '@Redux/domains/retroSessionsCardsRepo/selectors';
import { usersSelectors } from '@Redux/domains/users/selectors';

import { retroHelpers } from '@components/domains/retro/helpers';
import { rootBlurCardMixin } from '@components/domains/retro/RetroSession/RetroSessionCard/Layout';

import { TBoxProps } from '@components/uiKit/Box';
import { Flex, TFlexProps } from '@components/uiKit/Flex';
import { IconPersonOutline } from '@components/uiKit/Icons';
import { Text, TTextProps } from '@components/uiKit/Text';
import { Tooltip } from '@components/uiKit/Tooltip';
import { TooltipTitle } from '@components/uiKit/TooltipTitle';

import { Popper, POPPER_MODE } from '@components/utils/Popper';
import { popperTooltipOptions } from '@components/utils/Popper/options/tooltip';

const RootAuthorCard = styled(Text)<TTextProps & { isHiddenCard: boolean }>`
  ${({ isHiddenCard }) => isHiddenCard && rootBlurCardMixin};
`;

const RootAuthorsCard = styled(Flex)<TFlexProps & { isHiddenCard: boolean }>`
  ${({ isHiddenCard }) => isHiddenCard && rootBlurCardMixin};
`;

type TCardAuthorProps = Partial<TBoxProps> & {
  isHiddenCard: boolean;
  cardId: TEntityID
};

const CardAuthor = (props: TCardAuthorProps): React.ReactElement | null => {
  const {
    cardId,
    isHiddenCard,
    ...other
  } = props;

  const [targetElement, setTargetElement] = useState<any>();
  const popperIdRef = useRef(`retroSessionCardAuthors-${shortid()}`);

  const combinedCardsAuthor = useSelector(retroSessionsCardsSelectors.getCombinedCardsAuthors)(cardId);
  const user = useSelector(retroSessionsCardsRepoSelectors.getUserFromCard)(cardId);
  const users = useSelector(usersSelectors.getMany)(combinedCardsAuthor);

  const renderTooltip = () => {
    if (users.length <= 1 || isHiddenCard) {
      return null;
    }

    const usersName = users.map((userItem) => userItem.username);
    const usersNameStr = usersName.join(', ');

    return (
      <Popper
        id={popperIdRef.current}
        targetElement={targetElement}
        mode={POPPER_MODE.HOVER}
        options={{
          ...popperTooltipOptions,
          placement: 'right',
        }}
      >
        <Tooltip>
          <TooltipTitle
            fontSize={2}
          >
            {
              usersNameStr
            }
          </TooltipTitle>
        </Tooltip>
      </Popper>
    );
  };

  const renderAuthors = () => (
    <RootAuthorsCard
      gap={1}
      isHiddenCard={isHiddenCard}
    >
      <IconPersonOutline
        width="16px"
        height="16px"
        fill="font.d_20"
      />
      <Text
        fontSize={1}
        color="font.d_20"
      >
        {combinedCardsAuthor.length}
      </Text>
    </RootAuthorsCard>
  );

  const renderContent = () => {
    if (combinedCardsAuthor.length > 1) {
      return renderAuthors();
    }

    return (
      <RootAuthorCard
        fontSize={1}
        color="font.d_20"
        isHiddenCard={isHiddenCard}
        ellipses
      >
        {isHiddenCard ? retroHelpers.maskHiddenText(user?.username) : user?.username}
      </RootAuthorCard>
    );
  };

  return (
    <Flex
      flex={1}
      justifyContent="right"
      ref={setTargetElement}
      {...other}
    >
      {
        renderContent()
      }
      {
        renderTooltip()
      }
    </Flex>
  );
};

export {
  CardAuthor,
};
