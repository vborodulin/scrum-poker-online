import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { uiActions } from '@Redux/domains/ui/actions';
import { uiSelectors } from '@Redux/domains/ui/selectors';
import { uiTypes } from '@Redux/domains/ui/types';

import { KanbanBoardCreateModal } from '@components/domains/kanban/KanbanBoardCreateModal';
import { KanbanBoardEditModal } from '@components/domains/kanban/KanbanBoardEditModal';
import { KanbanBoardRemoveModal } from '@components/domains/kanban/KanbanBoardRemoveModal';
import { KanbanColumnAddModal } from '@components/domains/kanban/KanbanColumnAddModal';
import { KanbanColumnEditModal } from '@components/domains/kanban/KanbanColumnEditModal';
import { KanbanColumnRemoveModal } from '@components/domains/kanban/KanbanColumnRemoveModal';
import { KanbanTaskEditModal } from '@components/domains/kanban/KanbanTaskEditModal';
import { KanbanTaskRemoveModal } from '@components/domains/kanban/KanbanTaskRemoveModal';
import { PokerChooseCardsModal } from '@components/domains/poker/PokerChooseCardModal';
import {
  StoryRevealConfirmModal,
} from '@components/domains/poker/PokerSession/PokerSessionStory/StoryRevealConfirmModal';
import { PokerSessionCreateModal } from '@components/domains/poker/PokerSessionCreateModal';
import { PokerSessionEditModal } from '@components/domains/poker/PokerSessionEditModal';
import { PokerSessionFeedBackModal } from '@components/domains/poker/PokerSessionFeedBackModal';
import { PokerSessionInviteModal } from '@components/domains/poker/PokerSessionInviteModal';
import { PokerSessionRating } from '@components/domains/poker/PokerSessionRating';
import { PokerSessionRemoveModal } from '@components/domains/poker/PokerSessionRemoveModal';
import { PokerSessionStoriesAddModal } from '@components/domains/poker/PokerSessionStoriesAddModal';
import { PokerStoriesLisModal } from '@components/domains/poker/PokerSessionStoriesListModal';
import { PokerSessionStoryEdiModal } from '@components/domains/poker/PokerSessionStoryEditModal';
import { PokerSessionStoryRemoveModal } from '@components/domains/poker/PokerSessionStoryRemoveModal';
import { PokerSessionTeamsEditModal } from '@components/domains/poker/PokerSessionTeamsEditModal';
import {
  RetroSessionCardCombinedEditModal,
} from '@components/domains/retro/RetroSession/RetroSessionCardCombinedEditModal';
import { RetroCardEditModal } from '@components/domains/retro/RetroSession/RetroSessionCardEditModal';
import { RetroCardRemoveModal } from '@components/domains/retro/RetroSession/RetroSessionCardRemoveModal';
import { RetroSessionColumnActionsModal } from '@components/domains/retro/RetroSession/RetroSessionColumnActionsModal';
import { RetroSessionColumnAddModal } from '@components/domains/retro/RetroSession/RetroSessionColumnAddModal';
import { RetroColumnEditModal } from '@components/domains/retro/RetroSession/RetroSessionColumnEditModal';
import { RetroColumnRemoveModal } from '@components/domains/retro/RetroSession/RetroSessionColumnRemoveModal';
import { RetroSessionPeopleModal } from '@components/domains/retro/RetroSession/RetroSessionPeopleModal';
import { RetroSessionSettingsModal } from '@components/domains/retro/RetroSession/RetroSessionSettingsModal';
import { RetroSessionCreateModal } from '@components/domains/retro/RetroSessionCreateModal';
import { RetroSessionEditModal } from '@components/domains/retro/RetroSessionEditModal';
import { RetroSessionRemoveModal } from '@components/domains/retro/RetroSessionRemoveModal';
import { RetroSessionResetVotesCardsModal } from '@components/domains/retro/RetroSessionResetVotesCardsModal';
import { RetroSessionTeamsEditModal } from '@components/domains/retro/RetroSessionTeamsEditModal';
import { UserEditModal } from '@components/domains/space/ParticipantEditModal';
import { UserRemoveModal } from '@components/domains/space/ParticipantRemoveModal';
import { PokerCardDecksCreateModal } from '@components/domains/space/PokerCardDecksCreateModal';
import { PokerCardDecksEditModal } from '@components/domains/space/PokerCardDecksEditModal';
import { PokerCardDecksRemoveModal } from '@components/domains/space/PokerCardDecksRemoveModal';
import { SpaceCreateModal } from '@components/domains/space/SpaceCreateModal';
import { SpaceEditModal } from '@components/domains/space/SpaceEditModal';
import { SpaceInviteModal } from '@components/domains/space/SpaceInvieModal';
import { SpaceLeaveConfirmModal } from '@components/domains/space/SpaceLeaveConfirmModal';
import { CreateTeamModal } from '@components/domains/space/TeamCreateModal';
import { TeamEditModal } from '@components/domains/space/TeamEditModal';
import { TeamRemoveModal } from '@components/domains/space/TeamRemoveModal';
import { TeamViewModal } from '@components/domains/space/TeamViewModal';
import { StoriesAddModal } from '@components/domains/stories/StoriesAddModal';

import { ModalContainer } from '@components/uiKit/ModalContainer';

const { MODAL_TYPES } = uiTypes;

