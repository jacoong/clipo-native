import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import NoNumberLoad from '../NoNumberLoad';
import { useAppTheme } from '../../theme/ThemeProvider';

type NoTagsProps = {
  style?: StyleProp<ViewStyle>;
};

const NoTags: React.FC<NoTagsProps> = ({ style }) => {
  const { colors } = useAppTheme();

  return (
    <NoNumberLoad
      title="태그 결과가 없습니다."
      description="입력한 조건에 맞는 태그를 찾지 못했습니다."
      containerStyle={style}
      icon={<Ionicons name="pricetags-outline" size={56} color={colors.textSecondary} />}
    />
  );
};

export default NoTags;
