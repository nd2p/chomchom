import React from 'react';
import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function StoryDetail() {
    const params = useLocalSearchParams();
    return (
        <View>
            <Text>Story Detail: {JSON.stringify(params)}</Text>
        </View>
    );
}
