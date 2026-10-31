import { TEntityID } from '@chpokify/models-types';
import { get } from 'lodash';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { PokerCardSetPreview } from '@components/domains/poker/PokerCardSetPreview';

import { Box, TBoxProps } from '@components/uiKit/Box';
import { Checkbox } from '@components/uiKit/CheckBox';
import { Divider } from '@components/uiKit/Divider';
import { FormControl } from '@components/uiKit/FormControl';
import { FormControlLabel } from '@components/uiKit/FormControlLabel';
import { FormHelperText } from '@components/uiKit/FormHelperText';
import { FormLabel } from '@components/uiKit/FormLabel';
import { Input } from '@components/uiKit/Input';
import { Select, TSelectOption } from '@components/uiKit/Select';

import { TRANS } from '@components/utils/types';

import { TFormErrors } from '@lib/types/form';

export type TFormData = {
    title: string;
    description?: string;
    isAutoReveal: boolean;
    cardSetId: string;
};

export const FORM_FIELDS: (keyof TFormData)[] = [
  'title',
  'description',
  'isAutoReveal',
  'cardSetId',
];

export type TFormRefs = Record<keyof TFormData, React.Ref<HTMLInputElement>>;
export type TPokerSessionEditFormProps = Partial<TBoxProps> & {
    formId: string;
    formRefs: TFormRefs;
    defaultValue: Partial<TFormData>;
    errors: TFormErrors<TFormData>;
    errGlobalMsg: string;
    isLoading: boolean;
    onSubmit: () => void;
    cardSetId?: TEntityID;
    cardDecksOptions: TSelectOption[]
};

const PokerSessionEditForm = (props: TPokerSessionEditFormProps): React.ReactElement | null => {
  const {
    formId,
    formRefs,
    defaultValue,
    errors,
    isLoading,
    cardSetId,
    onSubmit,
    errGlobalMsg,
    cardDecksOptions,
  } = props;

  const { t } = useTranslation(TRANS.MAIN);

  const defaultCardDeck = defaultValue.cardSetId || cardDecksOptions[0].value;

  const renderAutoRevealCheckbox = () => (
    <FormControl
      errorMessage={get(errors, 'settings.isAutoReveal.message')}
    >
      <FormControlLabel
        label={t('pokerSessionEditForm.isAutoRevealLabel')}
      >
        <Checkbox
          inputRef={formRefs.isAutoReveal}
          name="isAutoReveal"
          defaultChecked={defaultValue.isAutoReveal}
        />
      </FormControlLabel>
    </FormControl>
  );

  return (
    <Box
      id={formId}
      as="form"
      onSubmit={onSubmit}
    >
      <Box
        as="fieldset"
        disabled={isLoading}
      >
        <Box>
          <FormControl
            errorMessage={errors.title?.message}
          >
            <Input
              inputRef={formRefs.title}
              name="title"
              defaultValue={defaultValue.title}
              placeholder={t('pokerSessionEditForm.titlePlaceholder')}
              autoFocus
            />
          </FormControl>

          <FormControl
            errorMessage={errors.description?.message}
          >
            <Input
              inputRef={formRefs.description}
              name="description"
              defaultValue={defaultValue.description}
              placeholder={t('pokerSessionEditForm.descriptionPlaceholder')}
            />
          </FormControl>
        </Box>
        <Divider
          mt={6}
          mb={6}
        />
        <Box>
          <FormControl>
            <FormLabel>
              {t('pokerSessionEditForm.cardDeckLabel')}
            </FormLabel>

            <Select
              inputRef={formRefs.cardSetId}
              name="cardSetId"
              defaultValue={defaultCardDeck}
              options={cardDecksOptions}
            />

            <PokerCardSetPreview
              mt={2}
              cardSetId={cardSetId || defaultCardDeck}
            />
          </FormControl>
          <Divider
            my={6}
          />
          {
              renderAutoRevealCheckbox()
          }
        </Box>
        <Divider
          mt={6}
        />
      </Box>
      <FormHelperText
        variant="negative"
        mt={0}
      >
        {errGlobalMsg}
      </FormHelperText>
    </Box>
  );
};

PokerSessionEditForm.displayName = 'PokerSessionEditForm';

export {
  PokerSessionEditForm,
};
