import { useTranslation } from 'next-i18next';
import React from 'react';

import { IndexActionBtn } from '@components/domains/Index/IndexActionBtn';
import { IndexSection } from '@components/domains/Index/IndexSection';

import { Flex } from '@components/uiKit/Flex';
import { Text } from '@components/uiKit/Text';

import { TRANS } from '@components/utils/types';

const IndexCta = (): React.ReactElement | null => {
  const { t } = useTranslation(TRANS.MAIN);

  return (
    <IndexSection>
      <Flex
        flexDirection="column"
        alignItems="center"
        px={[6, null, 12]}
        py={[10, null, 15]}
        borderRadius={5}
        bg="primary.normal"
      >
        <Text
          as="h2"
          fontSize={[7, null, 10]}
          fontWeight={1}
          color="font.invert"
          textAlign="center"
          mb={4}
        >
          {t('pages.index.cta.title')}
        </Text>

        <Text
          fontSize={[4, null, 5]}
          color="font.invert"
          textAlign="center"
          maxWidth="560px"
          mb={8}
        >
          {t('pages.index.cta.desc')}
        </Text>

        <IndexActionBtn
          variant="base"
        >
          {t('pages.index.cta.btn')}
        </IndexActionBtn>
      </Flex>
    </IndexSection>
  );
};

export {
  IndexCta,
};
