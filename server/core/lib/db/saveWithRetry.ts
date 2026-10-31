import mongoose from 'mongoose';

const MAX_ATTEMPTS = 10;
const RETRY_DELAY_STEP_MS = 15;

type TMutate<TDoc> = (doc: TDoc) => Promise<void> | void;

type TOptions = {
  // thrown when the document disappeared between attempts (e.g. it was deleted concurrently)
  notFoundError: () => Error;
};

// random growing delay: concurrent writers of one document (e.g. whole team adds cards at once)
// do not collide again on every attempt
const delayBeforeRetry = (attempt: number) => new Promise((resolve) => {
  global.setTimeout(resolve, Math.random() * RETRY_DELAY_STEP_MS * attempt);
});

const isConcurrencyConflict = (err: unknown) => err instanceof mongoose.Error.VersionError
  // mongoose reports version conflict as DocumentNotFoundError when only Mixed paths changed
  || err instanceof mongoose.Error.DocumentNotFoundError;

/**
 * Applies mutation and saves the document.
 * Works with schemas with `optimisticConcurrency: true`: if the document was changed concurrently,
 * reloads it and applies mutation again, so validations in mutation run against the actual state
 * and no concurrent update is lost (no last-write-wins on arrays).
 * Mutation must be idempotent with respect to the passed document: it is called once per attempt.
 */
const saveWithRetry = async <TDoc extends mongoose.Document>(
  doc: TDoc,
  mutate: TMutate<TDoc>,
  options: TOptions,
  attempt: number = 1
): Promise<TDoc> => {
  await mutate(doc);

  try {
    await doc.save();
    return doc;
  } catch (err) {
    if (!isConcurrencyConflict(err) || attempt >= MAX_ATTEMPTS) {
      throw err;
    }

    await delayBeforeRetry(attempt);

    const Model = doc.constructor as mongoose.Model<TDoc>;
    const actualDoc = await Model.findById(doc._id);

    if (!actualDoc) {
      throw options.notFoundError();
    }

    return saveWithRetry(actualDoc, mutate, options, attempt + 1);
  }
};

export {
  isConcurrencyConflict,
  saveWithRetry,
};
