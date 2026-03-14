import React from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import StoryCard from './StoryCard';

const RecommendedSection = ({ comics, onStoryPress, getComicKey }) => {
  if (!comics || comics.length === 0) return null;

  return (
    <>
      <Text style={styles.sectionTitle}>Được Đề Xuất</Text>
      <FlatList
        horizontal
        data={comics}
        keyExtractor={getComicKey}
        renderItem={({ item }) => (
          <StoryCard
            title={item.title}
            author={item.author}
            cover={item.cover}
            chapters={item.chapters}
            views={item.views}
            onPress={() => onStoryPress(String(item.id))}
            variant="vertical"
          />
        )}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        nestedScrollEnabled={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  horizontalScroll: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
});

export default RecommendedSection;
