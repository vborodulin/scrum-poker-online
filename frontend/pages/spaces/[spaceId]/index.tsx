import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useSelector } from 'react-redux';

import { spacesSelectors } from '@Redux/domains/spaces/selectors';
import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

import { NotFound } from '@components/domains/layouts/NotFound';
import { spaceHelpers } from '@components/domains/space/helpers';
import { SpaceOnboarding } from '@components/domains/space/onboarding/SpaceOnboarding';
import { Space } from '@components/domains/space/Space';
import { SpaceProvider } from '@components/domains/space/SpaceProvider';

import { PageLayout } from '@components/uiKit/PageLayout';

import { TRANS } from '@components/utils/types';

import { getInitialPropsSpacePage } from '@Next/ssr';

import { auth } from '@lib/auth';

const SpacePage: TAppPage<{}, {}> = () => {
  const currSpace = useSelector(spacesSelectors.getCurrSpace);

  const renderContent = () => {
    if (!currSpace) {
      return (
        <NotFound />
      );
    }

    return (
      <>
        <Space />
        <SpaceOnboarding />
      </>
    );
  };

  return (
    <SpaceProvider>
      <PageLayout>
        {
          renderContent()
        }
      </PageLayout>
    </SpaceProvider>
  );
};

export const getServerSideProps = reduxWrapper.getServerSideProps((store) => async (ctx) => {
  spaceHelpers.initPage(store, ctx);
  await getInitialPropsSpacePage(store);

  const { locale } = ctx;
  const currLocale = locale || 'en';

  return {
    props: {
      ...(await serverSideTranslations(currLocale, [TRANS.MAIN, TRANS.SEO])),
    },
  };
});

export default auth.withAuthSync(SpacePage);
