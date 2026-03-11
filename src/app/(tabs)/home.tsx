import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { colors } from '../../theme/colors';
import SearchBar from '../../components/ui/SearchBar';
import StoryCard from '../../components/ui/StoryCard';
import { recentlyReadStories, popularStories } from '../../utils/mockStories';
import { extractAuthorFromParentheses } from '../../utils/format';
import { getRecommendedComics } from '../../services/api/comics';
import { apiBaseURL } from '../../services/api/axios';

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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 20,
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  verticalList: {
    marginBottom: 20,
  },
  listContent: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
  },
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedComics, setRecommendedComics] = useState<any[]>([]);

  const getComicKey = (item: any, index: number) => {
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
            author: extractAuthorFromParentheses(comic?.title) || 'N/A',
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


  const handleStoryPress = (storyId: string) => {
    console.log('Story pressed:', storyId);
  };

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

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Recommend Section */}
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
        />

        {/* Recently Read Section */}
        <Text style={styles.sectionTitle}>Đọc Gần Đây</Text>
        <FlatList
          horizontal
          data={recentlyReadStories}
          keyExtractor={(item) => item.id}
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
        />

        {/* Popular Section */}
        <Text style={styles.sectionTitle}>Phổ Biến</Text>
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
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          style={styles.verticalList}
        />
      </ScrollView>
    </View>
  );
}
