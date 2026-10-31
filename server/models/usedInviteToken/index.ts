import mongoose from 'mongoose';

/**
 * Invite links used for guest log in: a link lets in only one guest.
 * Record is removed by mongo (TTL index) when the link expires anyway.
 */
export type TUsedInviteToken = {
  // sha256 of the token: the token itself is a credential and is not stored
  tokenHash: string;
  expiresAt: Date;
};

export type TUsedInviteTokenDocument = mongoose.Document & TUsedInviteToken;

const UsedInviteTokenSchema = new mongoose.Schema<TUsedInviteTokenDocument>({
  tokenHash: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
}, {
  timestamps: true,
  strict: true,
  strictQuery: true,
});

// unique: concurrent log ins by the same link — only one insert succeeds
UsedInviteTokenSchema.index({ tokenHash: 1 }, { unique: true });
UsedInviteTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UsedInviteTokenModel = mongoose.model<TUsedInviteTokenDocument>(
  'UsedInviteToken',
  UsedInviteTokenSchema
);

export { UsedInviteTokenModel };
