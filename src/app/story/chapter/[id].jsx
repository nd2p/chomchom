import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { getChaptersByComic, getChapterById } from '../../../features/chapters/api';
import { useRoute, useNavigation } from '@react-navigation/native';

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

  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uiVisible, setUiVisible] = useState(true);
  const [chapterModal, setChapterModal] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');

  const [imageLoading, setImageLoading] = useState({});

  const lastTap = useRef(null);
  const chapterListRef = useRef(null);

  // SORT CHAPTERS
  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) =>
      sortOrder === 'asc' ? a.chapterNumber - b.chapterNumber : b.chapterNumber - a.chapterNumber
    );
  }, [chapters, sortOrder]);

  const currentChapterIndex = sortedChapters.findIndex((c) => c._id === chapter?._id);

  // LOAD CHAPTER
  useEffect(() => {
    loadChapter();
  }, [chapterId]);

  const loadChapter = async () => {
    try {
      setLoading(true);

      const data = await getChapterById(chapterId);
      const list = await getChaptersByComic(data.comic._id);

      setChapter(data);
      setChapters(list.chapters);
    } catch (err) {
      console.log('Load chapter error:', err);
    } finally {
      setLoading(false);
    }
  };

  // SCROLL TO CURRENT CHAPTER
  const scrollToCurrentChapter = useCallback(() => {
    if (!chapterListRef.current || currentChapterIndex < 0) return;

    chapterListRef.current.scrollToIndex({
      index: currentChapterIndex,
      animated: false,
      viewPosition: 0.5,
    });
  }, [currentChapterIndex]);

  useEffect(() => {
    if (chapterModal) {
      setTimeout(scrollToCurrentChapter, 120);
    }
  }, [chapterModal, sortOrder]);

  // DOUBLE TAP
  const handleDoubleTap = () => {
    const now = Date.now();

    if (lastTap.current && now - lastTap.current < 300) {
      setUiVisible((v) => !v);
    }

    lastTap.current = now;
  };

  // NAVIGATION
  const goPrev = () => {
    const index = chapters.findIndex((c) => c._id === chapter._id);
    if (index > 0) navigation.replace('ChapterDetail', { chapterId: chapters[index - 1]._id });
  };

  const goNext = () => {
    const index = chapters.findIndex((c) => c._id === chapter._id);
    if (index < chapters.length - 1)
      navigation.replace('ChapterDetail', { chapterId: chapters[index + 1]._id });
  };

  // RENDER PAGE
  const renderPage = ({ item, index }) => (
    <View style={styles.pageContainer}>
      {imageLoading[index] && (
        <View style={styles.imageLoader}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}

      <Image
        source={{ uri: item.imageUrl }}
        style={styles.pageImage}
        onLoadStart={() => setImageLoading((p) => ({ ...p, [index]: true }))}
        onLoadEnd={() => setImageLoading((p) => ({ ...p, [index]: false }))}
      />
    </View>
  );

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
      <Pressable style={styles.contentArea} onPress={handleDoubleTap}>
        <FlatList
          data={chapter.pages || []}
          keyExtractor={(item) => item.pageNumber.toString()}
          renderItem={renderPage}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
          showsVerticalScrollIndicator={false}
        />
      </Pressable>

      {/* HEADER */}
      {uiVisible && (
        <View style={styles.headerOverlay}>
          <SafeAreaView>
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.iconText}>❮</Text>
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Chương {chapter.chapterNumber}</Text>

              <TouchableOpacity onPress={() => setChapterModal(true)}>
                <Text style={styles.iconText}>☰</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      )}

      {/* BOTTOM NAV */}
      {uiVisible && (
        <View style={styles.bottomOverlay}>
          <View style={styles.bottomContent}>
            <TouchableOpacity
              style={[
                styles.navButton,
                chapters.findIndex((c) => c._id === chapter._id) === 0 && styles.disabledButton,
              ]}
              onPress={goPrev}
            >
              <Text style={styles.navButtonText}>❮ Trước</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                chapters.findIndex((c) => c._id === chapter._id) === chapters.length - 1 &&
                  styles.disabledButton,
              ]}
              onPress={goNext}
            >
              <Text style={styles.navButtonText}>Sau ❯</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* CHAPTER MODAL */}
      <Modal visible={chapterModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.modalDismissArea} onPress={() => setChapterModal(false)} />

          <View style={styles.modalContent}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Danh sách chương</Text>

                <TouchableOpacity
                  style={styles.sortButton}
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
                getItemLayout={(data, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                onScrollToIndexFailed={(info) =>
                  setTimeout(() => {
                    chapterListRef.current?.scrollToIndex({
                      index: info.index,
                      animated: false,
                      viewPosition: 0.5,
                    });
                  }, 200)
                }
                renderItem={({ item }) => {
                  const isActive = item._id === chapter._id;

                  return (
                    <TouchableOpacity
                      style={[styles.chapterItem, isActive && styles.chapterItemActive]}
                      onPress={() => {
                        setChapterModal(false);

                        if (!isActive)
                          navigation.replace('ChapterDetail', {
                            chapterId: item._id,
                          });
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

  // -- OVERLAY STYLES --
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
  iconButton: {
    padding: 10,
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

  // -- MODAL STYLES --
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
