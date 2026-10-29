import React from 'react';

import { Box, TBoxProps } from '@components/uiKit/Box';
import { BoxAr } from '@components/uiKit/BoxAr';
import { Image } from '@components/uiKit/Image';

export type TIndexScreenshotProps = TBoxProps & {
  src: string;
  alt: string;
  ar: number;
  priority?: boolean;
};

const IndexScreenshot = (props: TIndexScreenshotProps): React.ReactElement | null => {
  const {
    src,
    alt,
    ar,
    priority,
    ...other
  } = props;

  return (
    <Box
      borderRadius={3}
      overflow="hidden"
      boxShadow="modal"
      bg="base.normal"
      {...other}
    >
      <BoxAr
        ar={ar}
      >
        <Image
          src={src}
          alt={alt}
          priority={priority}
        />
      </BoxAr>
    </Box>
  );
};

export {
  IndexScreenshot,
};
