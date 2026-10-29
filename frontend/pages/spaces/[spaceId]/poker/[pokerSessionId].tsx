import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

import { PokerSession } from '@components/domains/poker/PokerSession';
import { PokerVotingScoresBanner } from '@components/domains/poker/PokerVotingScoresBanner';
import { PokerSessionSubscriber } from '@components/domains/poker/utils/PokerSessionSubscriber';
import { PokerUserInSessionProcessor } from '@components/domains/poker/utils/PokerUserInSessionScheduller';
import { PokerVisibilitySyncProcessor } from '@components/domains/poker/utils/PokerVisibilitySyncProcessor';
import { spaceHelpers } from '@components/domains/space/helpers';
import { SpaceProvider } from '@components/domains/space/SpaceProvider';

import { PageLayout } from '@components/uiKit/PageLayout';

import { TRANS } from '@components/utils/types';
import { WakeLockProcessor } from '@components/utils/WakeLockProcessor';

import { getInitialPropsPokerSessionPage } from '@Next/ssr';

import { auth } from '@lib/auth';

const PokerSessionPage: TAppPage<{}, {}> = () => (
  <SpaceProvider>
    <PageLayout>
      <PokerSession />
    </PageLayout>

    <PokerVotingScoresBanner />
    <PokerSessionSubscriber />
    <PokerUserInSessionProcessor />
    <WakeLockProcessor />
    <PokerVisibilitySyncProcessor />
  </SpaceProvider>
);

export const getServerSideProps = reduxWrapper.getServerSideProps((store) => async (ctx) => {
  spaceHelpers.initPage(store, ctx);
  await getInitialPropsPokerSessionPage(store, ctx);

  const { locale } = ctx;
  const currLocale = locale || 'en';

  return {
    props: {
      ...(await serverSideTranslations(currLocale, [TRANS.MAIN, TRANS.SEO])),
    },
  };
});

export default auth.withAuthSync(PokerSessionPage);
