import { TEntityID } from '@chpokify/models-types';
import React from 'react';
import { useSelector } from 'react-redux';

import { pokerSessionsSelectors } from '@Redux/domains/pokerSessions/selectors';

import { usePokerSessionCreateModal } from '@components/domains/poker/hooks';

import { Layout } from './Layout';

export type TPokerSessionEditModalProps = {
  pokerSessionId: TEntityID;
  onClose: () => void;
}

const PokerSessionEditModal = (props: TPokerSessionEditModalProps): React.ReactElement | null => {
  const {
    pokerSessionId,
    onClose,
    ...other
  } = props;

  const pokerSession = useSelector(pokerSessionsSelectors.getById)(pokerSessionId);
  const {
    register,
    watchCardSetId,
    errors,
    errGlobalMsg,
    formState,
    handleSubmit,
    onSubmit,
  } = usePokerSessionCreateModal({
    edit: true,
    pokerSessionId,
    onClose,
  });

  return (
    <Layout
      formRefs={{
        title: register,
        description: register,
        isAutoReveal: register,
        cardSetId: register,
      }}
      defaultValue={{
        title: pokerSession?.title,
        description: pokerSession?.description,
        cardSetId: pokerSession?.cardSetId,
        isAutoReveal: pokerSession?.isAutoReveal,
      }}
      cardSetId={watchCardSetId}
      errors={errors}
      errGlobalMsg={errGlobalMsg}
      isLoading={formState.isSubmitting}
      onCancel={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      {...other}
    />
  );
};

export {
  PokerSessionEditModal,
};
