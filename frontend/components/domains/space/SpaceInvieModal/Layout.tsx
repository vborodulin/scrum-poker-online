import { useTranslation } from 'next-i18next';
import React from 'react';
import { css } from 'styled-components';

import { DATA_TEST_ID } from '@components/domains/core/types';
import { Modal } from '@components/domains/shared/Modal';
import { SpaceInviteBtn } from '@components/domains/space/buttons/SpaceInviteBtn';
import { SPACE_ONBOARDING_STEP_ID } from '@components/domains/space/onboarding/types';

import { Box } from '@components/uiKit/Box';
import { PaperContent } from '@components/uiKit/PaperContent';
import { PaperHeader } from '@components/uiKit/PaperHeader';
import { Text } from '@components/uiKit/Text';

import { TRANS } from '@components/utils/types';

const Layout = (): React.ReactElement | null => {
  const { t } = useTranslation(TRANS.MAIN);

  return (
    <Modal
      data-test-id={DATA_TEST_ID.SPACE_INVITE_MODAL}
      data-tut-space={SPACE_ONBOARDING_STEP_ID.INVITE_MODAL}
    >
      <PaperHeader>
        {t('inviteToSpaceModal.title')}
      </PaperHeader>

      <PaperContent>
        <Box>
          <Text
            fontSize={4}
            fontWeight={1}
            mb={4}
          >
            {t('inviteToSpaceModal.sendInviteLinkTitle')}
          </Text>

          <SpaceInviteBtn
            css={css`float: left`}
          >
            {t('spaceButtons.inviteToSpaceBtn.title')}
          </SpaceInviteBtn>
        </Box>
      </PaperContent>
    </Modal>
  );
};

export {
  Layout,
};
