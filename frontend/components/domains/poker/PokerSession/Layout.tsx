import { pokerSessionHelpers } from '@chpokify/helpers/pokerSession';
import { TPokerSession } from '@chpokify/models-types/pokerSession';
import React from 'react';

import { PokerSessionHeader } from '@components/domains/poker/PokerSession/PokerSessionHeader';
import { PokerSessionStoriesList } from '@components/domains/poker/PokerSession/PokerSessionStoriesList';
import { PokerSessionStory } from '@components/domains/poker/PokerSession/PokerSessionStory';
import { PokerSessionTeams } from '@components/domains/poker/PokerSession/PokerSessionTeams';
import { PokerChooseCardsProcessor } from '@components/domains/poker/utils/PokerChooseCardsProcessor';
import { StoriesListSelectProcessor } from '@components/domains/poker/utils/StoriesListSelectedProcessor';

import { Flex, TFlexProps } from '@components/uiKit/Flex';
import { Grid } from '@components/uiKit/Grid';

export type TLayoutProps = Partial<TFlexProps> & {
    pokerSession: TPokerSession;
    canModerate: boolean;
};

const Layout = (props: TLayoutProps): React.ReactElement | null => {
  const {
    pokerSession,
    canModerate,
    ...other
  } = props;

  return (
    <Flex
      flexGrow={1}
      flexDirection="column"
      my={[4, 6]}
      {...other}
    >
      <PokerSessionHeader
        pokerSessionId={pokerSession._id}
        title={pokerSessionHelpers.getTitle(pokerSession)}
        description={pokerSession.description}
        mb={5}
      />

      <Grid
        gridGap={6}
        gridTemplateColumns={[
          '1fr',
          null,
          '1fr 2fr',
          '460px 1fr',
        ]}
        alignItems="flex-start"
      >
        <Grid
          gridGap={6}
          display={[
            canModerate ? 'grid' : 'none',
            'grid',
          ]}
        >
          <PokerSessionStoriesList
            display={['none', null, 'flex']}
          />

          <PokerSessionTeams
            display={[
              canModerate ? 'flex' : 'none',
              'flex',
            ]}
          />
        </Grid>

        <PokerSessionStory
          flexGrow={1}
        />
      </Grid>

      <PokerChooseCardsProcessor />
      <StoriesListSelectProcessor />
    </Flex>
  );
};

export {
  Layout,
};
