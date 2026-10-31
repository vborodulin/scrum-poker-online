import { uiActions } from '@Redux/domains/ui/actions';

export namespace uiTypes {
  export enum MODAL_TYPES {
    TEAM_CREATE = 'teamCreate',
    TEAM_EDIT = 'teamEdit',
    TEAM_VIEW = 'teamView',
    TEAM_REMOVE = 'teamRemove',
    PARTICIPANT_INVITE = 'participantInvite',
    SPACE_CREATE = 'spaceCreate',
    SPACE_EDIT = 'spaceEdit',
    SPACE_CONFIRM_LEAVE = 'SpaceConfirmLeave',
    USER_EDIT = 'userEdit',
    USER_REMOVE = 'userRemove',
    POKER_SESSION_CREATE = 'pokerSessionCreate',

    POKER_CARD_DECKS_CREATE = 'pokerCardDecksCreate',
    POKER_CARD_DECKS_EDIT = 'pokerCardDecksEdit',
    POKER_CARD_DECK_REMOVE = 'pokerCardDeckRemove',

    POKER_SESSION_FEEDBACK = 'pokerSessionFeedBack',

    POKER_SESSION_EDIT = 'pokerSessionEdit',
    POKER_SESSION_TEAMS_EDIT = 'pokerSessionTeamsEdit',
    POKER_SESSION_TEAMS_VIEW = 'pokerSessionTeamsView',
    POKER_SESSION_REMOVE = 'pokerSessionRemove',
    STORIES_ADD = 'storiesAdd',
    POKER_SESSION_STORY_EDIT = 'pokerSessionStoryEdit',
    POKER_SESSION_STORY_REMOVE = 'pokerSessionStoryRemove',
    POKER_SESSION_STORIES_LIST = 'pokerSessionStoriesList',
    POKER_SESSION_STORIES_ADD = 'pokerSessionStoriesAdd',
    POKER_SESSION_RATING = 'pokerSessionRating',
    POKER_SESSION_CHOOSE_CARDS = 'pokerSessionChooseCards',
    POKER_STORY_REVEAL_CONFIRM = 'pokerStoryRevealConfirm',
    KANBAN_BOARD_CREATE = 'kanbanBoardCreate',
    KANBAN_BOARD_EDIT = 'kanbanBoardEdit',
    KANBAN_BOARD_REMOVE = 'kanbanBoardRemove',
    POKER_SESSION_INVITE = 'pokerSessionInvite',
    KANBAN_COLUMN_ADD = 'kanbanColumnAdd',
    KANBAN_COLUMN_EDIT = 'kanbanColumnEdit',
    KANBAN_COLUMN_REMOVE = 'kanbanColumnRemove',
    KANBAN_TASK_EDIT = 'kanbanTaskEdit',
    KANBAN_TASK_REMOVE = 'kanbanTaskRemove',
    SUBSCRIPTION_PROBLEM_MODAL = 'subscriptionProblem',
    SUBSCRIPTION_CANCEL = 'subscriptionCancel',
    PRICING_PLAN_UPGRADE = 'pricingPlanUpgrade',
    PRICING_PLAN_DOWNGRADE = 'pricingPlanDownGrade',
    RETRO_SESSION_CREATE = 'retroSessionCreate',
    RETRO_SESSION_EDIT_TEAMS = 'retroSessionEditTeams',
    RETRO_SESSION_EDIT = 'retroSessionEdit',
    RETRO_SESSION_REMOVE = 'retroSessionRemove',
    RETRO_COLUMN_ADD = 'retroColumnAdd',
    RETRO_COLUMN_EDIT = 'retroColumnEdit',
    RETRO_COLUMN_REMOVE = 'retroColumnRemove',
    RETRO_CARD_EDIT = 'retroCardEdit',
    RETRO_CARD_REMOVE = 'retroCardRemove',
    RETRO_SESSION_RESET_VOTES_CARDS = 'retroSessionResetVotesCards',
    RETRO_SESSION_COLUMN_ACTIONS = 'retroSessionColumnActions',
    RETRO_CARD_COMBINED_EDIT_CARD = 'retroCardCombinedEdit',
    RETRO_SESSION_SETTINGS = 'retroSessionSettings',
    RETRO_SESSION_PEOPLE = 'retroSessionPeople',
  }
  export type TModalParams = Record<string, any>;

  export type TActionsUnion =
    | ReturnType<typeof uiActions.modalOpen>
    | ReturnType<typeof uiActions.modalHide>
    | ReturnType<typeof uiActions.modalUpdateParams>
    | ReturnType<typeof uiActions.modalPreventCloseSet>
    | ReturnType<typeof uiActions.popperOpen>
    | ReturnType<typeof uiActions.popperHide>
    | ReturnType<typeof uiActions.popperHideAll>
    | ReturnType<typeof uiActions.popperToggle>
    | ReturnType<typeof uiActions.onboardingSet>
    | ReturnType<typeof uiActions.isDocumentHiddenSet>
    | ReturnType<typeof uiActions.sideBarOpen>
    | ReturnType<typeof uiActions.sideBarClose>
    | ReturnType<typeof uiActions.spaceSideBarClose>
    | ReturnType<typeof uiActions.spaceSideBarToggle>
}
