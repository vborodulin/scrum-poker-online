import React from 'react';

import { RetroSessionActionsColumnBtn } from '@components/domains/retro/buttons/RetroSessionActionsColumnBtn';
import { RetroSessionInviteBtn } from '@components/domains/retro/buttons/RetroSessionInviteBtn';
import { RetroSessionPeopleBtn } from '@components/domains/retro/buttons/RetroSessionPeopleBtn';

import { Flex, TFlexProps } from '@components/uiKit/Flex';

export type TRetroSessionActionsProps = Partial<TFlexProps> & {
  canModerate: boolean;
};

const RetroSessionActions = (props: TRetroSessionActionsProps): React.ReactElement | null => {
  const {
    canModerate,
    ...other
  } = props;

  return (
    <Flex
      alignItems="center"
      gap={4}
      {...other}
    >
      <RetroSessionInviteBtn
        canModerate={canModerate}
        variant="base"
      />

      <RetroSessionPeopleBtn
        canModerate={canModerate}
      />

      <RetroSessionActionsColumnBtn
        canModerate={canModerate}
      />
    </Flex>
  );
};

export {
  RetroSessionActions,
};
