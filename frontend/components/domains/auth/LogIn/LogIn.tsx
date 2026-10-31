import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { authActionsTypes } from '@Redux/domains/auth/actionsTypes';
import { authAsyncActions } from '@Redux/domains/auth/asyncActions';
import { spacesSelectors } from '@Redux/domains/spaces/selectors';
import { useAppDispatch } from '@Redux/hooks';

import { useAsyncActionInfo } from '@components/utils/hooks/useAsyncActionInfo';

import { Layout, TFormData } from './Layout';

const LogIn = (): React.ReactElement | null => {
  const dispatch = useAppDispatch();

  const invite = useSelector(spacesSelectors.getInvite);
  const inviteToken = invite?.token;
  const inviteEmail = invite?.payload.email;

  const {
    register,
    handleSubmit,
    errors,
    setError,
    formState,
  } = useForm<TFormData>();

  const { errGlobalMsg } = useAsyncActionInfo(
    [authActionsTypes.LOG_IN_PENDING],
    [
      'email',
      'password',
    ],
    setError
  );

  const onSubmit = useCallback(async (data: TFormData) => {
    if (!formState.dirty) {
      return;
    }

    await dispatch(authAsyncActions.logIn({
      ...data,
      inviteSpaceToken: inviteToken,
    }));
  }, [
    formState.dirty,
    dispatch,
    inviteToken,
  ]);

  const defaultValues = useMemo(() => ({
    email: inviteEmail,
  }), [
    inviteEmail,
  ]);

  const formRefs = useMemo(() => ({
    email: register,
    password: register,
  }), [
    register,
  ]);

  return (
    <Layout
      formRefs={formRefs}
      defaultValues={defaultValues}
      isEmailDisabled={!!invite?.payload.email}
      invitePayload={invite?.payload}
      errors={errors}
      errGlobalMsg={errGlobalMsg}
      hasChanges={formState.dirty}
      isLoading={formState.isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};

export {
  LogIn,
};
