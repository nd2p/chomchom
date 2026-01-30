import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Reader() {
    const params = useLocalSearchParams();
    return (
        <View>
            <Text>Reader Chapter: {JSON.stringify(params)}</Text>
        </View>
    );
}
