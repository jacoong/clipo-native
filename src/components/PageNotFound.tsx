import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PageNotFound: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>PageNotFound Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PageNotFound;
