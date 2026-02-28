import React from 'react';
import { View } from 'react-native';
import StoryCard from './StoryCard';

interface Story {
  id: string;
  title: string;
}

export default function StoryList({ items }: { items: Story[] }) {
  return (
    <View>
      {items.map((s, i) => (
        <StoryCard key={i} story={s} />
      ))}
    </View>
  );
}
