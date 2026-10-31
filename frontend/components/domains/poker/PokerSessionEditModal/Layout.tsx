import { useTranslation } from 'next-i18next';
import React from 'react';
import { useSelector } from 'react-redux';

import { pokerCardDecksSelectors } from '@Redux/domains/pokerCardDecks/selectors';

import {
  FORM_FIELDS,
  PokerSessionEditForm,
  TPokerSessionEditFormProps,
} from '@components/domains/poker/PokerSessionEditForm';
import { Modal, TModalProps } from '@components/domains/shared/Modal';

import { Button } from '@components/uiKit/Button';
import { PaperActions } from '@components/uiKit/PaperActions';
import { PaperContent } from '@components/uiKit/PaperContent';
import { PaperFooter } from '@components/uiKit/PaperFooter';
import { PaperHeader } from '@components/uiKit/PaperHeader';

import { TRANS } from '@components/utils/types';

const FORM_ID = 'PokerSessionEditModal';

export type TFormData = {
  title: string;
  description?: string;
  isAutoReveal: boolean;
  cardSetId: string;
};

export type TLayoutProps = TModalProps & Omit<TPokerSessionEditFormProps, 'formId'> & {
  onCancel: () => void;
  onSubmit: () => void;
}

const Layout = (props: TLayoutProps): React.ReactElement | null => {
  const {
    formRefs,
    defaultValue,
    errGlobalMsg,
    errors,
    cardSetId,
    isLoading,
    onClose,
    onCancel,
    onSubmit,
    ...other
  } = props;

  const { t } = useTranslation(TRANS.MAIN);

  const cardDecksOptions = useSelector(pokerCardDecksSelectors.getAllCardDecksListOptions);

  return (
    <Modal
      onClose={onClose}
      {...other}
    >
      <PaperHeader>
        {t('pokerSessionEditModal.title')}
      </PaperHeader>

      <PaperContent>
        <PokerSessionEditForm
          cardDecksOptions={cardDecksOptions}
          formId={FORM_ID}
          cardSetId={cardSetId}
          formRefs={formRefs}
          defaultValue={defaultValue}
          errors={errors}
          errGlobalMsg={errGlobalMsg}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </PaperContent>

      <PaperFooter>
        <PaperActions>
          <Button
            onClick={onCancel}
          >
            {t('pokerSessionEditModal.cancelBtn')}
          </Button>

          <Button
            variant="primary"
            type="submit"
            form={FORM_ID}
            onClick={onSubmit}
          >
            {t('pokerSessionEditModal.submitBtn')}
          </Button>
        </PaperActions>
      </PaperFooter>
    </Modal>
  );
};

export {
  Layout,
  FORM_FIELDS,
};
