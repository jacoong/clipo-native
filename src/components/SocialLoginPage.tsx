import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SocialLoginPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Social Login Placeholder</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default SocialLoginPage;
