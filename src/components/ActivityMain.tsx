import React from 'react';
import { View, Text, StyleSheet,Platform,KeyboardAvoidingView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const ActivityMain: React.FC = () => {
    const insets = useSafeAreaInsets();
    const bottomPadding = Math.max(insets.bottom, 24);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? bottomPadding : 0}
    >
      <View    style={styles.top}>

      </View>
      <View    style={styles.in}>
      <TextInput></TextInput>
      </View>

      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor:'yellow'
  },
  in:{
    width:'100%',
    backgroundColor:'blue'
  },
    top:{
    height:50,
    width:'100%',
    backgroundColor:'green'
  }
});

export default ActivityMain;
