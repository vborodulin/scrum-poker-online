import { isServer } from '@chpokify/helpers';
import { domHelpers } from '@chpokify/helpers/dom';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { persistSelectors } from '@Redux/domains/persist/selectors';
import { spacesRepoSelectors } from '@Redux/domains/spacesRepo/selectors';
import { uiActions } from '@Redux/domains/ui/actions';
import { uiSelectors } from '@Redux/domains/ui/selectors';
import { useAppDispatch } from '@Redux/hooks';

import { HEADER_HEIGHT } from '@components/domains/layouts/HeaderContainer';
import { SideBarClose } from '@components/domains/space/SpaceSideBar/SideBarClose';
import { SideBarCollapse } from '@components/domains/space/SpaceSideBar/SideBarCollapse';
import { SideBarFAQ } from '@components/domains/space/SpaceSideBar/SideBarFAQ';
import { SideBarKanban } from '@components/domains/space/SpaceSideBar/SideBarKanban';
import { SideBarPoker } from '@components/domains/space/SpaceSideBar/SideBarPoker';
import { SideBarRetro } from '@components/domains/space/SpaceSideBar/SideBarRetro';
import { SideBarSettings } from '@components/domains/space/SpaceSideBar/SideBarSettings';
import { SideBarTasks } from '@components/domains/space/SpaceSideBar/SideBarTasks';
import { SideBarTutorial } from '@components/domains/space/SpaceSideBar/SideBarTutorial';
import {
  SPACE_SIDEBAR_WIDTH_COLLAPSED,
  SPACE_SIDEBAR_WIDTH_UN_COLLAPSED,
} from '@components/domains/space/SpaceSideBar/types';

import { Box } from '@components/uiKit/Box';
import { Divider } from '@components/uiKit/Divider';
import { Paper, TPaperProps } from '@components/uiKit/Paper';

import { useEventListener } from '@components/utils/hooks/useEventListener';

export type TSpaceSideBarProps = {};

const Root = styled(Paper)<TPaperProps>`
  bottom: 0;
  box-shadow: ${({ theme }) => theme.shadows.card};
  left: 0;
  position: fixed;
  top: ${HEADER_HEIGHT};
  z-index: 1;
`;

const SpaceSideBar = (props: TSpaceSideBarProps): React.ReactElement | null => {
  const {
    ...other
  } = props;

  const rootElRef = useRef<any>();

  const dispatch = useAppDispatch();

  const isSideBarUncollapsed = useSelector(persistSelectors.getIsSideBarUncollapsed);
  const isSideBarOpen = useSelector(uiSelectors.getIsSpaceSideBarOpen);
  const canModerate = useSelector(spacesRepoSelectors.getCanModerateMeCurr);

  const handleClickOutside = (event: React.MouseEvent) => {
    const targetEl = event.target as HTMLElement;
    const rootEl = rootElRef.current as HTMLElement;

    if (!targetEl || !rootEl) {
      return;
    }

    const rootElClassSelector = domHelpers.getElementClassSelector(rootEl);

    if (targetEl.closest(rootElClassSelector)) {
      return;
    }

    dispatch(uiActions.spaceSideBarClose());
  };

  useEventListener(
    isServer() ? null : document,
    'click',
    handleClickOutside
  );

  return (
    <Root
      ref={rootElRef}
      forwardedAs="aside"
      display={[
        isSideBarOpen ? 'flex' : 'none',
        'flex',
      ]}
      width={[
        `${SPACE_SIDEBAR_WIDTH_UN_COLLAPSED}px`,
        isSideBarUncollapsed ? `${SPACE_SIDEBAR_WIDTH_UN_COLLAPSED}px` : `${SPACE_SIDEBAR_WIDTH_COLLAPSED}px`,
      ]}
      bg="surface.a_10"
      borderRadius={0}
      p={2}
      {...other}
    >
      <Box
        flexGrow={1}
      >
        <SideBarPoker />

        <SideBarRetro />

        <SideBarKanban />

        <Divider
          my={2}
          width="90%"
        />

        <SideBarTasks />

        {
          canModerate && (
            <SideBarTutorial />
          )
        }

        <SideBarSettings />

        <SideBarFAQ />

      </Box>

      <Divider
        my={3}
        width="90%"
      />

      <SideBarCollapse
        display={[
          'none',
          'grid',
        ]}
      />

      <SideBarClose
        display={[
          'grid',
          'none',
        ]}
      />
    </Root>
  );
};

export {
  SpaceSideBar,
};
