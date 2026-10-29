import { useTranslation } from 'next-i18next';
import React from 'react';

import { IndexActionBtn } from '@components/domains/Index/IndexActionBtn';
import { IndexScreenshot } from '@components/domains/Index/IndexScreenshot';
import { IndexSection } from '@components/domains/Index/IndexSection';
import { INDEX_ANCHOR } from '@components/domains/Index/types';

import { Button } from '@components/uiKit/Button';
import { Flex } from '@components/uiKit/Flex';
import { Grid } from '@components/uiKit/Grid';
import { Text } from '@components/uiKit/Text';

import { TRANS } from '@components/utils/types';

const IndexHero = (): React.ReactElement | null => {
  const { t } = useTranslation(TRANS.MAIN);

  return (
    <IndexSection
      bg="primary.d_40"
    >
      <Grid
        gridGap={[10, null, 12]}
        alignItems="center"
        gridTemplateColumns={[
          '1fr',
          null,
          '5fr 6fr',
        ]}
      >
        <Flex
          flexDirection="column"
          alignItems={['center', null, 'flex-start']}
        >
          <Text
            fontSize={2}
            fontWeight={1}
            color="font.primary"
            textTransform="uppercase"
            textAlign={['center', null, 'left']}
            mb={4}
          >
            {t('pages.index.hero.label')}
          </Text>

          <Text
            as="h1"
            fontSize={[8, null, 12]}
            fontWeight={1}
            lineHeight={1.15}
            textAlign={['center', null, 'left']}
            mb={5}
          >
            {t('pages.index.hero.title')}
          </Text>

          <Text
            fontSize={[4, null, 5]}
            color="font.d_10"
            textAlign={['center', null, 'left']}
            maxWidth="520px"
          >
            {t('pages.index.hero.desc')}
          </Text>

          <Flex
            flexWrap="wrap"
            justifyContent={['center', null, 'flex-start']}
            gap={3}
            mt={10}
          >
            <IndexActionBtn>
              {t('pages.index.hero.primaryBtn')}
            </IndexActionBtn>

            <Button
              as="a"
              href={`#${INDEX_ANCHOR.PLANNING_POKER}`}
              variant="base-shadow"
              height="56px"
              textProps={{
                fontSize: 4,
              }}
            >
              {t('pages.index.hero.secondaryBtn')}
            </Button>
          </Flex>
        </Flex>

        <IndexScreenshot
          src="/images/chpokify-dashboard.png"
          alt={t('pages.index.hero.imgAlt')}
          ar={2472 / 1272}
          priority
        />
      </Grid>
    </IndexSection>
  );
};

export {
  IndexHero,
};
