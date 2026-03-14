import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ActivityIndicator, View, Text, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { getLikedComics } from '../../features/bookmarks/api';
import StoryCard from '../../features/comics/components/StoryCard';
import { useSettings } from '../../features/settings/hooks';
import { useAuth } from '../../features/auth/hooks';

const { width } = Dimensions.get('window');
const columnWidth = (width - 32) / 2;

function makeStyles(colors) {
  return StyleSheet.create({
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
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 10,
    },
  });
}

export default function FavoriteReading() {
  const navigation = useNavigation();
  const { colors } = useSettings();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { isAuthenticated } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        setData([]);
        setLoading(false);
        return;
      }

      loadData();
    }, [isAuthenticated])
  );

  const loadData = async () => {
    setLoading(true);

    try {
      const res = await getLikedComics();
      setData(res || []);
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
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.messageText, { marginTop: 10 }]}>{t('favorites.loading')}</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Text style={styles.messageText}>{t('favorites.loginRequired')}</Text>
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
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      removeClippedSubviews
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.messageText}>{t('favorites.empty')}</Text>
        </View>
      }
      renderItem={({ item }) => {
        const comic = item?.comic;
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
