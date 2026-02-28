import React from 'react';
import { View } from 'react-native';

export default function Container({ children }: { children?: React.ReactNode }) {
  return <View style={{ paddingHorizontal: 16 }}>{children}</View>;
}
