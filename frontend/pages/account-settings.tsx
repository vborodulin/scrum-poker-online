import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

import { EmailSettings } from '@components/domains/accountSettings/EmailSettings';
import { PasswordSettings } from '@components/domains/accountSettings/PasswordSettings';
import { UsernameSettings } from '@components/domains/accountSettings/UsernameSettings';
import { Footer } from '@components/domains/layouts/Footer';
import { Header } from '@components/domains/layouts/Header';

import { Grid } from '@components/uiKit/Grid';
import { PageLayoutNarrow } from '@components/uiKit/PageLayoutNarrow';
import { PageTitle } from '@components/uiKit/PageTitle';

import { LOCALE, TRANS } from '@components/utils/types';

import { auth } from '@lib/auth';

const AccountSettingsPage: TAppPage<{}, {}> = () => {
  const { t } = useTranslation(TRANS.MAIN);

  return (
    <>
      <Header />

      <PageLayoutNarrow
        maxWidth="600px"
      >
        <PageTitle>
          {t('accountSettings.title')}
        </PageTitle>

        <Grid
          gridGap={6}
        >
          <UsernameSettings />
          <EmailSettings />
          <PasswordSettings />
        </Grid>
      </PageLayoutNarrow>

      <Footer />
    </>
  );
};

export const getServerSideProps = reduxWrapper.getServerSideProps(() => async (ctx) =>
  ({
    props: {
      ...(await serverSideTranslations(ctx.locale || LOCALE.EN, [TRANS.MAIN, TRANS.SEO])),
    },
  }));

export default auth.withAuthSync(AccountSettingsPage);
