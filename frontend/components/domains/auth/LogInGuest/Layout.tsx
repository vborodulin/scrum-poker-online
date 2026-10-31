import { routing } from '@chpokify/routing';
import { useTranslation } from 'next-i18next';
import React, { FormEvent } from 'react';

import { DataEncrypted } from '@components/domains/auth/DataEncrypted';
import { Terms } from '@components/domains/auth/Terms';
import { Logo } from '@components/domains/shared/Logo';
import { Modal } from '@components/domains/shared/Modal';

import { Button } from '@components/uiKit/Button';
import { Divider } from '@components/uiKit/Divider';
import { Flex, TFlexProps } from '@components/uiKit/Flex';
import { FormControl } from '@components/uiKit/FormControl';
import { FormHelperText } from '@components/uiKit/FormHelperText';
import { FormLabel } from '@components/uiKit/FormLabel';
import { Input } from '@components/uiKit/Input';
import { LinkComponent } from '@components/uiKit/Link';
import { PaperActions } from '@components/uiKit/PaperActions';
import { PaperContent } from '@components/uiKit/PaperContent';
import { PaperFooter } from '@components/uiKit/PaperFooter';
import { PaperHeader } from '@components/uiKit/PaperHeader';
import { Select, TSelectOption } from '@components/uiKit/Select';
import { Text } from '@components/uiKit/Text';

import { TRANS } from '@components/utils/types';

import { TFormErrors } from '@lib/types/form';

export type TFormData = {
  username: string;
  // not rendered when the invite link has only one team
  teamId?: string;
};

type TFormRefs = Record<keyof TFormData, React.Ref<HTMLInputElement>>;

export type TLogInLayoutProps = TFlexProps & {
  formRefs: TFormRefs;
  errors: TFormErrors<TFormData>;
  errGlobalMsg: string;
  hasChanges: boolean;
  isLoading: boolean;
  onSubmit: (event: FormEvent) => void;
  teamsOptions: TSelectOption[],
}

const Layout = (props: TLogInLayoutProps): React.ReactElement | null => {
  const {
    formRefs,
    errors,
    errGlobalMsg,
    isLoading,
    hasChanges,
    onSubmit,
    teamsOptions,
  } = props;

  const { t } = useTranslation(TRANS.MAIN);

  return (
    <Flex
      flexDirection="column"
      opacity={isLoading ? 0.4 : 1}
    >
      <Flex
        justifyContent="center"
      >
        <Logo
          mb={6}
        />
      </Flex>

      <Modal
        variant="card"
        forwardedAs="form"
        preventClose
        onSubmit={onSubmit}
      >
        <PaperHeader>
          <Text
            as="h1"
            fontSize={6}
            fontWeight={1}
            textAlign="center"
          >
            {t('logInGuest.title')}
          </Text>
        </PaperHeader>

        <PaperContent>
          <fieldset
            disabled={isLoading}
          >
            <FormControl
              errorMessage={errors.username?.message}
            >
              <FormLabel>
                {t('logInGuest.userNameInput.title')}
              </FormLabel>

              <Input
                inputRef={formRefs.username}
                placeholder={t('logInGuest.userNameInput.placeholder')}
                name="username"
                type="text"
                autoComplete="name"
                autoFocus
              />
            </FormControl>

            {teamsOptions.length > 1 && (
              <FormControl
                errorMessage={errors.teamId?.message}
              >
                <FormLabel>
                  {t('logInGuest.teamInput.title')}
                </FormLabel>

                <Select
                  inputRef={formRefs.teamId}
                  name="teamId"
                  options={teamsOptions}
                />
              </FormControl>
            )}

            <FormHelperText
              variant="negative"
            >
              {errGlobalMsg}
            </FormHelperText>

          </fieldset>
        </PaperContent>

        <PaperFooter>
          <PaperActions>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !hasChanges}
            >
              {t('logInGuest.submitBtn')}
            </Button>
          </PaperActions>

          <Divider
            my={6}
          />
          <Flex
            justifyContent="center"
          >
            <LinkComponent
              href={routing.getLogInUrl()}
            >
              {t('logInGuest.linkBtn')}
            </LinkComponent>
          </Flex>
          <Divider
            my={6}
          />

          <Terms
            mt={4}
          />
          <DataEncrypted
            mt={4}
          />

        </PaperFooter>
      </Modal>

    </Flex>

  );
};

export {
  Layout,
};
