import { routing } from '@chpokify/routing';
import NextLink from 'next/link';
import React from 'react';

import { Button, TButtonProps } from '@components/uiKit/Button';

export type TIndexActionBtnProps = Partial<TButtonProps>;

const IndexActionBtn = (props: TIndexActionBtnProps): React.ReactElement | null => {
  const {
    variant = 'primary',
    ...other
  } = props;

  return (
    <NextLink
      href={routing.getSignUpUrl()}
      passHref
    >
      <Button
        as="a"
        variant={variant}
        height="56px"
        textProps={{
          fontSize: 4,
        }}
        {...other}
      />
    </NextLink>
  );
};

export {
  IndexActionBtn,
};
