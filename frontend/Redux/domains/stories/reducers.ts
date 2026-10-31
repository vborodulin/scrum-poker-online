import { arrayHelpers } from '@chpokify/helpers';
import { STORY_SORT, TStory } from '@chpokify/models-types';
import { combineReducers } from '@reduxjs/toolkit';
import update from 'immutability-helper';
import { isEqual } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

import { storiesActionsTypes } from '@Redux/domains/stories/actionsTypes';
import { TAppAction } from '@Redux/types';

type TStoriesState = Record<string, TStory>;

const initialState: TStoriesState = {};

const entitiesReducer = (state = initialState, action: TAppAction): TStoriesState => {
  switch (action.type) {
    case HYDRATE: {
      const { stories } = action.payload;

      if (isEqual(stories.entities, state)) {
        return state;
      }

      return update(state, {
        $set: stories.entities,
      });
    }

    case storiesActionsTypes.GET_MANY_BY_SPACE_ID_FULFILLED: {
      const { stories } = action.payload;
      return update(state, { $set: arrayHelpers.normalizeArr(stories, '_id') });
    }

    case storiesActionsTypes.GET_MANY_FULFILLED: {
      const { stories } = action.payload;
      return update(state, { $merge: arrayHelpers.normalizeArr(stories, '_id') });
    }

    case storiesActionsTypes.CREATE_FULFILLED: {
      const { story } = action.payload;
      return update(state, {
        $merge: {
          [story._id.toString()]: story,
        },
      });
    }

    case storiesActionsTypes.CREATE_MANY_FULFILLED: {
      const { stories } = action.payload;

      return update(state, {
        $merge: arrayHelpers.normalizeArr(stories, '_id'),
      });
    }

    case storiesActionsTypes.UPSERT: {
      const { story } = action.payload;
      return update(state, { $merge: { [story._id.toString()]: story } });
    }

    default:
      return state;
  }
};

type TSortState = STORY_SORT | null;
const initialSortState: TSortState = null;

const sortReducer = (state = initialSortState, action: TAppAction): TSortState => {
  switch (action.type) {
    case storiesActionsTypes.SET_SORT:
      return action.payload.sort;
    default:
      return state;
  }
};

export const storiesReducer = combineReducers({
  entities: entitiesReducer,
  sort: sortReducer,
});
