import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { IndexSection } from '@components/domains/Index/IndexSection';
import { IndexSectionHeader } from '@components/domains/Index/IndexSectionHeader';
import { INDEX_ANCHOR } from '@components/domains/Index/types';

import { Flex, TFlexProps } from '@components/uiKit/Flex';
import { Grid } from '@components/uiKit/Grid';
import { IconArrowRight, IconCardsOutline, IconRetro } from '@components/uiKit/Icons';
import { TIconProps } from '@components/uiKit/Icons/Icon';
import { Text } from '@components/uiKit/Text';

import { TRANS } from '@components/utils/types';

type TProduct = {
  key: string;
  anchor: INDEX_ANCHOR;
  Icon: React.FunctionComponent<TIconProps>;
};

const ProductCard = styled(Flex)<TFlexProps>`
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions[0]};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.popover};
  }
`;

const PRODUCTS: TProduct[] = [
  {
    key: 'poker',
    anchor: INDEX_ANCHOR.PLANNING_POKER,
    Icon: IconCardsOutline,
  },
  {
    key: 'retro',
    anchor: INDEX_ANCHOR.RETRO,
    Icon: IconRetro,
  },
];

const IndexProducts = (): React.ReactElement | null => {
  const { t } = useTranslation(TRANS.MAIN);

  const renderProduct = ({ key, anchor, Icon }: TProduct) => (
    <ProductCard
      key={key}
      forwardedAs="a"
      href={`#${anchor}`}
      flexDirection="column"
      p={[6, null, 8]}
      borderRadius={4}
      bg="base.normal"
      boxShadow="card"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        width="56px"
        height="56px"
        borderRadius={3}
        bg="primary.normal"
        mb={6}
      >
        <Icon
          width="32px"
          height="32px"
          fill="font.invert"
        />
      </Flex>

      <Text
        as="h3"
        fontSize={[6, null, 7]}
        fontWeight={1}
        mb={3}
      >
        {t(`pages.index.products.${key}.title`)}
      </Text>

      <Text
        fontSize={4}
        color="font.d_20"
        mb={6}
        flexGrow={1}
      >
        {t(`pages.index.products.${key}.desc`)}
      </Text>

      <Flex
        alignItems="center"
      >
        <Text
          fontSize={4}
          fontWeight={1}
          color="font.primary"
          mr={2}
        >
          {t('pages.index.products.moreLink')}
        </Text>

        <IconArrowRight
          fill="font.primary"
        />
      </Flex>
    </ProductCard>
  );

  return (
    <IndexSection>
      <IndexSectionHeader
        title={t('pages.index.products.title')}
        desc={t('pages.index.products.desc')}
      />

      <Grid
        gridGap={[4, null, 6]}
        gridTemplateColumns={[
          '1fr',
          null,
          '1fr 1fr',
        ]}
      >
        {PRODUCTS.map(renderProduct)}
      </Grid>
    </IndexSection>
  );
};

export {
  IndexProducts,
};
