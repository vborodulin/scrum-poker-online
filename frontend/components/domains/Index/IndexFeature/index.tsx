import React from 'react';

import { Flex, TFlexProps } from '@components/uiKit/Flex';
import { TIconProps } from '@components/uiKit/Icons/Icon';
import { Text } from '@components/uiKit/Text';

export type TIndexFeatureProps = TFlexProps & {
  Icon: React.FunctionComponent<TIconProps>;
  title: React.ReactNode;
  desc: React.ReactNode;
};

const IndexFeature = (props: TIndexFeatureProps): React.ReactElement | null => {
  const {
    Icon,
    title,
    desc,
    ...other
  } = props;

  return (
    <Flex
      as="li"
      alignItems="flex-start"
      {...other}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        width="40px"
        height="40px"
        borderRadius={2}
        bg="primary.d_40"
        mr={4}
      >
        <Icon
          fill="primary.normal"
        />
      </Flex>

      <Flex
        flexDirection="column"
      >
        <Text
          as="h3"
          fontSize={4}
          fontWeight={1}
          mb={1}
        >
          {title}
        </Text>

        <Text
          fontSize={3}
          color="font.d_20"
        >
          {desc}
        </Text>
      </Flex>
    </Flex>
  );
};

export {
  IndexFeature,
};
