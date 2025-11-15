import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EmailAuthentication: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Email Authentication Placeholder</Text>
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

export default EmailAuthentication;
