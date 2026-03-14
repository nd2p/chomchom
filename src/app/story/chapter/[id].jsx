import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  FlatList,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getChaptersByComic, getChapterById } from '../../../features/chapters/api';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateReadingHistory } from '../../../features/bookmarks/api';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 64;

const COLORS = {
  primary: '#5C24C3',
  primaryLight: '#F3E8FF',
  textMain: '#111827',
  textSub: '#6B7280',
  bgOverlay: 'rgba(255,255,255,0.96)',
  bgModal: '#FFF',
  border: '#E5E7EB',
};

export default function ChapterDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const chapterId = route.params?.chapterId;
  const comicId = route.params?.comicId;

  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uiVisible, setUiVisible] = useState(true);
  const [chapterModal, setChapterModal] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [imageLoading, setImageLoading] = useState({});

  const chapterListRef = useRef(null);
  const uiAnim = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);
  const uiVisibleRef = useRef(true); // dùng ref để tránh stale closure trong handleScroll

  const sortedChapters = useMemo(
    () =>
      [...chapters].sort((a, b) =>
        sortOrder === 'asc' ? a.chapterNumber - b.chapterNumber : b.chapterNumber - a.chapterNumber
      ),
    [chapters, sortOrder]
  );

  const currentIndex = chapters.findIndex((c) => c._id === chapter?._id);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getChapterById(chapterId);
        const list = await getChaptersByComic(data.comic._id);
        if (!cancelled) {
          setChapter(data);
          setChapters(list.chapters);
        }
      } catch (err) {
        console.log('Load chapter error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [chapterId]);

  useEffect(() => {
    if (chapter && comicId && chapterId) {
      saveReading();
    }
  }, [chapter, comicId, chapterId]);

  const saveReading = async () => {
    try {
      const key = `history_${comicId}`;

      const historyData = {
        chapterId,
        updatedAt: new Date().getTime(),
      };

      await AsyncStorage.setItem(key, JSON.stringify(historyData));

      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await updateReadingHistory(comicId, chapterId);
      } else {
        console.log('Đã cập nhật lịch sử đọc offline!');
      }
    } catch (error) {
      console.log('Save history error:', error);
    }
  };

  useEffect(() => {
    if (!chapterModal || !chapterListRef.current) return;
    const idx = sortedChapters.findIndex((c) => c._id === chapter?._id);
    if (idx < 0) return;
    const timer = setTimeout(() => {
      chapterListRef.current?.scrollToIndex({ index: idx, animated: false, viewPosition: 0.5 });
    }, 120);
    return () => clearTimeout(timer);
  }, [chapterModal, sortOrder]);

  // Sync ref với state để dùng trong handleScroll không bị stale closure
  useEffect(() => {
    uiVisibleRef.current = uiVisible;
  }, [uiVisible]);

  const animateUI = (show) => {
    setUiVisible(show);
    uiVisibleRef.current = show;
    Animated.timing(uiAnim, {
      toValue: show ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  // Xử lý scroll: scroll xuống → ẩn nav, scroll lên → hiện nav
  const handleScroll = (event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    // Bỏ qua nếu scroll quá nhỏ để tránh giật
    if (Math.abs(diff) < 5) return;

    const shouldShow = diff < 0; // scroll lên → hiện

    if (shouldShow !== uiVisibleRef.current) {
      animateUI(shouldShow);
    }

    lastScrollY.current = currentY;
  };

  // Tap vẫn toggle thủ công (giữ lại tính năng cũ)
  const handleTap = () => {
    animateUI(!uiVisibleRef.current);
  };

  const handleBack = async () => {
    await saveReading();
    navigation.goBack();
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      navigation.replace('ChapterDetail', { chapterId: chapters[currentIndex - 1]._id, comicId: comicId });
    }
  };

  const goNext = () => {
    if (currentIndex < chapters.length - 1) {
      navigation.replace('ChapterDetail', { chapterId: chapters[currentIndex + 1]._id, comicId: comicId });
    }
  };

  if (loading || !chapter) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải chương...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CONTENT */}
      <ScrollView
        style={styles.contentArea}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        onScroll={handleScroll}
      >
        {(chapter.pages || []).map((page, index) => (
          <TouchableWithoutFeedback key={page.pageNumber} onPress={handleTap}>
            <View style={styles.pageContainer}>
              {imageLoading[index] && (
                <View style={styles.imageLoader}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              )}
              <Image
                source={{ uri: page.imageUrl }}
                style={styles.pageImage}
                onLoadStart={() => setImageLoading((p) => ({ ...p, [index]: true }))}
                onLoadEnd={() => setImageLoading((p) => ({ ...p, [index]: false }))}
              />
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>

      {/* HEADER */}
      <Animated.View
        style={[
          styles.headerOverlay,
          {
            opacity: uiAnim,
            transform: [{ translateY: uiAnim.interpolate({ inputRange: [0, 1], outputRange: [-80, 0] }) }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.iconText}>❮</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chương {chapter.chapterNumber}</Text>
          <TouchableOpacity onPress={() => setChapterModal(true)}>
            <Text style={styles.iconText}>☰</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* BOTTOM NAV */}
      <Animated.View
        pointerEvents={uiVisible ? 'box-none' : 'none'}
        style={[
          styles.bottomOverlay,
          {
            opacity: uiAnim,
            transform: [{ translateY: uiAnim.interpolate({ inputRange: [0, 1], outputRange: [80, 0] }) }],
          },
        ]}
      >
        <View style={styles.bottomContent}>
          <TouchableOpacity
            style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
            onPress={goPrev}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navButtonText}>❮ Trước</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === chapters.length - 1 && styles.disabledButton,
            ]}
            onPress={goNext}
            disabled={currentIndex === chapters.length - 1}
          >
            <Text style={styles.navButtonText}>Sau ❯</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* CHAPTER MODAL */}
      <Modal visible={chapterModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.modalDismissArea}
            activeOpacity={1}
            onPress={() => setChapterModal(false)}
          />
          <View style={styles.modalContent}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Danh sách chương</Text>
                <TouchableOpacity
                  onPress={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                >
                  <Text style={styles.sortText}>{sortOrder === 'asc' ? '↑' : '↓'}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                ref={chapterListRef}
                data={sortedChapters}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                onScrollToIndexFailed={(info) => {
                  setTimeout(() => {
                    chapterListRef.current?.scrollToIndex({
                      index: info.index,
                      animated: false,
                      viewPosition: 0.5,
                    });
                  }, 200);
                }}
                renderItem={({ item }) => {
                  const isActive = item._id === chapter._id;
                  return (
                    <TouchableOpacity
                      style={[styles.chapterItem, isActive && styles.chapterItemActive]}
                      onPress={() => {
                        setChapterModal(false);
                        if (!isActive) {
                          navigation.replace('ChapterDetail', { chapterId: item._id });
                        }
                      }}
                    >
                      <Text
                        style={[styles.chapterItemText, isActive && styles.chapterItemTextActive]}
                      >
                        Chương {item.chapterNumber}
                      </Text>
                      {isActive && <Text style={styles.activeIndicator}>•</Text>}
                    </TouchableOpacity>
                  );
                }}
              />
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSub,
    marginTop: 12,
    fontSize: 14,
  },
  contentArea: {
    flex: 1,
  },
  pageContainer: {
    width: width,
    minHeight: width * 1.5,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  imageLoader: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  pageImage: {
    width: width,
    height: width * 1.5,
    resizeMode: 'contain',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bgOverlay,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  headerContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  iconText: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bgOverlay,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    zIndex: 10,
  },
  bottomContent: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  disabledButton: {
    opacity: 0.4,
    backgroundColor: COLORS.border,
  },
  navButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalDismissArea: {
    flex: 1,
  },
  modalContent: {
    width: '70%',
    backgroundColor: COLORS.bgModal,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.textMain,
  },
  sortText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  chapterItem: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chapterItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  chapterItemText: {
    fontSize: 15,
    color: COLORS.textSub,
  },
  chapterItemTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  activeIndicator: {
    color: COLORS.primary,
    fontSize: 20,
  },
});