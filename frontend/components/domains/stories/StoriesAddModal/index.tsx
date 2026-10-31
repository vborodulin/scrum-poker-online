import { TStory } from '@chpokify/models-types';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { Modal, TModalProps } from '@components/domains/shared/Modal';
import { StoriesFreeformInput } from '@components/domains/stories/StoriesAddModal/StoriesFreeformInput';

import { PaperHeader } from '@components/uiKit/PaperHeader';

import { TRANS } from '@components/utils/types';

export type TStoriesAddModalProps = Partial<TModalProps> & {
  onAfterSubmit?: (data: { stories: TStory[] }) => Promise<void>;
};

const StoriesAddModal = (props: TStoriesAddModalProps) => {
  const {
    onAfterSubmit,
    onClose = () => {

    },
    ...other
  } = props;

  const { t } = useTranslation(TRANS.MAIN);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      {...other}
    >
      <PaperHeader
        mb={6}
      >
        {t('storiesAddModal.title')}
      </PaperHeader>

      <StoriesFreeformInput
        onClose={handleClose}
        onAfterSubmit={onAfterSubmit}
      />
    </Modal>
  );
};

export {
  StoriesAddModal,
};
