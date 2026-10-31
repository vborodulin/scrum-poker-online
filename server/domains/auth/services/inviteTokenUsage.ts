import crypto from 'crypto';

import { UsedInviteTokenModel } from '@models/usedInviteToken';

// used if token has no exp (should not happen: invite tokens always expire)
const FALLBACK_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const MONGO_DUPLICATE_KEY_CODE = 11000;

const hashToken = (token: string) => crypto.createHash('sha256')
  .update(token)
  .digest('hex');

/**
 * Invite link for guest log in is one-time: only the first guest gets in by it,
 * after that the guest is recognized by session cookie.
 */
const isUsed = async (token: string): Promise<boolean> => {
  const usedToken = await UsedInviteTokenModel.exists({ tokenHash: hashToken(token) });
  return !!usedToken;
};

/**
 * Atomically marks invite token as used.
 * @returns false if the token is already used (e.g. by a concurrent request)
 */
const markUsed = async (token: string, exp?: number): Promise<boolean> => {
  try {
    await UsedInviteTokenModel.create({
      tokenHash: hashToken(token),
      expiresAt: exp ? new Date(exp * 1000) : new Date(Date.now() + FALLBACK_TTL_MS),
    });
    return true;
  } catch (err) {
    if ((err as { code?: number }).code === MONGO_DUPLICATE_KEY_CODE) {
      return false;
    }

    throw err;
  }
};

const inviteTokenUsage = {
  isUsed,
  markUsed,
};

export { inviteTokenUsage };
