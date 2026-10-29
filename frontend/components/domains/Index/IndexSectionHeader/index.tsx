import React from 'react';

import { Flex, TFlexProps } from '@components/uiKit/Flex';
import { Text } from '@components/uiKit/Text';

export type TIndexSectionHeaderProps = TFlexProps & {
  label?: React.ReactNode;
  title: React.ReactNode;
  desc?: React.ReactNode;
};

const IndexSectionHeader = (props: TIndexSectionHeaderProps): React.ReactElement | null => {
  const {
    label,
    title,
    desc,
    ...other
  } = props;

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      maxWidth="720px"
      mx="auto"
      mb={[8, null, 12]}
      {...other}
    >
      {
        label && (
          <Text
            fontSize={2}
            fontWeight={1}
            color="font.primary"
            textTransform="uppercase"
            textAlign="center"
            mb={3}
          >
            {label}
          </Text>
        )
      }

      <Text
        as="h2"
        fontSize={[7, null, 10]}
        fontWeight={1}
        textAlign="center"
      >
        {title}
      </Text>

      {
        desc && (
          <Text
            fontSize={[4, null, 5]}
            color="font.d_20"
            textAlign="center"
            mt={4}
          >
            {desc}
          </Text>
        )
      }
    </Flex>
  );
};

export {
  IndexSectionHeader,
};
