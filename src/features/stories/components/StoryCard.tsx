import React from 'react';
import { View, Text } from 'react-native';
import { Story } from '../types';

export default function StoryCard({ story }: { story: Story }) {
    return (
        <View>
            <Text>{story.title}</Text>
        </View>
    );
}
