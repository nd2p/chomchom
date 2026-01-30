import React from 'react';
import { View } from 'react-native';
import StoryCard from './StoryCard';

export default function StoryList({ items }: { items: any[] }) {
    return (
        <View>
            {items.map((s, i) => (
                <StoryCard key={i} story={s} />
            ))}
        </View>
    );
}
