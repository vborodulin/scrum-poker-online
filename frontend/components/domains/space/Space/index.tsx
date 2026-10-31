import { useTranslation } from 'next-i18next';
import React from 'react';

import { CreateSession } from '@components/domains/poker/PokerSessionCreate';
import { PokerSessionsList } from '@components/domains/poker/PokerSessionsList';
import { Participants } from '@components/domains/space/Participants';
import { PokerCardDecks } from '@components/domains/space/PokerCardDecks';
import { SpaceStatistics } from '@components/domains/space/SpaceStatisctics';
import { Teams } from '@components/domains/space/Teams';

import { Grid } from '@components/uiKit/Grid';
import { PageTitle } from '@components/uiKit/PageTitle';

import { TRANS } from '@components/utils/types';

const Space = () => {
  const { t } = useTranslation(TRANS.MAIN);
  return (
    <>
      <PageTitle>
        {t('pages.space.title')}
      </PageTitle>

      <Grid
        gridTemplateColumns={['1fr', null, '1.4fr 1fr']}
        gridGap={6}
        alignItems="flex-start"
      >
        <Grid
          gridGap={5}
        >
          <CreateSession />

          <SpaceStatistics />

          <PokerSessionsList />
        </Grid>

        <Grid
          gridGap={6}
        >
          <Teams />
          <Participants />
          <PokerCardDecks />
        </Grid>
      </Grid>
    </>
  );
};

export {
  Space,
};
