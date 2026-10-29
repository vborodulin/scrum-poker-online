import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

import { KanbanIndex } from '@components/domains/kanban/KanbanIndex';
import { spaceHelpers } from '@components/domains/space/helpers';
import { SpaceProvider } from '@components/domains/space/SpaceProvider';

import { PageLayout } from '@components/uiKit/PageLayout';

import { TRANS } from '@components/utils/types';

import { getInitialPropsKanbanPage } from '@Next/ssr';

import { auth } from '@lib/auth';

const KanbanIndexPage: TAppPage<{}, {}> = () => (
  <SpaceProvider>
    <PageLayout>
      <KanbanIndex />
    </PageLayout>
  </SpaceProvider>
);

export const getServerSideProps = reduxWrapper.getServerSideProps((store) => async (ctx) => {
  spaceHelpers.initPage(store, ctx);
  await getInitialPropsKanbanPage(store);

  const { locale } = ctx;
  const currLocale = locale || 'en';

  return {
    props: {
      ...(await serverSideTranslations(currLocale, [TRANS.MAIN, TRANS.SEO])),
    },
  };
});

export default auth.withAuthSync(KanbanIndexPage);
