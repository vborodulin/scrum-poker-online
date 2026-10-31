import { routing } from '@chpokify/routing';

import { configSelectors } from '@Redux/domains/config/selectors';
import { reduxWrapper } from '@Redux/lib/configureStore';
import { TAppPage } from '@Redux/types';

const STATIC_PAGE_PATHES = [
  routing.getIndexUrl(),
  routing.getLogInUrl(),
  routing.getSignUpUrl(),
  routing.getPrivacyPolicyUrl(),
  routing.getTermsOfUseUrl(),
  routing.getPricingUrl(),
];

const getStaticUrls = (baseUrl: string) => [
  routing.getCommunityUrl(),
  routing.getBlogUrl(),
  ...STATIC_PAGE_PATHES.map((path) => `${baseUrl}${path}`),
];

const getUrlMarkup = (url: string) => (
  `<url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
);

const getSitemapXml = (content: string) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${content}      
    </urlset>
  `;

const SitemapXml: TAppPage<any, any> = () => null;

export const getServerSideProps = reduxWrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { res } = ctx;

    if (!res) {
      return {
        props: {},
      };
    }

    const baseUrl = configSelectors.getBaseUrl(store.getState());

    const sitemapContent = getStaticUrls(baseUrl)
      .map((url) => getUrlMarkup(url))
      .join('');

    res.setHeader('Content-Type', 'text/xml');
    res.write(getSitemapXml(sitemapContent));
    res.end();

    return { props: {} };
  }
);

export default SitemapXml;
