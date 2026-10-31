import { TEntityID } from '@chpokify/models-types';
import { useRouter } from 'next/router';
import React from 'react';

import { PokerSessionActions } from '@components/domains/poker/PokerSession/PokerSessionHeader/PokerSessionActions';
import { PokerSessionName } from '@components/domains/poker/PokerSession/PokerSessionHeader/PokerSessionName';

import { Box } from '@components/uiKit/Box';
import { Button } from '@components/uiKit/Button';
import { Flex } from '@components/uiKit/Flex';
import { Grid, TGridProps } from '@components/uiKit/Grid';
import { IconArrowLeft } from '@components/uiKit/Icons';
import { Text } from '@components/uiKit/Text';

export type TPokerSessionHeaderProps = Partial<TGridProps> & {
  pokerSessionId: TEntityID;
  title: string;
  description?: string;
};

const PokerSessionHeader = (props: TPokerSessionHeaderProps): React.ReactElement | null => {
  const {
    pokerSessionId,
    title,
    description,
    ...other
  } = props;

  const router = useRouter();

  const handleClickGoBack = () => {
    router.back();
  };

  return (
    <Grid
      gridTemplateColumns={['1fr', null, '1fr max-content']}
      alignItems="flex-start"
      gridColumnGap={6}
      gridRowGap={2}
      {...other}
    >
      <Flex
        flexDirection="column"
        width="100%"
      >
        <Box>
          <Flex
            alignItems="center"
            gap={3}
          >
            <Button
              StartIcon={IconArrowLeft}
              onClick={handleClickGoBack}
            />
            <PokerSessionName
              pokerSessionId={pokerSessionId}
              pokerSessionTitle={title}
            />
          </Flex>
          {
            description && (
              <Text
                fontSize={2}
                color="font.d_10"
                mt={1}
              >
                {description}
              </Text>
            )
          }
        </Box>
      </Flex>

      <PokerSessionActions
        pokerSessionId={pokerSessionId}
      />
    </Grid>
  );
};

export {
  PokerSessionHeader,
};
