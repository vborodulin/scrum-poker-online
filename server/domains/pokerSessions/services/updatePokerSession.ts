import { transServer } from '@chpokify/i18n';
import { PokerSessionService } from '@pokerSessions/services/PokerSession';
import mongoose from 'mongoose';

import { ERROR_CODES, NotFoundError } from '@core/lib/errors';

import { PokerSessionModel, TPokerSessionDocument } from '@models/pokerSession';

const MAX_ATTEMPTS = 5;

type TMutate = (
  pokerSession: TPokerSessionDocument,
  pokerSessionService: PokerSessionService
) => Promise<void> | void;

/**
 * Applies mutation and saves poker session.
 * If the session was changed concurrently (VersionError), reloads it and applies mutation again,
 * so validations run against the actual state and no update is lost.
 */
const updatePokerSession = async (
  pokerSession: TPokerSessionDocument,
  mutate: TMutate,
  attempt: number = 1
): Promise<TPokerSessionDocument> => {
  await mutate(pokerSession, new PokerSessionService(pokerSession));

  try {
    await pokerSession.save();
    return pokerSession;
  } catch (err) {
    // mongoose reports version conflict as DocumentNotFoundError when only Mixed paths (active, results) changed
    const isConflict = err instanceof mongoose.Error.VersionError
      || err instanceof mongoose.Error.DocumentNotFoundError;

    if (!isConflict || attempt >= MAX_ATTEMPTS) {
      throw err;
    }

    const actualPokerSession = await PokerSessionModel.findById(pokerSession._id);

    if (!actualPokerSession) {
      throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
        {
          message: transServer.t('errors.pokerSession.notFound'),
          path: ['params', 'pokerSessionId'],
        },
      ]);
    }

    return updatePokerSession(actualPokerSession, mutate, attempt + 1);
  }
};

export {
  updatePokerSession,
};
