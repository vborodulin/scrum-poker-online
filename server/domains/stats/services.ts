import { SPACE_PARTICIPANT_ROLE } from '@chpokify/models-types';
import { PipelineStage } from 'mongoose';

class StatsService {
  public static getStatSpacesPipeline(): Array<PipelineStage> {
    const dateFormat = '%Y.%m.%d';

    const currentPlanToAggregate = [
      '$subscriptions.plan.nickname',
      ' ',
      '$currentPlanPrice',
      { $literal: '$' },
      ' ',
      '/',
      ' ',
      '$subscriptions.plan.interval',
    ];

    const pipeline = [
      {
        $addFields: {
          teamsCount: {
            $size: '$teams',
          },
          participantsCount: {
            $size: '$participants',
          },
          spaceIdStr: { $toString: '$_id' },
        },
      },
      {
        $unwind: {
          path: '$participants',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $lookup: {
          from: 'pokersessions',
          foreignField: 'spaceId',
          localField: '_id',
          as: 'pokersessions',
        },
      },
      {
        $lookup: {
          from: 'stories',
          localField: '_id',
          foreignField: 'spaceId',
          as: 'stories',
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'spaceIdStr',
          foreignField: 'metadata.spaceId',
          as: 'subscriptions',
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: 'id',
          as: 'customers',
        },
      },
      {
        $unwind: {
          path: '$subscriptions',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          currentPlanPrice: {
            $toString: { $divide: ['$subscriptions.plan.amount', 100] },
          },
          pokerSessionsResults: {
            $reduce: {
              input: '$pokersessions.results',
              initialValue: [],
              in: { $concatArrays: ['$$value', { $objectToArray: '$$this' }] },
            },
          },
          pokersessionsCardDecksIds: {
            $map: {
              input: '$pokersessions',
              as: 'pokerCardDeck',
              in: { $toObjectId: '$$pokerCardDeck.cardSetId' },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'pokercarddecks',
          as: 'pokercarddecks',
          localField: 'pokersessionsCardDecksIds',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          pokerSessionsResultsScore: {
            $map:
                {
                  input: '$pokerSessionsResults',
                  as: 'pokerSessionsResult',
                  in: {
                    $cond: [
                      { $gt: [{ $size: { $objectToArray: '$$pokerSessionsResult.v.teamsResult' } }, 0] },
                      1,
                      0,
                    ],
                  },
                },
          },
        },
      },
      {
        $addFields: {
          pokerSessionsCount: {
            $size: '$pokersessions',
          },
          storiesCount: {
            $size: '$stories',
          },
          adminsCount: {
            $cond: {
              if: {
                $gt: ['$participants.role', SPACE_PARTICIPANT_ROLE.PLAYER],
              },
              then: 1,
              else: 0,
            },
          },
          lastPokerSessionDate: {
            $max: '$pokersessions.updatedAt',
          },
          storyWithScore: {
            $reduce: {
              input: '$pokerSessionsResultsScore',
              initialValue: 0,
              in: { $add: ['$$value', '$$this'] },
            },
          },
          billingEmail: {
            $arrayElemAt: ['$customers.email', -1],
          },
          currentPlan: {
            $concat: currentPlanToAggregate,
          },
          customCardDeckInPokerSession: {
            $anyElementTrue: {
              $map: {
                input: '$pokercarddecks',
                as: 'customCardDecksIds',
                in: {
                  $cond: ['$$customCardDecksIds.default', false, true],
                },

              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          spaceName: {
            $last: '$name',
          },
          createdAt: {
            $last: {
              $dateToString: {
                format: dateFormat,
                date: '$createdAt',
              },
            },
          },
          participantsCount: {
            $last: '$participantsCount',
          },
          teamsCount: {
            $last: '$teamsCount',
          },
          pokerSessionsCount: {
            $last: '$pokerSessionsCount',
          },
          storiesCount: {
            $last: '$storiesCount',
          },
          storiesCountWithScore: {
            $last: '$storyWithScore',
          },
          lastPokerSessionDate: {
            $max: {
              $dateToString: {
                format: dateFormat,
                date: '$lastPokerSessionDate',
              },
            },
          },
          adminEmails: {
            $push: {
              $cond: [
                { $gt: ['$participants.role', SPACE_PARTICIPANT_ROLE.PLAYER] },
                '$user.email',
                '$$REMOVE',
              ],
            },
          },
          admins: {
            $sum: '$adminsCount',
          },
          trialStartDate: {
            $last: {
              $dateToString: {
                format: dateFormat,
                date: {
                  $toDate: {
                    $multiply: ['$subscriptions.trial_start', 1000],
                  },
                },
              },
            },
          },
          trialEndDate: {
            $last: {
              $dateToString: {
                format: dateFormat,
                date: {
                  $toDate: {
                    $multiply: ['$subscriptions.trial_end', 1000],
                  },
                },
              },
            },
          },
          billingEmail: {
            $last: '$billingEmail',
          },
          currentPlan: {
            $last: '$currentPlan',
          },
          customCardDeckInPokerSessions: {
            $last: '$customCardDeckInPokerSession',
          },
        },
      },
    ];

    return pipeline;
  }

  public static getStatAdminsPipeline(): Array<PipelineStage> {
    const dateFormat = '%Y.%m.%d';

    const pipeline = [
      {
        $addFields: {
          teamsCount: {
            $size: '$teams',
          },
          participantsCount: {
            $size: '$participants',
          },
        },
      }, {
        $unwind: {
          path: '$participants',
        },
      }, {
        $match: {
          'participants.role': 2,
        },
      }, {
        $lookup: {
          from: 'users',
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'user',
        },
      }, {
        $unwind: {
          path: '$user',
        },
      }, {
        $lookup: {
          from: 'pokersessions',
          foreignField: 'spaceId',
          localField: '_id',
          as: 'pokersessions',
        },
      }, {
        $lookup: {
          from: 'stories',
          localField: '_id',
          foreignField: 'spaceId',
          as: 'stories',
        },
      }, {
        $addFields: {
          pokerSessionsCount: {
            $size: '$pokersessions',
          },
          storiesCount: {
            $size: '$stories',
          },
          lastPokerSessionDate: {
            $max: '$pokersessions.updatedAt',
          },
        },
      }, {
        $group: {
          _id: '$user._id',
          username: {
            $last: '$user.username',
          },
          email: {
            $last: '$user.email',
          },
          createdAt: {
            $last: {
              $dateToString: {
                format: dateFormat,
                date: '$user.createdAt',
              },
            },
          },
          spacesCount: {
            $sum: 1,
          },
          teamsCount: {
            $sum: '$teamsCount',
          },
          participantsCount: {
            $sum: '$participantsCount',
          },
          pokerSessionsCount: {
            $sum: '$pokerSessionsCount',
          },
          storiesCount: {
            $sum: '$storiesCount',
          },
          lastPokerSessionDate: {
            $max: {
              $dateToString: {
                format: dateFormat,
                date: '$lastPokerSessionDate',
              },
            },
          },
        },
      },
    ];

    return pipeline;
  }
}

export { StatsService };
