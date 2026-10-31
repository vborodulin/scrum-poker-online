import { combineReducers } from '@reduxjs/toolkit';

import { asyncInfoReducer } from '@Redux/domains/asyncInfo/reducers';
import { authReducer } from '@Redux/domains/auth/reducers';
import { configReducer } from '@Redux/domains/config/reducers';
import { kanbanBoardRelationsReducer } from '@Redux/domains/kanbanBoardRelations/reducers';
import { kanbanBoardsReducer } from '@Redux/domains/kanbanBoards/reducers';
import { persistReducer } from '@Redux/domains/persist/reducers';
import { pokerCardDecksReducer } from '@Redux/domains/pokerCardDecks/reducers';
import { pokerSessionsReducer } from '@Redux/domains/pokerSessions/reducers';
import { retroSessionsReducer } from '@Redux/domains/retroSessions/reducers';
import { retroSessionsCardsReducer } from '@Redux/domains/retroSessionsCards/reducers';
import { retroSessionsRelationsReducer } from '@Redux/domains/retroSessionsRelations/reducers';
import { retroTemplatesReducer } from '@Redux/domains/retroTemplates/reducers';
import { spacesReducer } from '@Redux/domains/spaces/reducers';
import { storiesReducer } from '@Redux/domains/stories/reducers';
import { systemReducer } from '@Redux/domains/system/reducers';
import { uiReducer } from '@Redux/domains/ui/reducers';
import { usersReducer } from '@Redux/domains/users/reducers';

const rootReducer = combineReducers({
  asyncInfo: asyncInfoReducer,
  auth: authReducer,
  pokerSessions: pokerSessionsReducer,
  retroSessions: retroSessionsReducer,
  retroTemplates: retroTemplatesReducer,
  retroSessionsRelations: retroSessionsRelationsReducer,
  retroSessionsCards: retroSessionsCardsReducer,
  spaces: spacesReducer,
  system: systemReducer,
  stories: storiesReducer,
  ui: uiReducer,
  users: usersReducer,
  config: configReducer,
  persist: persistReducer,
  pokerCardDecks: pokerCardDecksReducer,
  kanbanBoards: kanbanBoardsReducer,
  kanbanBoardRelations: kanbanBoardRelationsReducer,
});

export { rootReducer };
