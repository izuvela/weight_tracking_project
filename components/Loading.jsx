import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Loading = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Loading;
