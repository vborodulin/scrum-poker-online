import { TEntityID } from '@chpokify/models-types';

const getIndexUrl = () => '/';

const getLogInUrl = () => '/log-in';

const getSignUpUrl = () => '/sign-up';

const getForgotPasswordUrl = () => '/forgot-password';

const getResetPasswordUrlTemplate = () => '/reset-password/[token]';
const getResetPasswordUrl = (token: string) => getResetPasswordUrlTemplate()
  .replace('[token]', token);

// account-settings
const getAccountSettingsUrl = () => '/account-settings';

// marketing
const getPrivacyPolicyUrl = () => '/privacy-policy';
const getTermsOfUseUrl = () => '/terms';

// payments
const getSponsorshipUrl = () => '/sponsorship';

const getPricingUrl = () => '/pricing';

const getSitemapUrl = () => '/sitemap';

/**
 * Routes to projects
 */
const getSpaceUrlTemplate = () => '/spaces/[spaceId]';
const getSpaceUrl = (spaceId: TEntityID) => getSpaceUrlTemplate()
  .replace('[spaceId]', spaceId.toString());

const getSpacesChooseUrl = () => '/spaces/choose';

const getSpacePricingTemplate = () => '/spaces/[spaceId]/pricing';
const getSpacePricingUrl = (spaceId: TEntityID) => getSpacePricingTemplate()
  .replace('[spaceId]', spaceId.toString());

const getInviteToSpaceTemplate = () => '/spaces/invite/[token]';
const getInviteToSpaceUrl = (token: string) => getInviteToSpaceTemplate()
  .replace('[token]', token);

const getInviteToPokerSessionTemplate = () => '/poker/invite/[token]';
const getInviteToPokerSessionUrl = (token: string) => getInviteToPokerSessionTemplate()
  .replace('[token]', token);

const getSpaceSettingsTemplate = () => '/spaces/[spaceId]/settings';
const getSpaceSettingsUrl = (spaceId: TEntityID) => getSpaceSettingsTemplate()
  .replace('[spaceId]', spaceId.toString());

const getPokerSessionUrlTemplate = () => '/spaces/[spaceId]/poker/[pokerSessionId]';
const getPokerUrl = (spaceId: TEntityID, pokerSessionId: TEntityID) => getPokerSessionUrlTemplate()
  .replace('[spaceId]', spaceId.toString())
  .replace('[pokerSessionId]', pokerSessionId.toString());

const getKanbanUrlTemplate = () => '/spaces/[spaceId]/kanban';
const getKanbanUrl = (spaceId: TEntityID) => getKanbanUrlTemplate()
  .replace('[spaceId]', spaceId.toString());

const getKanbanBoardUrlTemplate = () => '/spaces/[spaceId]/kanban/[kanbanBoardId]';
const getKanbanBoardUrl = (spaceId: TEntityID, kanbanBoardId: TEntityID) => getKanbanBoardUrlTemplate()
  .replace('[spaceId]', spaceId.toString())
  .replace('[kanbanBoardId]', kanbanBoardId.toString());

const getRetroUrlTemplate = () => '/spaces/[spaceId]/retro';
const getRetroUrl = (spaceId: TEntityID) => getRetroUrlTemplate()
  .replace('[spaceId]', spaceId.toString());

const getRetroSessionUrlTemplate = () => '/spaces/[spaceId]/retro/[retroSessionId]';
const getRetroSessionUrl = (spaceId: TEntityID, retroSessionId: TEntityID) => getRetroSessionUrlTemplate()
  .replace('[spaceId]', spaceId.toString())
  .replace('[retroSessionId]', retroSessionId.toString());

const getInviteToRetroSessionTemplate = () => '/retro/invite/[token]';
const getInviteToRetroSessionUrl = (token: string) => getInviteToRetroSessionTemplate()
  .replace('[token]', token);

/**
 *
 */

// donate
const getDonateUrl = () => '/sponsorship';

// jira connect
const getJiraConnectUrl = () => '/jira-connect';

const getJiraFieldScreenUrl = () => '/jira-field-to-screen';

const getJiraCallbackUrl = () => '/jira/callback';

