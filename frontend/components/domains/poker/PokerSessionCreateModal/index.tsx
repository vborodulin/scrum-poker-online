import React from 'react';
import { useSelector } from 'react-redux';

import { pokerSessionsSelectors } from '@Redux/domains/pokerSessions/selectors';

import { usePokerSessionCreateModal } from '@components/domains/poker/hooks';

import { Layout } from './Layout';

export type TSessionCreateMainModalProps = {
  onClose: () => void;
  title?: string;
}

const PokerSessionCreateModal = (props: TSessionCreateMainModalProps): React.ReactElement | null => {
  const {
    title,
    onClose,
    ...other
  } = props;

  const {
    register,
    watchCardSetId,
    errors,
    errGlobalMsg,
    formState,
    handleSubmit,
    onSubmit,
  } = usePokerSessionCreateModal({ edit: false });

  const lastPokerSession = useSelector(pokerSessionsSelectors.getLastEntity);

  return (
    <Layout
      formRefs={{
        title: register,
        description: register,
        isAutoReveal: register,
        cardSetId: register,
      }}
      defaultValue={{
        title,
        cardSetId: lastPokerSession?.cardSetId.toString(),
        isAutoReveal: lastPokerSession?.isAutoReveal,
      }}
      cardSetId={watchCardSetId}
      errors={errors}
      errGlobalMsg={errGlobalMsg}
      isLoading={formState.isSubmitting}
      onCancel={onClose}
      onSubmit={handleSubmit(onSubmit)}
      {...other}
    />
  );
};

export {
  PokerSessionCreateModal,
};
