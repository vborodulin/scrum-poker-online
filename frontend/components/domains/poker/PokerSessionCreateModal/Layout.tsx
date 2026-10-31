import { useTranslation } from 'next-i18next';
import React from 'react';
import { useSelector } from 'react-redux';

import { pokerCardDecksSelectors } from '@Redux/domains/pokerCardDecks/selectors';

import { CLASS_TEST, DATA_TEST_ID } from '@components/domains/core/types';
import {
  FORM_FIELDS,
  PokerSessionEditForm,
  TFormData,
  TPokerSessionEditFormProps,
} from '@components/domains/poker/PokerSessionEditForm';
import { Modal, TModalProps } from '@components/domains/shared/Modal';
import { SPACE_ONBOARDING_STEP_ID } from '@components/domains/space/onboarding/types';

import { Button } from '@components/uiKit/Button';
import { IconCardsOutline } from '@components/uiKit/Icons';
import { PaperActions } from '@components/uiKit/PaperActions';
import { PaperContent } from '@components/uiKit/PaperContent';
import { PaperFooter } from '@components/uiKit/PaperFooter';
import { PaperHeader } from '@components/uiKit/PaperHeader';

import { TRANS } from '@components/utils/types';

const FORM_ID = 'PokerSessionCreateModal';

export type TSessionCreateMainLayoutProps = TModalProps & Omit<TPokerSessionEditFormProps, 'formId'> & {
  onCancel: () => void;
  onSubmit: () => void;
};

const Layout = (props: TSessionCreateMainLayoutProps): React.ReactElement | null => {
  const {
    formRefs,
    defaultValue,
    errors,
    errGlobalMsg,
    isLoading,
    cardSetId,
    onCancel,
    onSubmit,
    ...other
  } = props;

  const { t } = useTranslation(TRANS.MAIN);

  const cardDecksOptions = useSelector(pokerCardDecksSelectors.getCardDecksListOptions);

  return (
    <Modal
      data-test-id={DATA_TEST_ID.POKER_SESSION_CREATE_MODAL}
      data-tut-space={SPACE_ONBOARDING_STEP_ID.POKER_SESSION_CREATE_MODAL}
      {...other}
    >
      <PaperHeader>
        {t('pokerSessionCreateModal.title')}
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
            data-test-id={DATA_TEST_ID.POKER_SESSION_CREATE_MODAL_CANCEL_BTN}
            onClick={onCancel}
          >
            {t('pokerSessionCreateModal.cancelBtn')}
          </Button>

          <Button
            StartIcon={IconCardsOutline}
            variant="primary"
            type="submit"
            form={FORM_ID}
            className={CLASS_TEST.POKER_SESSION_CREATE_MODAL_SUBMIT_BTN}
            onClick={onSubmit}
          >
            {t('pokerSessionCreateModal.submitBtn')}
          </Button>
        </PaperActions>
      </PaperFooter>
    </Modal>
  );
};

Layout.displayName = 'PokerSessionCreateModal';

export {
  Layout,
  FORM_FIELDS,
};

export type {
  TFormData,
};
