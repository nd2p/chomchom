import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { getReadingHistory, removeReadingHistory } from '../../features/bookmarks/api';
import StoryCard from '../../features/comics/components/StoryCard';
import { useSettings } from '../../features/settings/hooks';

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
    deleteButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: 'rgba(255, 23, 68, 0.9)',
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    deleteButtonText: {
      color: colors.white,
      fontSize: 10,
      fontWeight: '700',
    },
  });
}

export default function HistoryReading() {
  const navigation = useNavigation();
  const { colors } = useSettings();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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
        const res = await getReadingHistory();
        setData(res);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log('Lỗi khi gọi API lịch sử:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (comicId, comicTitle) => {
    Alert.alert(
      t('history.deleteTitle'),
      t('history.deleteConfirm', { title: comicTitle }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('history.deleteButton'),
          style: 'destructive',
          onPress: async () => {
            try {
              await removeReadingHistory(comicId);
              setData((prevData) => prevData.filter((item) => item.comic._id !== comicId));
            } catch (error) {
              Alert.alert(t('common.error'), t('history.deleteError'));
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.messageText, { marginTop: 10 }]}>{t('history.loading')}</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <Text style={styles.messageText}>{t('history.loginRequired')}</Text>
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
          <Text style={styles.messageText}>{t('history.empty')}</Text>
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
              chapters={
                item.chapter?.chapterNumber
                  ? t('history.readContinue', { chapter: item.chapter.chapterNumber })
                  : t('history.startReading')
              }
              variant="vertical"
              onPress={() => navigation.navigate('StoryDetail', { id: comic._id })}
            />

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(comic._id, comic.title)}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>{t('history.deleteButton')}</Text>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}
