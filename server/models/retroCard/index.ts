import {
  RETRO_CARD_TITLE_MIN_LENGTH,
  RETRO_CARD_TITLE_MAX_LENGTH,
  RETRO_CARD_DESCRIPTION_MAX_LENGTH,
} from '@chpokify/models-types';
import { io } from '@socket';
import mongoose from 'mongoose';

import { softDeletePlugin } from '@core/lib/db/plugins';

import { retroCardSchemaStatic } from '@models/retroCard/static';
import { TRetroCardModel, TRetroCardDocument } from '@models/retroCard/types';

const RetroCardSchema = new mongoose.Schema<TRetroCardDocument>({
  title: {
    type: mongoose.Schema.Types.String,
    minlength: RETRO_CARD_TITLE_MIN_LENGTH,
    maxlength: RETRO_CARD_TITLE_MAX_LENGTH,
  },
  description: {
    type: mongoose.Schema.Types.String,
    maxlength: RETRO_CARD_DESCRIPTION_MAX_LENGTH,
  },
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spacer',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isCompleted: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
  ],
  combinedCards: [
    {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
  ],
},
{
  timestamps: true,
  strict: true,
  strictQuery: true,
  minimize: false,
  // concurrent saves (votes, edits and combining) must not overwrite each other:
  // save fails with VersionError and is retried in saveWithRetry
  optimisticConcurrency: true,
});

/**
 * Indexes
 */
RetroCardSchema.index({
  _id: 1,
  spaceId: 1,
  isDeleted: 1,
});

RetroCardSchema.index({
  spaceId: 1,
  isDeleted: 1,
});

/**
 * Soft delete
 */
RetroCardSchema.plugin(softDeletePlugin);

/**
 * Statics
 */
RetroCardSchema.statics = retroCardSchemaStatic;

// Socket update

RetroCardSchema.pre('save', async function () {
  this.$locals.wasModified = this.isModified();
});

RetroCardSchema.post<TRetroCardDocument>('save', async function (this: TRetroCardDocument) {
  if (!this.$locals.wasModified) {
    return;
  }

  const roomId = `retroSessionCard:${this.spaceId.toString()}`;
  const eventName = roomId;

  io.to(roomId)
    .emit(eventName, {
      retroSessionCard: this,
    });
});

const RetroCardModel = mongoose.model<TRetroCardDocument, TRetroCardModel>(
  'RetroCard',
  RetroCardSchema
);

export type {
  TRetroCardDocument,
  TRetroCardModel,
};

export { RetroCardModel };
