import { isEqualsId } from '@chpokify/helpers';
import { TEntityID, TUser } from '@chpokify/models-types';
import mongoose from 'mongoose';

import { PokerSessionModel } from '@models/pokerSession';
import { SpaceModel } from '@models/space';

// rooms in format `${prefix}:${spaceId}`
const SPACE_ROOM_PREFIXES = [
  'space',
  'userSpace',
  'storySpace',
  'pokerSession',
  'retroSession',
  'retroSessionCard',
  'retroSessionRelations',
  'retroTemplate',
];

const getSpaceRoomsIds = (spaceId: TEntityID): string[] =>
  SPACE_ROOM_PREFIXES.map((prefix) => `${prefix}:${spaceId.toString()}`);

const parseRoomId = (roomId: string): { prefix: string, id: string } | null => {
  const [prefix, id, ...rest] = roomId.split(':');

  if (!prefix || !id || rest.length || !mongoose.isValidObjectId(id)) {
    return null;
  }

  return {
    prefix,
    id,
  };
};

const getRoomSpaceId = async (prefix: string, id: string): Promise<TEntityID | null> => {
  if (SPACE_ROOM_PREFIXES.includes(prefix)) {
    return id;
  }

  if (prefix === 'pokerSessionRatingModal') {
    const pokerSession = await PokerSessionModel.findById(id).select('spaceId');
    return pokerSession?.spaceId || null;
  }

  return null;
};

const canJoinRoom = async (user: TUser, roomId: string): Promise<boolean> => {
  const room = parseRoomId(roomId);

  if (!room) {
    return false;
  }

  const { prefix, id } = room;

  if (prefix === 'user') {
    return isEqualsId(user._id, id);
  }

  const spaceId = await getRoomSpaceId(prefix, id);

  if (!spaceId) {
    return false;
  }

  const space = await SpaceModel.exists({
    _id: spaceId,
    participants: {
      $elemMatch: { userId: user._id },
    },
  });

  return !!space;
};

export {
  canJoinRoom,
  getSpaceRoomsIds,
  parseRoomId,
};