const MODAL_TYPES_TO_COMPONENT: Record<string, React.FunctionComponent<any>> = {
  [MODAL_TYPES.TEAM_CREATE]: CreateTeamModal,
  [MODAL_TYPES.TEAM_EDIT]: TeamEditModal,
  [MODAL_TYPES.TEAM_VIEW]: TeamViewModal,
  [MODAL_TYPES.TEAM_REMOVE]: TeamRemoveModal,
  [MODAL_TYPES.PARTICIPANT_INVITE]: SpaceInviteModal,
  [MODAL_TYPES.SPACE_CREATE]: SpaceCreateModal,
  [MODAL_TYPES.POKER_CARD_DECKS_CREATE]: PokerCardDecksCreateModal,
  [MODAL_TYPES.POKER_CARD_DECKS_EDIT]: PokerCardDecksEditModal,
  [MODAL_TYPES.SPACE_CONFIRM_LEAVE]: SpaceLeaveConfirmModal,
  [MODAL_TYPES.SPACE_EDIT]: SpaceEditModal,
  [MODAL_TYPES.USER_EDIT]: UserEditModal,
  [MODAL_TYPES.USER_REMOVE]: UserRemoveModal,
  [MODAL_TYPES.STORIES_ADD]: StoriesAddModal,
  [MODAL_TYPES.POKER_SESSION_CREATE]: PokerSessionCreateModal,
  [MODAL_TYPES.POKER_SESSION_FEEDBACK]: PokerSessionFeedBackModal,
  [MODAL_TYPES.POKER_SESSION_EDIT]: PokerSessionEditModal,
  [MODAL_TYPES.POKER_SESSION_REMOVE]: PokerSessionRemoveModal,
  [MODAL_TYPES.POKER_CARD_DECK_REMOVE]: PokerCardDecksRemoveModal,
  [MODAL_TYPES.POKER_SESSION_TEAMS_EDIT]: PokerSessionTeamsEditModal,
  [MODAL_TYPES.POKER_SESSION_STORY_EDIT]: PokerSessionStoryEdiModal,
  [MODAL_TYPES.POKER_SESSION_STORY_REMOVE]: PokerSessionStoryRemoveModal,
  [MODAL_TYPES.POKER_SESSION_STORIES_LIST]: PokerStoriesLisModal,
  [MODAL_TYPES.POKER_SESSION_STORIES_ADD]: PokerSessionStoriesAddModal,
  [MODAL_TYPES.POKER_SESSION_RATING]: PokerSessionRating,
  [MODAL_TYPES.POKER_SESSION_CHOOSE_CARDS]: PokerChooseCardsModal,
  [MODAL_TYPES.POKER_STORY_REVEAL_CONFIRM]: StoryRevealConfirmModal,
  [MODAL_TYPES.KANBAN_BOARD_CREATE]: KanbanBoardCreateModal,
  [MODAL_TYPES.KANBAN_BOARD_EDIT]: KanbanBoardEditModal,
  [MODAL_TYPES.KANBAN_BOARD_REMOVE]: KanbanBoardRemoveModal,
  [MODAL_TYPES.POKER_SESSION_INVITE]: PokerSessionInviteModal,
  [MODAL_TYPES.KANBAN_COLUMN_ADD]: KanbanColumnAddModal,
  [MODAL_TYPES.KANBAN_COLUMN_EDIT]: KanbanColumnEditModal,
  [MODAL_TYPES.KANBAN_COLUMN_REMOVE]: KanbanColumnRemoveModal,
  [MODAL_TYPES.KANBAN_TASK_EDIT]: KanbanTaskEditModal,
  [MODAL_TYPES.KANBAN_TASK_REMOVE]: KanbanTaskRemoveModal,
  [MODAL_TYPES.RETRO_SESSION_CREATE]: RetroSessionCreateModal,
  [MODAL_TYPES.RETRO_SESSION_EDIT_TEAMS]: RetroSessionTeamsEditModal,
  [MODAL_TYPES.RETRO_SESSION_EDIT]: RetroSessionEditModal,
  [MODAL_TYPES.RETRO_SESSION_REMOVE]: RetroSessionRemoveModal,
  [MODAL_TYPES.RETRO_COLUMN_ADD]: RetroSessionColumnAddModal,
  [MODAL_TYPES.RETRO_COLUMN_EDIT]: RetroColumnEditModal,
  [MODAL_TYPES.RETRO_COLUMN_REMOVE]: RetroColumnRemoveModal,
  [MODAL_TYPES.RETRO_CARD_EDIT]: RetroCardEditModal,
  [MODAL_TYPES.RETRO_CARD_REMOVE]: RetroCardRemoveModal,
  [MODAL_TYPES.RETRO_SESSION_RESET_VOTES_CARDS]: RetroSessionResetVotesCardsModal,
  [MODAL_TYPES.RETRO_SESSION_COLUMN_ACTIONS]: RetroSessionColumnActionsModal,
  [MODAL_TYPES.RETRO_CARD_COMBINED_EDIT_CARD]: RetroSessionCardCombinedEditModal,
  [MODAL_TYPES.RETRO_SESSION_SETTINGS]: RetroSessionSettingsModal,
  [MODAL_TYPES.RETRO_SESSION_PEOPLE]: RetroSessionPeopleModal,
};

const ModalProcessor: React.FunctionComponent<{}> = () => {
  const dispatch = useDispatch();

  const modal = useSelector(uiSelectors.getModal);
  const preventClose = useSelector(uiSelectors.getPreventCloseModal);

  const handleClose = () => {
    dispatch(uiActions.modalHide());
  };

  const renderModalContent = () => {
    if (!modal) {
      return null;
    }

    const Component = MODAL_TYPES_TO_COMPONENT[modal.type];

    return (
      <Component
        onClose={handleClose}
        {...modal.params}
      />
    );
  };

  return (
    <ModalContainer
      isOpen={Boolean(modal)}
      preventClose={preventClose}
    >
      {renderModalContent()}
    </ModalContainer>
  );
};

export {
  ModalProcessor,
};
