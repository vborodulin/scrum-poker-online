import {
  TLogInGuest,
  INVITE_USER_TO,
  TInviteRetroSessionTokenPayload,
  TInvitePokerSessionTokenPayload,
} from '@chpokify/models-types';
import React from 'react';
import { useForm } from 'react-hook-form';

import { authActionsTypes } from '@Redux/domains/auth/actionsTypes';
import { authAsyncActions } from '@Redux/domains/auth/asyncActions';
import { useAppDispatch } from '@Redux/hooks';

import { Layout, TFormData } from '@components/domains/auth/LogInGuest/Layout';

import { TFlexProps } from '@components/uiKit/Flex';

import { useAsyncActionInfo } from '@components/utils/hooks/useAsyncActionInfo';

type TLogInGuestProps = TFlexProps & {
  inviteTokenPayload: TInviteRetroSessionTokenPayload | TInvitePokerSessionTokenPayload | undefined;
  inviteToken: string | undefined,
  inviteUserTo: INVITE_USER_TO
};

const LogInGuest = (props: TLogInGuestProps): React.ReactElement | null => {
  const {
    inviteToken,
    inviteTokenPayload,
    inviteUserTo,
    ...other
  } = props;

  const dispatch = useAppDispatch();

  const teamsOptions = inviteTokenPayload?.teams.map((item) => ({
    label: item.name,
    value: item._id.toString(),
  })) as [];

  const {
    register,
    handleSubmit,
    errors,
    setError,
    watch,
    formState: {
      isSubmitting,
    },
  } = useForm<TFormData>();

  const { errGlobalMsg } = useAsyncActionInfo(
    [authActionsTypes.LOG_IN_GUEST_PENDING],
    [
      'username',
      'teamId',
    ],
    setError
  );

  const watchUsername = watch('username');

  // with one team in the invite link the team select is not shown: server picks the team
  const enhanceData = (data: TFormData, token: string): TLogInGuest => ({
    username: data.username,
    teamId: data.teamId || undefined,
    inviteToken: token,
    inviteTo: inviteUserTo,
  });

  const onSubmit = async (data: TFormData) => {
    if (!watchUsername || !inviteToken) {
      return;
    }

    const sendData = enhanceData(data, inviteToken);
    await dispatch(authAsyncActions.logInGuest(sendData));
  };

  if (!inviteTokenPayload) {
    return null;
  }

  return (
    <Layout
      formRefs={{
        username: register,
        teamId: register,
      }}
      errors={errors}
      errGlobalMsg={errGlobalMsg}
      hasChanges={!!watchUsername?.trim()}
      isLoading={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      teamsOptions={teamsOptions}
      {...other}
    />
  );
};

export {
  LogInGuest,
};
