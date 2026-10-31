import { useTranslation } from 'next-i18next';
import React from 'react';

import { IndexFeature } from '@components/domains/Index/IndexFeature';
import { RetroBoardPreview } from '@components/domains/Index/IndexRetro/RetroBoardPreview';
import { IndexSection } from '@components/domains/Index/IndexSection';
import { IndexSectionHeader } from '@components/domains/Index/IndexSectionHeader';
import { INDEX_ANCHOR } from '@components/domains/Index/types';

import { Grid } from '@components/uiKit/Grid';
import {
  IconCheckCircle,
  IconDownload,
  IconNote,
  IconThumbUpOutline,
  IconVisibilityOff,
} from '@components/uiKit/Icons';

import { TRANS } from '@components/utils/types';

const FEATURES = [
  {
    key: 'templates',
    Icon: IconNote,
  },
  {
    key: 'blur',
    Icon: IconVisibilityOff,
  },
  {
    key: 'voting',
    Icon: IconThumbUpOutline,
  },
  {
    key: 'actions',
    Icon: IconCheckCircle,
  },
  {
    key: 'export',
    Icon: IconDownload,
  },
];

const IndexRetro = (): React.ReactElement | null => {
  const { t } = useTranslation(TRANS.MAIN);

  return (
    <IndexSection
      id={INDEX_ANCHOR.RETRO}
    >
      <IndexSectionHeader
        label={t('pages.index.retro.label')}
        title={t('pages.index.retro.title')}
        desc={t('pages.index.retro.desc')}
      />

      <Grid
        gridGap={[10, null, 12]}
        alignItems="center"
        gridTemplateColumns={[
          '1fr',
          null,
          '5fr 6fr',
        ]}
      >
        <Grid
          as="ul"
          gridGap={6}
          order={[1, null, 0]}
        >
          {FEATURES.map(({ key, Icon }) => (
            <IndexFeature
              key={key}
              Icon={Icon}
              title={t(`pages.index.retro.features.${key}.title`)}
              desc={t(`pages.index.retro.features.${key}.desc`)}
            />
          ))}
        </Grid>

        <RetroBoardPreview />
      </Grid>
    </IndexSection>
  );
};

export {
  IndexRetro,
};
