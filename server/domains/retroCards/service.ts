import { isEqualsId } from '@chpokify/helpers';
import { transServer } from '@chpokify/i18n';
import { TEntityID } from '@chpokify/models-types';
import { omit } from 'lodash';

import { saveWithRetry } from '@core/lib/db/saveWithRetry';
import { ERROR_CODES, NotFoundError } from '@core/lib/errors';

import { TRetroCardDocument } from '@models/retroCard';

class RetroCardService {
  public constructor(private retroCard: TRetroCardDocument) {
  }

  public updateDescriptionsCombinedCards(combinedCardsDescriptions: string[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [idx, card] of this.retroCard.combinedCards.entries()) {
      if (combinedCardsDescriptions[idx]) {
        card.description = combinedCardsDescriptions[idx];
      } else {
        card.description = '';
      }
    }

    this.retroCard.markModified('combinedCards');
  }

  public updateTitlesCombinedCards(combinedCardsTitle: string[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [idx, title] of combinedCardsTitle.entries()) {
      if (this.retroCard.combinedCards[idx]) {
        this.retroCard.combinedCards[idx].title = title;
      }
    }

    this.retroCard.markModified('combinedCards');
  }

  public removeCardsCombined(count: number) {
    this.retroCard.combinedCards.splice(count);
    this.retroCard.markModified('combinedCards');
  }

  public combineCard(card: TRetroCardDocument) {
    this.retroCard.votes.push(...card.votes);
    this.retroCard.combinedCards.push(omit(card, ['combinedCards']));

    if (card.combinedCards.length) {
      this.retroCard.combinedCards.push(...card.combinedCards);
    }
  }

  public addVote(voteId: TEntityID) {
    this.retroCard.votes.push(voteId);
    this.retroCard.markModified('votes');
  }

  public getCountVotesByUserId(userId: TEntityID) {
    const countVotes = this.retroCard.votes.filter(
      (voteIdLocal) => isEqualsId(voteIdLocal, userId)
    );
    return countVotes.length;
  }

  public removeVote(voteId: TEntityID) {
    const findId = this.retroCard.votes.indexOf(voteId.toString());

    if (findId !== -1) {
      this.retroCard.votes.splice(findId, 1);
      this.retroCard.markModified('votes');
    }
  }
}

/**
 * Applies mutation to card and saves it; on concurrent change (votes of other participants, edits)
 * reloads the card and applies mutation again, so validations (e.g. max votes) use the actual state.
 */
const updateRetroCard = (
  retroCard: TRetroCardDocument,
  mutate: (retroCard: TRetroCardDocument, service: RetroCardService) => Promise<void> | void
): Promise<TRetroCardDocument> => saveWithRetry(
  retroCard,
  (doc) => mutate(doc, new RetroCardService(doc)),
  {
    notFoundError: () => new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        message: transServer.t('errors.retroCard.notFound'),
        path: ['params', 'retroCardId'],
      },
    ]),
  }
);

export {
  RetroCardService,
  updateRetroCard,
};
