import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

import { spaceHelpers } from '@components/domains/space/helpers';
import { SpaceProvider } from '@components/domains/space/SpaceProvider';
import { StoriesList } from '@components/domains/stories/StoriesList';

import { PageLayoutNarrow } from '@components/uiKit/PageLayoutNarrow';

import { TRANS } from '@components/utils/types';

import { getInitialPropsTasksListPage } from '@Next/ssr';

import { auth } from '@lib/auth';

const TasksPage: TAppPage<{}, {}> = () => (
  <SpaceProvider>
    <PageLayoutNarrow>
      <StoriesList />
    </PageLayoutNarrow>
  </SpaceProvider>
);

export const getServerSideProps = reduxWrapper.getServerSideProps((store) => async (ctx) => {
  spaceHelpers.initPage(store, ctx);
  await getInitialPropsTasksListPage(store);

  const { locale } = ctx;
  const currLocale = locale || 'en';

  return {
    props: {
      ...(await serverSideTranslations(currLocale, [TRANS.MAIN, TRANS.SEO])),
    },
  };
});

export default auth.withAuthSync(TasksPage);