// resources
const getBlogUrl = () => 'https://blog.chpokify.com/';

const getAgileMeetupUrl = () => 'https://www.facebook.com/events/4939790466042151';

const getLiveXPEnglishBannerUrl = () => 'https://track.livexp.com/click?pid=9&offer_id=3';

const getAppStoreUrl = () => 'https://apps.apple.com/ru/app/chpokify/id1592132191';

const getBlogUrls = () => [
  '/',
  '/about-the-project-approach/',
  '/advice-for-new-scrum-masters/',
  '/how-to-improve-your-team-engagement-guide-template/',
  '/about-planning-poker-for-the-external-sources-use/',
  '/performance-review/',
  '/when-agile-is-a-mistake-project-managers-opinion/',
  '/deversity-of-culture-fit/',
  '/architectural-review-of-the-sprint/',
  '/no-rules-netflixs-unique-culture-2/',
  '/state-of-agile-from-digital-ai/',
  '/shared-ownership-of-the-code/',
  '/how-often-do-you-think-about-the-tuchman-model/',
  '/should-a-team-assign-work-during-sprint-planning/',
  '/roman-pichler-und-seine-q-a-sitzung-zum-produktziel-bei-scrum/',
  '/what-does-task-done-mean-when-does-the-developers-work-end/',
  '/how-the-retrospective-reflects-the-stage-of-the-teams-formation/',
  '/developer-in-discovery-profit-for-the-product/',
  '/getting-capm-certification-based-on-pmbok-6/',
  '/what-can-be-difficult-in-the-position-of-an-agile-coach/',
  '/developer-in-discovery-profit-for-the-developer/',
  '/development-cycle/',
];

// community

const getCommunityUrl = () => 'https://chpokify.com/community/';

const getCommunityAffinityEstimationUrl = () => '/affinity-estimation-vs-planning-poker/';

const getCommunityTaskPointsUrl = () => '/task-points-vs-story-points/';

const getCommunityProductManagementAdviceUrl = () => '/product-management-advice/';

const getCommunityBenefitsOfScrumPokerUrl = () => '/benefits-of-scrum-poker/';

const getCommunityHowToPlayScrumPokerUrl = () => '/how-to-play-scrum-poker/';

const getCommunityPlanningPokerScrumMastersUrl = () => '/scrum-master-planning-poker/';

const getCommunityScrumPokerOnlineUrl = () => '/scrum-poker-online/';

const getCommunityWhatIsScrumPokerUrl = () => '/scrum-poker-what-is-it/';

const getCommunityHowToPlayPlanningPokerUrl = () => '/how-to-play-planning-poker/';

const getCommunityJiraPlanningPokerUrl = () => '/jira-planning-poker/';

const getCommunityPokerTipsInScrumPlanningPokerUrl = () => '/planning-poker-online/';

const getCommunityTop5PlanningPokerToolsUrl = () => '/top-5-planning-poker-tools/';

const getCommunityPlanningPokerEstimationUrl = () => '/what-is-the-planning-poker-estimation-technique-used-for/';

const getCommunityPlanningPokerWorksUrl = () => '/why-planning-poker-works/';

const getDiscordUrl = () => 'https://discord.gg/QC8fCMYWyC';

const getYoutubeUrl = () => 'https://www.youtube.com/channel/UCNUYYqX4UiohLcvLB536Bqw';

const getFacebookUrl = () => 'https://www.facebook.com/Chpokify';

const getLinkedInUrl = () => 'https://www.linkedin.com/company/chpokify';

// issues
const getTasksTemplate = () => '/spaces/[spaceId]/tasks';
const getTasksUrl = (spaceId: TEntityID) => getTasksTemplate()
  .replace('[spaceId]', spaceId.toString());

// payment
const getPaymentSuccessTemplate = () => '/spaces/[spaceId]/payment/success';
const getPaymentSuccessUrl = (spaceId: TEntityID) => getPaymentSuccessTemplate()
  .replace('[spaceId]', spaceId.toString());

const getKeepmailCallbackUrl = () => '/keepmail/callback';

