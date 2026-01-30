import React from 'react';
import { View, Text } from 'react-native';

export default function ReaderView({ content }: { content?: string }) {
    return (
        <View>
            <Text>{content ?? 'Chapter content'}</Text>
        </View>
    );
}
