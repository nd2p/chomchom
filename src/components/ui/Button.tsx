import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function Button({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
