import React from 'react';
import { Text, TextProps } from 'react-native';

import { useAppTheme } from '../theme/ThemeProvider';

type HeadingBaseProps = TextProps & {
  children: React.ReactNode;
};

const createHeading =
  (fontSize: number, lineHeight: number, fontKey: 'bold' | 'medium') =>
  ({ style, children, ...rest }: HeadingBaseProps) => {
    const { colors, fonts } = useAppTheme();
    return (
      <Text
        {...rest}
        style={[
          {
            fontSize,
            lineHeight,
            fontFamily: fonts[fontKey],
            color: colors.textPrimary,
          },
          style,
        ]}
      >
        {children}
      </Text>
    );
  };

export const H1 = createHeading(28, 34, 'bold');
export const H2 = createHeading(22, 28, 'medium');
export const H3 = createHeading(18, 24, 'medium');

export const BodyText: React.FC<HeadingBaseProps> = ({
  style,
  children,
  ...rest
}) => {
  const { colors, fonts } = useAppTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: 16,
          lineHeight: 22,
          fontFamily: fonts.regular,
          color: colors.textSecondary,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
