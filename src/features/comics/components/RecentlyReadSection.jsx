import React from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import StoryCard from './StoryCard';

const RecentlyReadSection = ({ comics, isAuthenticated, onStoryPress, getComicKey }) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Đọc Gần Đây</Text>
      {!isAuthenticated ? (
        <Text style={styles.emptyMessage}>Hãy đăng nhập để xem tính năng này</Text>
      ) : comics && comics.length > 0 ? (
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
              onPress={() => onStoryPress(item.id)}
              variant="vertical"
            />
          )}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
          nestedScrollEnabled={true}
        />
      ) : (
        <Text style={styles.emptyMessage}>Chưa có lịch sử đọc</Text>
      )}
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
  emptyMessage: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
});

export default RecentlyReadSection;
