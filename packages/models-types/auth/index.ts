import { TEntityID } from '../core';

enum INVITE_USER_TO {
  POKER,
  RETRO
}

type TLogInGuest = {
  username: string;
  // may be omitted when the invite link has only one team
  teamId?: TEntityID
  inviteToken: string;
  inviteTo: INVITE_USER_TO
};

export {
  INVITE_USER_TO,
};

export type{
  TLogInGuest,
};
