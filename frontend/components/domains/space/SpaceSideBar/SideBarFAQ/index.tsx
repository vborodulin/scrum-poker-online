import { ROUTING_EXTERNAL } from '@chpokify/routing';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useSelector } from 'react-redux';

import { persistSelectors } from '@Redux/domains/persist/selectors';
import { uiSelectors } from '@Redux/domains/ui/selectors';

import {
  SideBarItem,
  SideBarItemAdornment,
  SideBarItemText,
} from '@components/domains/space/SpaceSideBar/SideBarItem';

import { IconHelp } from '@components/uiKit/Icons';

import { TRANS } from '@components/utils/types';

import { detect } from '@lib/detect';

export type TSideBarIssuesProps = {};

const SideBarFAQ = (props: TSideBarIssuesProps): React.ReactElement | null => {
  const {
    ...other
  } = props;

  const { t } = useTranslation(TRANS.MAIN);

  const isSideBarUncollapsed = useSelector(persistSelectors.getIsSideBarUncollapsed);
  const isSideBarOpen = useSelector(uiSelectors.getIsSpaceSideBarOpen);

  const isOpenSidebar = isSideBarOpen || isSideBarUncollapsed;

  if (detect.isChpokifyIOSApp) {
    return null;
  }

  return (
    <a
      href={ROUTING_EXTERNAL.PLANNING_POKER_GUIDE_URL}
      target="_blank"
    >
      <SideBarItem
        {...other}
      >
        <SideBarItemAdornment>
          <IconHelp
            fill="font.normal"
          />
        </SideBarItemAdornment>

        {
          isOpenSidebar
            ? (
              <SideBarItemText
                opacity={1}
              >
                {t('sideBarFaq.title')}
              </SideBarItemText>
            ) : null
        }

      </SideBarItem>
    </a>
  );
};

export {
  SideBarFAQ,
};
