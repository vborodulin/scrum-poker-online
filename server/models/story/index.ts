import {
  STORY_DESCRIPTION_MAX_LENGTH,
  STORY_TITLE_MAX_LENGTH,
  TStory,
} from '@chpokify/models-types';
import { io } from '@socket';
import mongoose from 'mongoose';

import { storySchemaStatics } from './statics';

/**
 * mongoose types
 */

type TStoryDocumentMethods = {};

type TStoryDocumentStatic = typeof storySchemaStatics;

type TStoryDocument =
  mongoose.Document &
  TStory &
  TStoryDocumentMethods;

type TStoryModel =
  mongoose.Model<TStoryDocument> &
  TStoryDocumentStatic;

/*
 * schemas
 */

const StorySchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.Number,
    index: true,
    required: true,
  },
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
  },
  title: {
    type: mongoose.Schema.Types.String,
    maxlength: STORY_TITLE_MAX_LENGTH,
    required: true,
  },
  description: {
    type: mongoose.Schema.Types.String,
    maxlength: STORY_DESCRIPTION_MAX_LENGTH,
  },
}, {
  timestamps: true,
  strict: true,
  strictQuery: true,
  minimize: false,
});

/**
 * indexes
 *
 */
StorySchema.index({
  kanbanBoardId: 1,
});

StorySchema.index({
  spaceId: 1,
  withDeleted: 1,
});

StorySchema.index({
  spaceId: 1,
  isDeleted: 1,
});

StorySchema.index({
  spaceId: 1,
  isDeleted: 1,
  id: -1,
});

StorySchema.index({
  spaceId: 1,
  isDeleted: 1,
  updatedAt: 1,
});

StorySchema.index({
  _id: 1,
  isDeleted: 1,
});

StorySchema.index({
  _id: 1,
  spaceId: 1,
});

StorySchema.index({
  spaceId: 1,
  isDeleted: 1,
  id: -1,
});

StorySchema.index({
  spaceId: 1,
  id: 1,
});

/**
 * statics
 */
StorySchema.statics = storySchemaStatics;

/**
 * middleware
 */

StorySchema.pre('save', async function () {
  this.$locals.wasModified = this.isModified();
});

/**
 * socket update
 */

StorySchema.post<TStoryDocument>('save', async function (this: TStoryDocument) {
  if (!this.$locals.wasModified) {
    return;
  }

  const roomId = `storySpace:${this.spaceId.toString()}`;
  const eventName = roomId;

  io.to(roomId)
    .emit(eventName, {
      story: this,
    });
});

const StoryModel = mongoose.model<TStoryDocument, TStoryModel>('Story', StorySchema);

export {
  StoryModel,
};

export type {
  TStoryDocument,
  TStoryModel,
};
