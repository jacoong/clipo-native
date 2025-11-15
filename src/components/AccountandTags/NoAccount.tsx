import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import NoNumberLoad from '../NoNumberLoad';
import { useAppTheme } from '../../theme/ThemeProvider';

type NoAccountProps = {
  style?: StyleProp<ViewStyle>;
};

const NoAccount: React.FC<NoAccountProps> = ({ style }) => {
  const { colors } = useAppTheme();

  return (
    <NoNumberLoad
      title="검색 결과가 없습니다."
      description="입력한 조건에 맞는 계정/태그를 찾지 못했습니다."
      containerStyle={style}
      icon={<Ionicons name="search-circle-outline" size={56} color={colors.textSecondary} />}
    />
  );
};

export default NoAccount;
