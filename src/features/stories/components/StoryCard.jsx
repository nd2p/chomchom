import React from 'react';
import { View, Text } from 'react-native';

export default function StoryCard({ story }) {
  return (
    <View>
      <Text>{story.title}</Text>
    </View>
  );
}
