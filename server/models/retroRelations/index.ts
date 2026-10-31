import { io } from '@socket';
import mongoose from 'mongoose';

import { softDeletePlugin } from '@core/lib/db/plugins';

import { retroRelationsSchemaStatic } from '@models/retroRelations/static';
import { TRetroRelationsModel, TRetroRelationsDocument } from '@models/retroRelations/types';
import { RetroSessionModel } from '@models/retroSession';

const RetroRelationsSchema = new mongoose.Schema<TRetroRelationsDocument>({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RetroTemplate',
    required: true,
  },
  columnId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cardsIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
},
{
  timestamps: true,
  strict: true,
  strictQuery: true,
  minimize: false,
  // concurrent saves (adding, moving and removing cards in a column) must not overwrite each other:
  // save fails with VersionError and is retried in saveWithRetry
  optimisticConcurrency: true,
});

/**
 * Indexes
 */
RetroRelationsSchema.index({
  templateId: 1,
  isDeleted: 1,
});

/**
 * Indexes
 */
RetroRelationsSchema.index({
  templateId: 1,
  columnId: 1,
  isDeleted: 1,
});

/**
 * Soft delete
 */
RetroRelationsSchema.plugin(softDeletePlugin);

/**
 * Statics
 */
RetroRelationsSchema.statics = retroRelationsSchemaStatic;

// Socket update

RetroRelationsSchema.pre('save', async function () {
  this.$locals.wasModified = this.isModified();
});

RetroRelationsSchema.post<TRetroRelationsDocument>('save', async function (this: TRetroRelationsDocument) {
  if (!this.$locals.wasModified) {
    return;
  }

  const retroSession = await RetroSessionModel.findOne({
    templateId: this.templateId,
  }, ['spaceId']);

  if (!retroSession) {
    return;
  }

  const roomId = `retroSessionRelations:${retroSession.spaceId.toString()}`;
  const eventName = roomId;

  io.to(roomId)
    .emit(eventName, {
      retroSessionRelations: this,
    });
});

const RetroRelationsModel = mongoose.model<TRetroRelationsDocument, TRetroRelationsModel>(
  'RetroRelations',
  RetroRelationsSchema
);

export type {
  TRetroRelationsDocument,
  TRetroRelationsModel,
};

export { RetroRelationsModel };
