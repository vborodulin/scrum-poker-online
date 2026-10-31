import React from 'react';
import { useSelector } from 'react-redux';

import { asyncRejectedSelectors } from '@Redux/domains/asyncInfo/rejected/selectors';
import { authSelectors } from '@Redux/domains/auth/selectors';
import { retroSessionsActionsTypes } from '@Redux/domains/retroSessions/actionsTypes';
import { retroSessionsSelectors } from '@Redux/domains/retroSessions/selectors';
import { retroSessionRepoSelectors } from '@Redux/domains/retroSessionsRepo/selectors';

import { NotFound } from '@components/domains/layouts/NotFound';
import { RetroSessionColumnActionsWrapper } from '@components/domains/retro/RetroSession/RetroSessionColumnActionsWrapper';
import { RetroSessionContent } from '@components/domains/retro/RetroSession/RetroSessionContent';
import { RetroSessionHeader } from '@components/domains/retro/RetroSession/RetroSessionHeader';
import { RetroSessionSettingsActions } from '@components/domains/retro/RetroSession/RetroSessionSettingsActions';
import { RetroSessionThumbForbidden } from '@components/domains/retro/RetroSession/RetroSessionThumbForbidden';

import { Flex } from '@components/uiKit/Flex';

const RetroSession = (): React.ReactElement => {
  const isColumnActionsSidebarOpen = useSelector(retroSessionsSelectors.getIsColumnActionsSidebarOpen);
  const countEntities = useSelector(retroSessionsSelectors.getCountEntities);
  const currUserId = useSelector(authSelectors.getCurrUserId);
  const isParticipant = useSelector(retroSessionRepoSelectors.getIsUserParticipant)(
    currUserId
  );
  const retroSessionApiErr = useSelector(asyncRejectedSelectors.createErrorSelector)(
    [retroSessionsActionsTypes.GET_PENDING]
  );

  if (retroSessionApiErr?.code === 403 || !isParticipant) {
    return (
      <RetroSessionThumbForbidden />
    );
  }

  if (!countEntities || retroSessionApiErr) {
    return (
      <NotFound />
    );
  }

  return (
    <Flex
      pl={[3, null, 6]}
      pr={[3, null, isColumnActionsSidebarOpen ? 0 : 6]}
      flexGrow={1}
      gap={6}
    >
      <Flex
        flexDirection="column"
        flex={1}
        mt={6}
        pb={6}
        position="relative"
      >
        <RetroSessionHeader />
        <RetroSessionContent />
        <RetroSessionSettingsActions />
      </Flex>

      <RetroSessionColumnActionsWrapper />

    </Flex>
  );
};

export {
  RetroSession,
};
