import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import SearchBar from '../../components/ui/SearchBar';
import StoryCard from '../../features/comics/components/StoryCard';
import { popularStories } from '../../utils/mockStories';
import { getRecommendedComics, getReadingHistory } from '../../features/comics/api';
import { apiBaseURL } from '../../services/api/axios';
import { useAuth } from '../../features/auth/hooks';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarWrapper: {
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 80,
  },
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
  listContent: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
});

export default function Home() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedComics, setRecommendedComics] = useState([]);
  const [recentlyRead, setRecentlyRead] = useState([]);

  const getComicKey = (item, index) => {
    return String(item?.id ?? item?._id ?? item?.slug ?? item?.title ?? `comic-${index}`);
  };

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const res = await getRecommendedComics(1);
        const comics = res?.comics;
        const normalizedComics = Array.isArray(comics)
          ? comics.map((comic) => ({
            id: comic?._id,
            title: comic?.title || 'N/A',
            author: comic?.author || 'N/A',
            cover: comic?.coverImage,
            chapters: comic?.totalChapters,
            views: comic?.views,
          }))
          : [];

        setRecommendedComics(normalizedComics);
      } catch (error) {
        console.log('Failed to fetch recommended comics', {
          baseURL: apiBaseURL,
          error,
        });
      }
    };

    fetchComics();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setRecentlyRead([]);
      return;
    }

    const fetchReadingHistory = async () => {
      try {
        const res = await getReadingHistory(1);
        const histories = res?.histories;
        const normalizedHistories = Array.isArray(histories)
          ? histories.map((history) => ({
            id: history?._id,
            title: history?.comic?.title || 'N/A',
            author: extractAuthorFromParentheses(history?.comic?.title) || 'N/A',
            cover: history?.comic?.coverImage,
            chapters: history?.comic?.totalChapters,
            views: history?.comic?.views,
          }))
          : [];

        setRecentlyRead(normalizedHistories);
      } catch (error) {
        console.log('Failed to fetch reading history', error);
      }
    };

    fetchReadingHistory();
  }, [isAuthenticated]);

  const handleStoryPress = (storyId) => {
    navigation.navigate('StoryDetail', { id: storyId });
  };

  // Horizontal section rendered as a single list item inside the outer FlatList
  const RecommendedSection = () => (
    <>
      <Text style={styles.sectionTitle}>Được Đề Xuất</Text>
      <FlatList
        horizontal
        data={recommendedComics}
        keyExtractor={getComicKey}
        renderItem={({ item }) => (
          <StoryCard
            title={item.title}
            author={item.author}
            cover={item.cover}
            chapters={item.chapters}
            views={item.views}
            onPress={() => handleStoryPress(String(item.id))}
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

  const RecentlyReadSection = () => (
    <>
      <Text style={styles.sectionTitle}>Đọc Gần Đây</Text>
      {!isAuthenticated ? (
        <Text style={styles.emptyMessage}>Hãy đăng nhập để xem tính năng này</Text>
      ) : recentlyRead.length > 0 ? (
        <FlatList
          horizontal
          data={recentlyRead}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <StoryCard
              title={item.title}
              author={item.author}
              cover={item.cover}
              chapters={item.chapters}
              views={item.views}
              onPress={() => handleStoryPress(item.id)}
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

  const PopularHeader = () => (
    <Text style={styles.sectionTitle}>Phổ Biến</Text>
  );

  // The header contains everything above the popular list
  const ListHeader = () => (
    <>
      <RecommendedSection />
      <RecentlyReadSection />
      <PopularHeader />
    </>
  );

  return (
    <View style={styles.container}>
      {/* Sticky Search Bar */}
      <View style={styles.searchBarWrapper}>
        <SearchBar
          placeholder="Tìm kiếm truyện..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Single outer FlatList — eliminates ScrollView + FlatList nesting */}
      <FlatList
        data={popularStories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listContent}>
            <StoryCard
              title={item.title}
              author={item.author}
              cover={item.cover}
              chapters={item.chapters}
              onPress={() => handleStoryPress(item.id)}
              variant="horizontal"
            />
          </View>
        )}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      />
    </View>
  );
}