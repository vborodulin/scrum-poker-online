import React from 'react';
import { useSelector } from 'react-redux';

import { authSelectors } from '@Redux/domains/auth/selectors';

import { HeaderGuest } from '@components/domains/layouts/Header/HeaderGuest';
import { HeaderLoggedIn } from '@components/domains/layouts/Header/HeaderLoggedIn';
import { THeaderContainerProps } from '@components/domains/layouts/HeaderContainer';

export type TSpaceHeaderProps = Partial<THeaderContainerProps>;

const Header = (props: TSpaceHeaderProps): React.ReactElement | null => {
  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);

  if (isLoggedIn) {
    return (
      <HeaderLoggedIn
        {...props}
      />
    );
  }

  return (
    <HeaderGuest
      {...props}
    />
  );
};

export {
  Header,
};
