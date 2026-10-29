import { useTranslation } from 'next-i18next';
import React from 'react';

import { IndexFeature } from '@components/domains/Index/IndexFeature';
import { IndexScreenshot } from '@components/domains/Index/IndexScreenshot';
import { IndexSection } from '@components/domains/Index/IndexSection';
import { IndexSectionHeader } from '@components/domains/Index/IndexSectionHeader';
import { INDEX_ANCHOR } from '@components/domains/Index/types';

import { Grid } from '@components/uiKit/Grid';
import {
  IconCardsOutline,
  IconFlagOutline,
  IconGroupOfUsers,
  IconJira,
  IconTimer,
  IconVisibilityOn,
} from '@components/uiKit/Icons';

import { TRANS } from '@components/utils/types';

const FEATURES = [
  {
    key: 'teams',
    Icon: IconGroupOfUsers,
  },
  {
    key: 'moderate',
    Icon: IconFlagOutline,
  },
  {
    key: 'decks',
    Icon: IconCardsOutline,
  },
  {
    key: 'autoReveal',
    Icon: IconVisibilityOn,
  },
  {
    key: 'timer',
    Icon: IconTimer,
  },
  {
    key: 'jira',
    Icon: IconJira,
  },
];

const IndexPoker = (): React.ReactElement | null => {
  const { t } = useTranslation(TRANS.MAIN);

  return (
    <IndexSection
      id={INDEX_ANCHOR.PLANNING_POKER}
      bg="base.normal"
    >
      <IndexSectionHeader
        label={t('pages.index.poker.label')}
        title={t('pages.index.poker.title')}
        desc={t('pages.index.poker.desc')}
      />

      <Grid
        gridGap={[10, null, 12]}
        alignItems="center"
        gridTemplateColumns={[
          '1fr',
          null,
          '6fr 5fr',
        ]}
      >
        <IndexScreenshot
          src="/images/chpokify-moderate.png"
          alt={t('pages.index.poker.imgAlt')}
          ar={2472 / 2008}
        />

        <Grid
          as="ul"
          gridGap={6}
        >
          {FEATURES.map(({ key, Icon }) => (
            <IndexFeature
              key={key}
              Icon={Icon}
              title={t(`pages.index.poker.features.${key}.title`)}
              desc={t(`pages.index.poker.features.${key}.desc`)}
            />
          ))}
        </Grid>
      </Grid>
    </IndexSection>
  );
};

export {
  IndexPoker,
};
