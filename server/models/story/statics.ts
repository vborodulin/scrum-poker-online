import { arrayHelpers } from '@chpokify/helpers';
import { TStory, TEntityID } from '@chpokify/models-types';
import mongoose from 'mongoose';

import { TStoryModel } from '@models/story';

/**
 * static
 */
function createNew(
  this: TStoryModel,
  spaceId: TEntityID,
  other: Partial<TStory>
) {
  return new this({
    ...other,
    _id: new mongoose.Types.ObjectId(),
    spaceId,
  });
}

async function getNextId(this: TStoryModel, spaceId: TEntityID) {
  const findStory = await this.find({ spaceId }, ['id'])
    .sort({ id: -1 })
    .limit(1) as TStory[];

  if (!arrayHelpers.isEmptyArr(findStory)) {
    const [story] = findStory;
    return Number(story.id) + 1;
  }

  return 1;
}

const storySchemaStatics = {
  getNextId,
  createNew,
};

export {
  storySchemaStatics,
};
