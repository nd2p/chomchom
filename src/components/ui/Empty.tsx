import React from 'react';
import { View, Text } from 'react-native';

export default function Empty({ message }: { message?: string }) {
  return (
    <View>
      <Text>{message ?? 'No data'}</Text>
    </View>
  );
}
