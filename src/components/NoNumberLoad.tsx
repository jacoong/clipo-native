import React from 'react';
import { View, StyleSheet, Text, ViewStyle, StyleProp } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface NoNumberLoadProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const DefaultIcon: React.FC<{ color: string }> = ({ color }) => (
  <Ionicons name="chatbubble-ellipses-outline" size={64} color={color} />
);

const NoNumberLoad: React.FC<NoNumberLoadProps> = ({
  icon,
  title,
  description,
  containerStyle,
}) => {
  // const iconColor = isDark ? '#6b7280' : '#d1d5db'; // gray-600 / gray-300
  // const titleColor = isDark ? '#d1d5db' : '#374151'; // gray-300 / gray-700
  // const textColor = isDark ? '#9ca3af' : '#6b7280'; // gray-400 / gray-500

    const iconColor =  '#6b7280'// gray-600 / gray-300
  const titleColor =  '#d1d5db' 
  const textColor =  '#9ca3af' 

  let renderedIcon: React.ReactNode;

  if (icon && React.isValidElement<{ style?: any }>(icon)) {
    renderedIcon = React.cloneElement<{ style?: any }>(icon, {
      style: [styles.icon, icon.props?.style],
    });
  } else if (icon) {
    renderedIcon = icon;
  } else {
    renderedIcon = <DefaultIcon color={iconColor} />;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.iconWrapper}>{renderedIcon}</View>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: textColor }]}>{description}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconWrapper: {
    marginBottom: 12,
  },
  icon: {
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginTop: 4,
  },
});

export default NoNumberLoad;
