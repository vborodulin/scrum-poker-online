import base from 'paths.macro';
import React from 'react';

import { getStoryName } from '@lib/getStoryName';

import { Layout } from './Layout';

export default {
  title: getStoryName(base),
};

export const Default = () => (
  <Layout
    formRefs={{
      title: null,
      description: null,
    }}
    defaultValue={{
      title: 'Estimation Big Boobs Sprint',
    }}
    errors={{}}
    errGlobalMsg=""
    isLoading={false}
    onCancel={() => {}}
    onSubmit={() => {}}
  />
);

export const EmptyTeams = () => (
  <Layout
    formRefs={{
      title: null,
      description: null,
    }}
    defaultValue={{
      title: 'Estimation Big Boobs Sprint',
    }}
    errors={{}}
    errGlobalMsg=""
    isLoading={false}
    onCancel={() => {}}
    onSubmit={() => {}}
  />
);
