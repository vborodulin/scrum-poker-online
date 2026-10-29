import { transServer } from '@chpokify/i18n';
import { SUPPORT_EMAIL } from '@chpokify/models-types/info';
import { routing, ROUTING_EXTERNAL } from '@chpokify/routing';

import { log } from '@core/lib/logger';
import { mailer } from '@core/lib/mailer';

import { getInviteToSpaceEmailContent } from '@mail/emails/inviteToSpace';
import { getResetEmailContent } from '@mail/emails/resetPassword';
import { getWelcomeEmailContent } from '@mail/emails/welcome';

import { routesHelpers } from '@routes/helpers';

const EMAIL_FROM = {
  name: 'Chpokify',
  address: SUPPORT_EMAIL,
};

const sendRestorePasswordEmail = async (username: string, email: string, resetPasswordUrl: string) => {
  try {
    const content = getResetEmailContent(
      username,
      resetPasswordUrl
    );

    await mailer.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: transServer.t('emails.passwordReset.subject'),
      text: content.txt,
      html: content.html,
    });
  } catch (err) {
    log.error(err);
  }
};

const sendInviteToSpaceEmail = async (
  email: string,
  spaceName: string,
  inviteUrl: string
) => {
  try {
    const content = getInviteToSpaceEmailContent(
      spaceName,
      inviteUrl
    );

    await mailer.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: transServer.t('emails.spaceInvite.subject', {
        spaceName,
      }),
      text: content.txt,
      html: content.html,
    });
  } catch (err) {
    log.error(err);
  }
};

const sendWelcomeEmail = async (
  username: string,
  email: string
) => {
  try {
    const content = getWelcomeEmailContent(
      {
        username,
        facebookUrl: ROUTING_EXTERNAL.FACEBOOK_URL,
        youtubeUrl: ROUTING_EXTERNAL.YOUTUBE_URL,
        guideUrl: ROUTING_EXTERNAL.PLANNING_POKER_GUIDE_URL,
        jiraConnectUrl: routesHelpers.getUrl(routing.getJiraConnectUrl()),
        upgradeUrl: routesHelpers.getUrl(routing.getIndexUrl()),
        supportEmail: SUPPORT_EMAIL,
      }
    );

    await mailer.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: transServer.t('emails.welcome.subject'),
      html: content.html,
    });

    return;
  } catch (err) {
    return {
      err,
    };
  }
};

const mailService = {
  sendRestorePasswordEmail,
  sendInviteToSpaceEmail,
  sendWelcomeEmail,
};

export { mailService };
