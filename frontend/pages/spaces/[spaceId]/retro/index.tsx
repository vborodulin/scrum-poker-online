import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

import { RetroIndex } from '@components/domains/retro/RetroIndex';
import { RetroSessionSubscriber } from '@components/domains/retro/utils/RetroSessionSubscriber';
import { spaceHelpers } from '@components/domains/space/helpers';
import { SpaceProvider } from '@components/domains/space/SpaceProvider';

import { PageLayout } from '@components/uiKit/PageLayout';

import { TRANS } from '@components/utils/types';

import { getInitialPropsRetroSessionsPage } from '@Next/ssr';

import { auth } from '@lib/auth';

const RetroPage: TAppPage<{ }, {}> = () => (
  <SpaceProvider>
    <PageLayout>
      <RetroIndex />
      <RetroSessionSubscriber />
    </PageLayout>
  </SpaceProvider>
);

export const getServerSideProps = reduxWrapper.getServerSideProps((store) => async (ctx) => {
  spaceHelpers.initPage(store, ctx);
  await getInitialPropsRetroSessionsPage(store);

  const { locale } = ctx;
  const currLocale = locale || 'en';

  return {
    props: {
      ...(await serverSideTranslations(currLocale, [TRANS.MAIN, TRANS.SEO])),
    },
  };
});

export default auth.withAuthSync(RetroPage);
