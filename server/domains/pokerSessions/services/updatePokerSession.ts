import { transServer } from '@chpokify/i18n';
import { PokerSessionService } from '@pokerSessions/services/PokerSession';

import { saveWithRetry } from '@core/lib/db/saveWithRetry';
import { ERROR_CODES, NotFoundError } from '@core/lib/errors';

import { TPokerSessionDocument } from '@models/pokerSession';

type TMutate = (
  pokerSession: TPokerSessionDocument,
  pokerSessionService: PokerSessionService
) => Promise<void> | void;

/**
 * Applies mutation and saves poker session.
 * If the session was changed concurrently (VersionError), reloads it and applies mutation again,
 * so validations run against the actual state and no update is lost.
 */
const updatePokerSession = (
  pokerSession: TPokerSessionDocument,
  mutate: TMutate
): Promise<TPokerSessionDocument> => saveWithRetry(
  pokerSession,
  (doc) => mutate(doc, new PokerSessionService(doc)),
  {
    notFoundError: () => new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        message: transServer.t('errors.pokerSession.notFound'),
        path: ['params', 'pokerSessionId'],
      },
    ]),
  }
);

export {
  updatePokerSession,
};
