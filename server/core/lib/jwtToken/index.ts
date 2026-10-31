import config from 'config';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

import { TThrowError } from '@core/types';

const APP_SECRET = process.env.APP_SECRET as string;
const INVITE_TO_SPACE_EXPIRATION = config.get('app.inviteToSpaceExpiration') as string;

function validateToken<T extends {}>(token: string): TThrowError<T> {
  try {
    return {
      data: jsonwebtoken.verify(token, APP_SECRET) as T,
    };
  } catch (err) {
    return {
      err,
    };
  }
}

function signInInviteToken(payload: any): string {
  return jsonwebtoken.sign(payload, APP_SECRET, {
    expiresIn: INVITE_TO_SPACE_EXPIRATION,
    // every generated link is unique (even within one second): guest links are one-time
    jwtid: crypto.randomBytes(8).toString('hex'),
  });
}

export const jwtToken = {
  signInInviteToken,
  validateToken,
};
