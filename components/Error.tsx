import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const Error = () => {
  return (
    <View style={styles.error}>
      <Text>Error loading data</Text>
    </View>
  );
};

export default Error;

const styles = StyleSheet.create({
  error: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
