import React from 'react';
import { View } from 'react-native';
import StoryCard from './StoryCard';

export default function StoryList({ items }) {
  return (
    <View>
      {items.map((s, i) => (
        <StoryCard key={i} story={s} />
      ))}
    </View>
  );
}
