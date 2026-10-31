import { routing } from '@chpokify/routing';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useSelector } from 'react-redux';

import { configSelectors } from '@Redux/domains/config/selectors';
import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

import { Header } from '@components/domains/layouts/Header';
import { ChpokifyHelmet } from '@components/domains/marketing/ChpokifyHelmet';
import { schemaOrgHelpers } from '@components/domains/marketing/helpers/shemaOrg';
import { LDJson } from '@components/domains/marketing/LDJson';

import { Box } from '@components/uiKit/Box';
import { Grid } from '@components/uiKit/Grid';
import { LinkComponent } from '@components/uiKit/Link';
import { PageLayout } from '@components/uiKit/PageLayout';
import { PageTitle } from '@components/uiKit/PageTitle';
import { Text } from '@components/uiKit/Text';

import { LOCALE, TRANS } from '@components/utils/types';

import { urlJoin } from '@lib/urlJoin';

const blogUrl = routing.getBlogUrl();

const communityUrl = routing.getCommunityUrl();

type TSitemapLink = Partial<{ target: string, title: string, href: string, isAbsolute: boolean }>;

type TSitemapLinks = Record<string, Array<TSitemapLink>>;

const getSitemapLinks = (t: TFunction):TSitemapLinks => ({
  [t('pages.sitemap.productTitle')]: [
    {
      title: t('pages.sitemap.registrationLink'),
      href: routing.getSignUpUrl(),
    },
    {
      title: t('pages.sitemap.pricesLink'),
      href: routing.getPricingUrl(),
    },
  ],
  [t('pages.sitemap.socialTitle')]: [
    {
      title: t('pages.sitemap.discordLink'),
      href: routing.getDiscordUrl(),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.youtubeLink'),
      href: routing.getYoutubeUrl(),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.facebookLink'),
      href: routing.getFacebookUrl(),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.linkedInLink'),
      href: routing.getLinkedInUrl(),
      target: '_blank',
      isAbsolute: true,
    },
  ],
  [t('pages.sitemap.blogTitle')]: routing.getBlogUrls()
    .map((url, idx) => ({
      title: t(`pages.sitemap.blog.article${idx}`),
      href: urlJoin(blogUrl, url),
      target: '_blank',
      isAbsolute: true,
    })),
  [t('pages.sitemap.communityTitle')]: [
    {
      title: t('pages.sitemap.community.chpokifyCommunity'),
      href: communityUrl,
      target: '_blank',
      isAbsolute: true,
    },
  ],
  [t('pages.sitemap.communityAndGeneralTitle')]: [
    {
      title: t('pages.sitemap.community.affinityEstimationVsPlanningPoker'),
      href: urlJoin(communityUrl, routing.getCommunityAffinityEstimationUrl()),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.community.taskPointsVsStoryPoints'),
      href: urlJoin(communityUrl, routing.getCommunityTaskPointsUrl()),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.community.productManagementAdvice'),
      href: urlJoin(communityUrl, routing.getCommunityProductManagementAdviceUrl()),
      target: '_blank',
      isAbsolute: true,
    },
  ],
  [t('pages.sitemap.communityAndScrumTitle')]: [
    {
      title: t('pages.sitemap.community.benefitsOfScrumPoker'),
      href: urlJoin(communityUrl, routing.getCommunityBenefitsOfScrumPokerUrl()),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.community.howToPlayScrumPoker'),
      href: urlJoin(communityUrl, routing.getCommunityHowToPlayScrumPokerUrl()),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.community.planningPokerScrumMasters'),
      href: urlJoin(communityUrl, routing.getCommunityHowToPlayPlanningPokerUrl()),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.community.scrumPokerOnline'),
      href: urlJoin(communityUrl, routing.getCommunityScrumPokerOnlineUrl()),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.community.whatIsScrumPoker'),
      href: urlJoin(communityUrl, routing.getCommunityWhatIsScrumPokerUrl()),
      target: '_blank',
      isAbsolute: true,
    },
  ],
  [t('pages.sitemap.communityAndPlanningTitle')]: [
    {
      title: t('pages.sitemap.community.howToPlayPlanningPoker'),
      href: urlJoin(communityUrl, routing.getCommunityHowToPlayPlanningPokerUrl()),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.community.pokerTipsInScrumPlanningPoker'),
      href: urlJoin(communityUrl, routing.getCommunityPokerTipsInScrumPlanningPokerUrl()),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.community.top5PlanningPokerTools'),
      href: urlJoin(communityUrl, routing.getCommunityTop5PlanningPokerToolsUrl()),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.community.planningPokerEstimation'),
      href: urlJoin(communityUrl, routing.getCommunityPlanningPokerEstimationUrl()),
      target: '_blank',
      isAbsolute: true,
    },
    {
      title: t('pages.sitemap.community.planningPokerWorks'),
      href: urlJoin(communityUrl, routing.getCommunityPlanningPokerWorksUrl()),
      target: '_blank',
      isAbsolute: true,
    },
  ],
  [t('pages.sitemap.legalTitle')]: [
    {
      title: t('pages.sitemap.privacyPolicyLink'),
      href: routing.getPrivacyPolicyUrl(),
    },
    {
      title: t('pages.sitemap.termsOfUseLink'),
      href: routing.getTermsOfUseUrl(),
    },
  ],
});

