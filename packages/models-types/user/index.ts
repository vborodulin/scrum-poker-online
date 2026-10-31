import { Stripe } from 'stripe';

import { TEntityID } from '../core';
import { TParticipant } from '../space';

export const USERNAME_MIN_LENGTH = 3;

export const USERNAME_MAX_LENGTH = 25;

export const PASSWORD_MIN_LENGTH = 6;

export const PASSWORD_MAX_LENGTH = 25;

export const USERNAME_CHAR_PATTERN = '[a-zA-Z0-9_-]';

export const USERNAME_CHAR_ALL_PATTERN = `^[a-zA-Z0-9_-]{${USERNAME_MIN_LENGTH},${USERNAME_MAX_LENGTH}}$`;

export const PASSWORD_CHAR_PATTERN = '[\\S]';

export const USERNAME_REGEXP = new RegExp(USERNAME_CHAR_ALL_PATTERN);

export const PASSWORD_REGEXP = new RegExp(
  `^${PASSWORD_CHAR_PATTERN}{${PASSWORD_MIN_LENGTH},${PASSWORD_MAX_LENGTH}}$`
);

export enum USER_ROLES {
  GUEST,
  USER,
  ADMIN
}

export enum THEME_TYPES {
  LIGHT = 'light',
  DARK = 'dark'
}

export type TUserSettings = {
  themeType: THEME_TYPES
}

export type TUser = {
  _id: TEntityID;
  username: string;
  // guests have no email
  email?: string;
  settings: TUserSettings;
  role: USER_ROLES.USER | USER_ROLES.ADMIN;
  showSpaceOnboarding?: boolean;
  showPokerOnboarding?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;

  // protected
  password: string;
  googleId?: string;
  customerId?: string;
  isGuest?: boolean;
};

export type TUserProtected = Omit<TUser,
  'password'
  | 'settings'
  | 'customerId'>;

export type TUserWithParticipant = TUserProtected & {
  participant: TParticipant
};

export type TCustomer = Stripe.Customer & {
  _id: TEntityID;
  spaceId: TEntityID;
};

export type TUserConfig = {};
