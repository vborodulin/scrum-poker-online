import { useTranslation } from 'next-i18next';
import React from 'react';

import { Box, TBoxProps } from '@components/uiKit/Box';
import { Flex } from '@components/uiKit/Flex';
import { Grid } from '@components/uiKit/Grid';
import { IconThumbUpOutline } from '@components/uiKit/Icons';
import { Text } from '@components/uiKit/Text';

import { TRANS } from '@components/utils/types';

const COLUMNS = [
  {
    key: 'wentWell',
    color: 'positive.normal',
    cards: [
      { key: 'card1', votes: 4 },
      { key: 'card2', votes: 2 },
    ],
  },
  {
    key: 'notWell',
    color: 'negative.normal',
    cards: [
      { key: 'card1', votes: 5 },
      { key: 'card2', votes: 3 },
    ],
  },
  {
    key: 'actions',
    color: 'primary.normal',
    cards: [
      { key: 'card1', votes: 0 },
    ],
  },
];

export type TRetroBoardPreviewProps = TBoxProps;

const RetroBoardPreview = (props: TRetroBoardPreviewProps): React.ReactElement | null => {
  const { t } = useTranslation(TRANS.MAIN);

  return (
    <Box
      p={[4, null, 6]}
      borderRadius={3}
      bg="base.normal"
      boxShadow="modal"
      aria-hidden
      {...props}
    >
      <Text
        fontSize={1}
        color="font.d_30"
        textTransform="uppercase"
        mb={1}
      >
        {t('pages.index.retro.board.label')}
      </Text>

      <Text
        fontSize={[4, null, 5]}
        fontWeight={1}
        mb={5}
      >
        {t('pages.index.retro.board.title')}
      </Text>

      <Grid
        gridGap={3}
        gridTemplateColumns={[
          '1fr',
          'repeat(3, 1fr)',
        ]}
      >
        {COLUMNS.map((column) => (
          <Box
            key={column.key}
            borderTop="4px solid"
            borderColor={column.color}
            borderRadius={2}
            bg="base.a_10"
            p={3}
          >
            <Text
              fontSize={2}
              fontWeight={1}
              mb={3}
            >
              {t(`pages.index.retro.board.${column.key}.title`)}
            </Text>

            <Grid
              gridGap={2}
            >
              {column.cards.map((card) => (
                <Box
                  key={card.key}
                  p={3}
                  borderRadius={2}
                  bg="base.normal"
                  boxShadow="card"
                >
                  <Text
                    fontSize={2}
                  >
                    {t(`pages.index.retro.board.${column.key}.${card.key}`)}
                  </Text>

                  {
                    card.votes > 0 && (
                      <Flex
                        alignItems="center"
                        mt={2}
                      >
                        <IconThumbUpOutline
                          width="16px"
                          height="16px"
                          fill="font.d_30"
                          mr={1}
                        />

                        <Text
                          fontSize={1}
                          color="font.d_30"
                        >
                          {card.votes}
                        </Text>
                      </Flex>
                    )
                  }
                </Box>
              ))}
            </Grid>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export {
  RetroBoardPreview,
};
