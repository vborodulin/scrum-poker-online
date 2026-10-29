import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

import { KanbanBoard } from '@components/domains/kanban/KanbanBoard';
import { spaceHelpers } from '@components/domains/space/helpers';
import { SpaceProvider } from '@components/domains/space/SpaceProvider';

import { PageLayout } from '@components/uiKit/PageLayout';

import { TRANS } from '@components/utils/types';

import { getInitialPropsKanbanBoardPage } from '@Next/ssr';

import { auth } from '@lib/auth';

const KanbanPage: TAppPage<{}, {}> = () => (
  <SpaceProvider>
    <PageLayout
      maxWidth="initial"
    >
      <KanbanBoard />
    </PageLayout>
  </SpaceProvider>
);

export const getServerSideProps = reduxWrapper.getServerSideProps((store) => async (ctx) => {
  spaceHelpers.initPage(store, ctx);
  await getInitialPropsKanbanBoardPage(store, ctx);

  const { locale } = ctx;
  const currLocale = locale || 'en';

  return {
    props: {
      ...(await serverSideTranslations(currLocale, [TRANS.MAIN, TRANS.SEO])),
    },
  };
});

export default auth.withAuthSync(KanbanPage);