const Sitemap: TAppPage<{}, {}> = () => {
  const baseUrl = useSelector(configSelectors.getBaseUrl);
  const absoluteUrl = useSelector(configSelectors.getAbsoluteUrl)(
    routing.getSitemapUrl()
  );

  const { t } = useTranslation(TRANS.MAIN);
  const { t: tSeo } = useTranslation(TRANS.SEO);

  const sitemapLinks = getSitemapLinks(t);

  const renderLink = (link: TSitemapLink) => (
    <Box
      as="li"
      key={link.href}
    >
      <LinkComponent
        isExternal={false}
        href={link.isAbsolute ? link.href : `${baseUrl}${link.href}`}
        target={link.target || '_self'}
      >
        {link.title}
      </LinkComponent>
    </Box>
  );

  const renderContent = () =>
    Object.keys(sitemapLinks)
      .map((keySitemapLink) => {
        const links = sitemapLinks[keySitemapLink];
        return (
          <Box
            key={keySitemapLink}
            mt={4}
          >
            <Text
              fontSize={3}
              fontWeight={1}
              mb={4}
            >
              {keySitemapLink}
            </Text>
            <Grid
              as="ul"
              justifyContent="flex-start"
              gridGap={2}
            >
              {
                links.map(renderLink)
              }
            </Grid>
          </Box>
        );
      });

  return (
    <>
      <ChpokifyHelmet>
        <link
          rel="canonical"
          href={absoluteUrl}
        />
      </ChpokifyHelmet>

      <LDJson
        schema={schemaOrgHelpers.getWebPage({
          name: tSeo('sitemap.title'),
          description: tSeo('sitemap.description'),
          url: absoluteUrl,
        })}
      />

      <LDJson
        schema={schemaOrgHelpers.getBreadcrumbsIndex()}
      />

      <Header />
      <PageLayout>
        <PageTitle>
          {
            t('sitemap.title')
          }
        </PageTitle>
        <Grid
          gridTemplateColumns={[
            '1fr',
            'repeat(3,1fr)',
            'repeat(4,1fr)',
          ]}
          gridGap={6}
        >
          {
            renderContent()
          }
        </Grid>
      </PageLayout>
    </>
  );
};

export const getServerSideProps = reduxWrapper.getServerSideProps(() => async (ctx) =>
  ({
    props: {
      ...(await serverSideTranslations(ctx.locale || LOCALE.EN, [TRANS.MAIN, TRANS.SEO])),
    },
  }));

export default Sitemap;
