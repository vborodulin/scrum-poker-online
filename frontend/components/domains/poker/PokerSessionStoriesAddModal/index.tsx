import { TStory } from '@chpokify/models-types';
import { map } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';

import { pokerSessionsActions } from '@Redux/domains/pokerSessions/actions';
import { pokerSessionsAsyncActions } from '@Redux/domains/pokerSessions/asyncActions';
import { pokerSessionsSelectors } from '@Redux/domains/pokerSessions/selectors';
import { getIsRejectedActionPayload } from '@Redux/helpers/common';
import { useAppDispatch } from '@Redux/hooks';

import { StoriesAddModal } from '@components/domains/stories/StoriesAddModal';

export type TPokerSessionStoriesAddModalProps = {
  onClose: () => void;
}

const PokerSessionStoriesAddModal = (props: TPokerSessionStoriesAddModalProps): React.ReactElement | null => {
  const {
    ...other
  } = props;
  const dispatch = useAppDispatch();
  const pokerSessionId = useSelector(pokerSessionsSelectors.getCurrId);

  const handleAddStoriesToPokerSession = async (data: { stories: TStory[] }) => {
    const res = await dispatch(pokerSessionsAsyncActions.storyAddMany(
      pokerSessionId,
      {
        storiesIds: map(data.stories, '_id'),
      }
    ));

    if (!getIsRejectedActionPayload(res.payload)) {
      if (data.stories.length) {
        dispatch(pokerSessionsActions.storySelect(data.stories[0]._id));
      }
    }
  };

  return (
    <StoriesAddModal
      onAfterSubmit={handleAddStoriesToPokerSession}
      {...other}
    />
  );
};

export {
  PokerSessionStoriesAddModal,
};
