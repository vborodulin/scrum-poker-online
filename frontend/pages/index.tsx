import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useSelector } from 'react-redux';

import { configSelectors } from '@Redux/domains/config/selectors';
import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

import { IndexCta } from '@components/domains/Index/IndexCta';
import { IndexHero } from '@components/domains/Index/IndexHero';
import { IndexPoker } from '@components/domains/Index/IndexPoker';
import { IndexProducts } from '@components/domains/Index/IndexProducts';
import { IndexRetro } from '@components/domains/Index/IndexRetro';
import { IndexSteps } from '@components/domains/Index/IndexSteps';
import { Footer } from '@components/domains/layouts/Footer';
import { Header } from '@components/domains/layouts/Header';
import { ChpokifyHelmet } from '@components/domains/marketing/ChpokifyHelmet';
import { schemaOrgHelpers } from '@components/domains/marketing/helpers/shemaOrg';
import { LDJson } from '@components/domains/marketing/LDJson';
import { spaceHelpers } from '@components/domains/space/helpers';

import { LOCALE, TRANS } from '@components/utils/types';

const HomePage: TAppPage<{}, {}> = () => {
  const baseUrl = useSelector(configSelectors.getBaseUrl);

  const { t } = useTranslation(TRANS.SEO);

  return (
    <>
      <ChpokifyHelmet>
        <link
          rel="canonical"
          href={baseUrl}
        />
      </ChpokifyHelmet>

      <LDJson
        schema={schemaOrgHelpers.getWebPage({
          name: t('index.title'),
          description: t('index.description'),
          url: baseUrl,
        })}
      />

      <LDJson
        schema={schemaOrgHelpers.getBreadcrumbsIndex()}
      />

      <Header />

      <main>
        <IndexHero />
        <IndexProducts />
        <IndexPoker />
        <IndexRetro />
        <IndexSteps />
        <IndexCta />
      </main>

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

export default HomePage;
