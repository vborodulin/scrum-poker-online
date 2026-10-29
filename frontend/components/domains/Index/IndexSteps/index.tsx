import { useTranslation } from 'next-i18next';
import React from 'react';

import { IndexSection } from '@components/domains/Index/IndexSection';
import { IndexSectionHeader } from '@components/domains/Index/IndexSectionHeader';

import { Flex } from '@components/uiKit/Flex';
import { Grid } from '@components/uiKit/Grid';
import { Text } from '@components/uiKit/Text';

import { TRANS } from '@components/utils/types';

const STEPS = ['space', 'invite', 'session'];

const IndexSteps = (): React.ReactElement | null => {
  const { t } = useTranslation(TRANS.MAIN);

  return (
    <IndexSection
      bg="base.normal"
    >
      <IndexSectionHeader
        title={t('pages.index.steps.title')}
      />

      <Grid
        as="ol"
        gridGap={[6, null, 8]}
        gridTemplateColumns={[
          '1fr',
          null,
          'repeat(3, 1fr)',
        ]}
      >
        {STEPS.map((step, idx) => (
          <Flex
            key={step}
            as="li"
            flexDirection="column"
            alignItems={['center', null, 'flex-start']}
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              width="48px"
              height="48px"
              borderRadius={9}
              bg="primary.normal"
              mb={4}
            >
              <Text
                fontSize={5}
                fontWeight={1}
                color="font.invert"
              >
                {idx + 1}
              </Text>
            </Flex>

            <Text
              as="h3"
              fontSize={5}
              fontWeight={1}
              textAlign={['center', null, 'left']}
              mb={2}
            >
              {t(`pages.index.steps.${step}.title`)}
            </Text>

            <Text
              fontSize={4}
              color="font.d_20"
              textAlign={['center', null, 'left']}
            >
              {t(`pages.index.steps.${step}.desc`)}
            </Text>
          </Flex>
        ))}
      </Grid>
    </IndexSection>
  );
};

export {
  IndexSteps,
};
