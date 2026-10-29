import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { reduxWrapper } from '@Redux/lib/configureStore';

import { Footer } from '@components/domains/layouts/Footer';
import { Header } from '@components/domains/layouts/Header';
import { SpaceChoose } from '@components/domains/space/SpaceChoose';

import { ContentCenter } from '@components/uiKit/ContentCenter';
import { PageLayout } from '@components/uiKit/PageLayout';

import { LOCALE, TRANS } from '@components/utils/types';

import { auth } from '@lib/auth';

const ChoosePage = () => (
  <>
    <Header />

    <PageLayout>
      <ContentCenter>
        <SpaceChoose />
      </ContentCenter>
    </PageLayout>

    <Footer />
  </>
);

export const getServerSideProps = reduxWrapper.getServerSideProps(() => async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale || LOCALE.EN, [TRANS.MAIN, TRANS.SEO])),
  },
}));

export default auth.withAuthSync(ChoosePage);
