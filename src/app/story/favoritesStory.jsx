import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { getLikedComics } from '../../features/bookmarks/api';
import StoryCard from '../../features/comics/components/StoryCard';

const { width } = Dimensions.get('window');
const columnWidth = (width - 32) / 2;

export default function FavoriteReading() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
        const res = await getLikedComics();
        setData(res);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log('Lỗi API truyện yêu thích:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={{ marginTop: 10 }}>Đang tải truyện yêu thích...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <Text style={styles.messageText}>Bạn cần đăng nhập để xem truyện đang theo dõi.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 10 }}
      columnWrapperStyle={styles.row}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.messageText}>Bạn chưa theo dõi bộ truyện nào.</Text>
        </View>
      }
      renderItem={({ item }) => {
        const comic = item.comic;
        if (!comic) return null;

        return (
          <View style={styles.cardWrapper}>
            <StoryCard
              title={comic.title}
              author={comic.author}
              cover={comic.coverImage || comic.cover}
              views={comic.views}
              chapters={comic.totalChapters}
              variant="vertical"
              onPress={() => navigation.navigate('StoryDetail', { id: comic._id })}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    position: 'relative',
    width: columnWidth,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
  unlikeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
