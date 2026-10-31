import { isEqualsId } from '@chpokify/helpers';
import { transServer } from '@chpokify/i18n';
import { TEntityID } from '@chpokify/models-types';
import { flatten } from 'lodash';

import { saveWithRetry } from '@core/lib/db/saveWithRetry';
import { ERROR_CODES, NotFoundError } from '@core/lib/errors';

import { RetroRelationsModel, TRetroRelationsDocument } from '@models/retroRelations';
import { TRetroTemplateDocument } from '@models/retroTemplate';

class RetroRelationsService {
  public constructor(private retroRelations: TRetroRelationsDocument) {
  }

  public hasCard(cardId: TEntityID): boolean {
    return this.retroRelations.cardsIds.some((id) => isEqualsId(id, cardId));
  }

  public addCard(cardId: TEntityID, isTopCreate?: boolean) {
    this.insertCard(cardId, isTopCreate ? 0 : this.retroRelations.cardsIds.length);
  }

  /**
   * Inserts card at position (clamped to column bounds); does nothing if card is already in column,
   * so it is safe to call again on retry.
   */
  public insertCard(cardId: TEntityID, idx: number) {
    if (this.hasCard(cardId)) {
      return;
    }

    const cardsIds = Array.from(this.retroRelations.cardsIds);
    const position = Math.min(Math.max(idx, 0), cardsIds.length);

    cardsIds.splice(position, 0, cardId);

    this.retroRelations.set({ cardsIds });
  }

  /**
   * @returns false if card is not in column
   */
  public removeCard(cardId: TEntityID): boolean {
    if (!this.hasCard(cardId)) {
      return false;
    }

    this.retroRelations.set({
      cardsIds: this.retroRelations.cardsIds.filter((id) => !isEqualsId(id, cardId)),
    });

    return true;
  }

  public static async createRelationsFromColumns(retroTemplate: TRetroTemplateDocument) {
    if (!retroTemplate.columns.length) {
      return;
    }

    const promisesArr: Array<Promise<TRetroRelationsDocument>> = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const column of retroTemplate.columns) {
      const createNewRelations = RetroRelationsModel.createNew({
        templateId: retroTemplate._id,
        columnId: column._id,
      });
      promisesArr.push(createNewRelations.save());
    }

    await Promise.all(promisesArr);
  }

  public static getCardsIdsFromRelations(retroRelations: TRetroRelationsDocument[]): TEntityID[] {
    return flatten(retroRelations.map((retroRelation) => retroRelation.cardsIds));
  }

  /**
   * Card is found by id, not by index from client: client state may be outdated
   * (another participant added or moved cards in the column).
   * @returns false if card is not in column
   */
  public moveCardInColumn(cardId: TEntityID, cardFinishIdx: number): boolean {
    if (!this.removeCard(cardId)) {
      return false;
    }

    this.insertCard(cardId, cardFinishIdx);

    return true;
  }
}

/**
 * Applies mutation to column cards and saves it; on concurrent change (another participant
 * added / moved / removed a card in the same column) reloads the column and applies mutation again.
 */
const updateRetroRelation = (
  retroRelation: TRetroRelationsDocument,
  mutate: (retroRelation: TRetroRelationsDocument, service: RetroRelationsService) => void
): Promise<TRetroRelationsDocument> => saveWithRetry(
  retroRelation,
  (doc) => mutate(doc, new RetroRelationsService(doc)),
  {
    notFoundError: () => new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        message: transServer.t('errors.retroRelations.notFound'),
        path: ['templateId', 'columnId'],
      },
    ]),
  }
);

export { RetroRelationsService, updateRetroRelation };
