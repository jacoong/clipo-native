import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UpdatePassword: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>UpdatePassword Component</Text>
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

export default UpdatePassword;
