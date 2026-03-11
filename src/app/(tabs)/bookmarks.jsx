import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingBottom: 100,
  },
  text: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default function Bookmarks() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📑 Bookmarks Tab</Text>
    </View>
  );
}
