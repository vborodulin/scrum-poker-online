import { TEntityID } from '@chpokify/models-types';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { PokerFeedBackBtn } from '@components/domains/poker/buttons/PokerFeedBackBtn';
import { PokerSessionInviteBtn } from '@components/domains/poker/buttons/PokerSessionInviteBtn';
import { PokerStoriesBtn } from '@components/domains/poker/buttons/PokerStoriesBtn';
import { PokerSessionStats } from '@components/domains/poker/PokerSession/PokerSessionHeader/PokerSessionStats';

import { Flex } from '@components/uiKit/Flex';

import { TRANS } from '@components/utils/types';

export type TPokerSessionActionsProps = {
  pokerSessionId: TEntityID;
}

const PokerSessionActions = (props: TPokerSessionActionsProps): React.ReactElement | null => {
  const {
    pokerSessionId,
  } = props;

  const { t } = useTranslation(TRANS.MAIN);

  return (
    <Flex
      gap={4}
      flexWrap="wrap"
    >
      <PokerSessionStats
        pokerSessionId={pokerSessionId}
      />

      <PokerStoriesBtn
        display={['initial', null, 'none']}
      />

      <PokerSessionInviteBtn
        pokerSessionId={pokerSessionId}
        variant="base"
      >
        {t('pokerSession.linkBtn')}
      </PokerSessionInviteBtn>

      <PokerFeedBackBtn
        pokerSessionId={pokerSessionId}
        variant="base"
      />
    </Flex>
  );
};

export {
  PokerSessionActions,
};
