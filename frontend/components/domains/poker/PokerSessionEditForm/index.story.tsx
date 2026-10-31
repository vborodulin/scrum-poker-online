import base from 'paths.macro';
import React from 'react';

import { getStoryName } from '@lib/getStoryName';

import { PokerSessionEditForm } from './index';

export default {
  title: getStoryName(base),
};

export const Default = () => (
  // @ts-ignore
  <PokerSessionEditForm
    formId="PokerSessionEditForm"
    formRefs={{
      title: null,
      description: null,
      isAutoReveal: null,
      cardSetId: null,
    }}
    defaultValue={{
      title: 'Estimation Big Boobs Sprint',
      cardSetId: 'ObjectId',
    }}
    cardSetId="ObjectId"
    errors={{}}
    errGlobalMsg=""
    isLoading={false}
    onSubmit={() => {
    }}
  />
);

export const Loading = () => (
  // @ts-ignore
  <PokerSessionEditForm
    formId="PokerSessionEditForm"
    formRefs={{
      title: null,
      description: null,
      isAutoReveal: null,
      cardSetId: null,
    }}
    defaultValue={{}}
    errors={{}}
    errGlobalMsg=""
    isLoading
    onSubmit={() => {
    }}
  />
);

export const ErrorField = () => (
  // @ts-ignore
  <PokerSessionEditForm
    formId="PokerSessionEditForm"
    formRefs={{
      title: null,
      description: null,
      isAutoReveal: null,
      cardSetId: null,
    }}
    defaultValue={{
      title: 'Estimation Big Boobs Sprint',
      cardSetId: 'ObjectId',
    }}
    cardSetId="ObjectId"
    errors={{
      title: {
        message: 'Invalid title',
        type: 'serverError',
      },
    }}
    errGlobalMsg=""
    isLoading={false}
    onSubmit={() => {
    }}
  />
);

export const ErrorGlobal = () => (
  // @ts-ignore
  <PokerSessionEditForm
    formId="PokerSessionEditForm"
    formRefs={{
      title: null,
      description: null,
      isAutoReveal: null,
      cardSetId: null,
    }}
    defaultValue={{
      title: 'Estimation Big Boobs Sprint',
      cardSetId: 'ObjectId',
    }}
    cardSetId="ObjectId"
    errors={{}}
    errGlobalMsg="Internal server error"
    isLoading={false}
    onSubmit={() => {
    }}
  />
);

export const EmptyTeams = () => (
  // @ts-ignore
  <PokerSessionEditForm
    formId="PokerSessionEditForm"
    formRefs={{
      title: null,
      description: null,
      isAutoReveal: null,
      cardSetId: null,
    }}
    defaultValue={{
      title: 'Estimation Big Boobs Sprint',
      cardSetId: 'ObjectId',
    }}
    cardSetId="ObjectId"
    errors={{}}
    errGlobalMsg=""
    isLoading={false}
    onSubmit={() => {
    }}
  />
);

export const Edit = () => (
  // @ts-ignore
  <PokerSessionEditForm
    formId="PokerSessionEditForm"
    formRefs={{
      title: null,
      description: null,
      isAutoReveal: null,
      cardSetId: null,
    }}
    defaultValue={{
      title: 'Estimation Big Boobs Sprint',
      cardSetId: 'ObjectId',
    }}
    cardSetId="ObjectId"
    errors={{}}
    errGlobalMsg=""
    isLoading={false}
    onSubmit={() => {
    }}
  />
);
