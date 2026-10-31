import { routing } from '@chpokify/routing';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useSelector } from 'react-redux';

import { configSelectors } from '@Redux/domains/config/selectors';
import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

import { LogIn } from '@components/domains/auth/LogIn';
import { Footer } from '@components/domains/layouts/Footer';
import { Header } from '@components/domains/layouts/Header';
import { ChpokifyHelmet } from '@components/domains/marketing/ChpokifyHelmet';
import { spaceHelpers } from '@components/domains/space/helpers';

import { ContentCenter } from '@components/uiKit/ContentCenter';
import { PageLayout } from '@components/uiKit/PageLayout';

import { LOCALE, TRANS } from '@components/utils/types';

const LogInPage: TAppPage<{}, {}> = () => {
  const absoluteUrl = useSelector(configSelectors.getAbsoluteUrl)(
    routing.getLogInUrl()
  );

  return (
    <>
      <ChpokifyHelmet
        page="login"
      >
        <link
          rel="canonical"
          href={absoluteUrl}
        />
      </ChpokifyHelmet>

      <Header />

      <PageLayout>
        <ContentCenter>
          <LogIn />
        </ContentCenter>
      </PageLayout>

      <Footer />
    </>
  );
};

export const getServerSideProps = reduxWrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { locale } = ctx;
    const currLocale = locale || LOCALE.EN;
    const redirectTo = spaceHelpers.redirectPageToLastSpace(store, ctx);

    if (redirectTo) {
      return redirectTo;
    }

    return {
      props: {
        ...(await serverSideTranslations(currLocale, [TRANS.MAIN, TRANS.SEO])),
      },
    };
  }
);

export default LogInPage;
