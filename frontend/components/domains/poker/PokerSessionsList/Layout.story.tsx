import { TPokerSession } from '@chpokify/models-types/pokerSession';
import base from 'paths.macro';
import React from 'react';

import { getStoryName } from '@lib/getStoryName';

import { Layout } from './Layout';

export default {
  title: getStoryName(base),
};

const pokerSessions: TPokerSession[] = [
  {
    _id: '1',
    spaceId: '1',
    title: 'RnD Team Estimation 8.12',
    teamsIds: [],
    usersIds: [],
    storiesIds: [],
    results: {},
    active: null,
    isAutoReveal: false,
    cardSetId: 'ObjectId',

  },
  {
    _id: '2',
    spaceId: '1',
    title: 'Product Team Estimation, Sprint 8.12',
    teamsIds: [],
    usersIds: [],
    storiesIds: [],
    results: {},
    active: null,
    isAutoReveal: false,
    cardSetId: 'ObjectId',
  },
  {
    _id: '3',
    spaceId: '1',
    title: 'Product Team Estimation, Sprint 8.11',
    teamsIds: [],
    usersIds: [],
    storiesIds: [],
    results: {},
    active: null,
    isAutoReveal: false,
    cardSetId: 'ObjectId',
  },
];

export const Default = () => (
  <Layout
    pokerSessions={pokerSessions}
  />
);

export const Empty = () => (
  <Layout
    pokerSessions={[]}
  />
);