const routing = {
  getIndexUrl,
  getLogInUrl,
  getSignUpUrl,
  getForgotPasswordUrl,
  getResetPasswordUrlTemplate,
  getResetPasswordUrl,
  getSpaceUrlTemplate,
  getSpaceUrl,
  getSpacesChooseUrl,
  getInviteToSpaceUrl,
  getInviteToSpaceTemplate,
  getSpaceSettingsUrl,
  getSpaceSettingsTemplate,
  getAccountSettingsUrl,
  getPokerUrl,
  getPokerSessionUrlTemplate,
  getPrivacyPolicyUrl,
  getTermsOfUseUrl,
  getSponsorshipUrl,
  getPricingUrl,
  getJiraFieldScreenUrl,
  getKanbanUrl,
  getKanbanUrlTemplate,
  getRetroUrl,
  getRetroUrlTemplate,
  getDonateUrl,
  getJiraConnectUrl,
  getJiraCallbackUrl,
  getBlogUrl,
  getTasksTemplate,
  getTasksUrl,
  getSpacePricingTemplate,
  getSpacePricingUrl,
  // payment
  getPaymentSuccessUrl,
  getInviteToPokerSessionUrl,
  getSitemapUrl,
  getDiscordUrl,
  getYoutubeUrl,
  getFacebookUrl,
  getLinkedInUrl,
  // Blog urls
  getBlogUrls,
  // Community url
  getCommunityUrl,
  // Community urls
  getCommunityAffinityEstimationUrl,
  getCommunityTaskPointsUrl,
  getCommunityProductManagementAdviceUrl,
  getCommunityBenefitsOfScrumPokerUrl,
  getCommunityHowToPlayScrumPokerUrl,
  getCommunityPlanningPokerScrumMastersUrl,
  getCommunityScrumPokerOnlineUrl,
  getCommunityWhatIsScrumPokerUrl,
  getCommunityHowToPlayPlanningPokerUrl,
  getCommunityJiraPlanningPokerUrl,
  getCommunityPokerTipsInScrumPlanningPokerUrl,
  getCommunityTop5PlanningPokerToolsUrl,
  getCommunityPlanningPokerEstimationUrl,
  getCommunityPlanningPokerWorksUrl,
  getKanbanBoardUrlTemplate,
  getKanbanBoardUrl,
  getRetroSessionUrlTemplate,
  getRetroSessionUrl,
  getInviteToRetroSessionTemplate,
  getInviteToRetroSessionUrl,
  getAgileMeetupUrl,
  getLiveXPEnglishBannerUrl,
  getAppStoreUrl,
  getKeepmailCallbackUrl,
};

const REPORT_URL = 'https://forms.gle/YxhGxcDGH17nyjYt9';
const FEEDBACK_URL = 'https://forms.gle/fTfm2k6jpqqF1FhW8';
const HOW_TO_PLAY_URL = 'https://www.youtube.com/watch?v=_yYJGsICIbM';
const INTERFACE_OVERVIEW_VIDEO_URL = 'https://www.youtube.com/watch?v=GJv69bNWk2E';
const TWITTER_URL = 'https://twitter.com/chpokify';
const FACEBOOK_URL = 'https://www.facebook.com/Chpokify';
const LINKEDIN_URL = 'https://www.linkedin.com/company/chpokify';
const YOUTUBE_URL = 'https://www.youtube.com/channel/UCNUYYqX4UiohLcvLB536Bqw';
const DISCORD_CHANNEL = 'https://discord.gg/QC8fCMYWyC';
const PLANNING_POKER_GUIDE_URL = 'https://chpokify.com/community/how-to-play-planning-poker/';

const ROUTING_EXTERNAL = {
  REPORT_URL,
  FEEDBACK_URL,
  HOW_TO_PLAY_URL,
  INTERFACE_OVERVIEW_VIDEO_URL,
  TWITTER_URL,
  FACEBOOK_URL,
  LINKEDIN_URL,
  YOUTUBE_URL,
  DISCORD_CHANNEL,
  PLANNING_POKER_GUIDE_URL,
};

const ROUTING_DEEPLINK = {
  LOGOUT: 'chpokify://logout',
};

export {
  routing,
  ROUTING_EXTERNAL,
  ROUTING_DEEPLINK,
};
