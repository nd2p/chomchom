import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { getComicDetails } from '../../services/api/comics';

const { width } = Dimensions.get('window');

export default function StoryDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const comicId = route.params?.id;

  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const res = await getComicDetails(comicId);
        const comicData = res?.comic || res;
        setComic(comicData);
        setChapters(comicData?.chapters || []);
      } catch (error) {
        console.log('Failed to fetch comic details', error);
      } finally {
        setLoading(false);
      }
    };

    if (comicId) {
      fetchComicDetails();
    }
  }, [comicId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBookmark = () => {
    console.log('Bookmark pressed');
  };

  const handleChapterPress = (chapterId) => {
    navigation.navigate('ChapterDetail', {
      chapterId,
      comicId,
    });
  };

  const handleReadNow = () => {
    if (chapters.length > 0) {
      handleChapterPress(chapters[0]._id);
    }
  };

  const renderChapter = ({ item, index }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => handleChapterPress(item._id || item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.chapterLeft}>
        <View style={styles.chapterNumberBadge}>
          <Text style={styles.chapterNumber}>{chapters.length - index}</Text>
        </View>
        <View style={styles.chapterInfo}>
          <Text style={styles.chapterTitle}>{item.title}</Text>
          <Text style={styles.chapterTime}>{item.updatedAt}</Text>
        </View>
      </View>
      <View style={styles.chapterRight}>
        <Text style={styles.chapterArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <Text style={styles.headerButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {comic?.title || 'Chi tiết truyện'}
        </Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleBookmark}>
          <Text style={styles.bookmarkIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section with Cover */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: comic?.coverImage || comic?.cover }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Image
              source={{ uri: comic?.coverImage || comic?.cover }}
              style={styles.coverImageSmall}
            />
            <View style={styles.heroInfo}>
              <Text style={styles.title} numberOfLines={2}>
                {comic?.title}
              </Text>
              <Text style={styles.author}>{comic?.author}</Text>

              {/* Rating Stars */}
              <View style={styles.ratingRow}>
                <Text style={styles.ratingStars}>★</Text>
                <Text style={styles.ratingValue}>{comic?.rating?.toFixed(1) || '0.0'}</Text>
                <Text style={styles.ratingDivider}>|</Text>
                <Text style={styles.viewsValue}>{comic?.views?.toLocaleString() || '0'}</Text>
                <Text style={styles.viewsLabel}> lượt đọc</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{comic?.totalChapters || '0'}</Text>
            <Text style={styles.statLabel}>Chương</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {comic?.status === 'Đang ra' ? 'Đang ra' : 'Hoàn thành'}
            </Text>
            <Text style={styles.statLabel}>Trạng thái</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{comic?.updatedAt || ''}</Text>
            <Text style={styles.statLabel}>Cập nhật</Text>
          </View>
        </View>

        {/* Genres */}
        <View style={styles.genresSection}>
          <View style={styles.genresRow}>
            {comic?.genres?.map((genre, index) => (
              <View key={index} style={styles.genreBadge}>
                <Text style={styles.genreText}>
                  {typeof genre === 'string' ? genre : genre?.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.readButton} onPress={handleReadNow} activeOpacity={0.8}>
            <Text style={styles.readButtonIcon}>▶</Text>
            <Text style={styles.readButtonText}>Đọc ngay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.followButton} activeOpacity={0.8}>
            <Text style={styles.followButtonText}>+ Theo dõi</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Nội dung</Text>
          <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 3}>
            {comic?.description}
          </Text>
          {comic?.description && comic.description.length > 100 && (
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.readMore}>{showFullDescription ? 'Thu gọn' : 'Xem thêm'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Chapters List */}
        <View style={styles.chaptersSection}>
          <View style={styles.chaptersHeader}>
            <Text style={styles.sectionTitle}>Danh sách chương</Text>
            <View style={styles.chapterCountBadge}>
              <Text style={styles.chapterCount}>{chapters.length}</Text>
            </View>
          </View>

          <View style={styles.chaptersList}>
            {chapters.map((item, index) => (
              <View key={item._id || index}>{renderChapter({ item, index })}</View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primary,
    borderTopColor: 'transparent',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  headerButton: {
    padding: 12,
  },
  headerButtonText: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.text,
    lineHeight: 32,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  bookmarkIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    width: width,
    height: 280,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: 24,
  },
  coverImageSmall: {
    width: 120,
    height: 170,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroInfo: {
    flex: 1,
    marginLeft: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  author: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    fontSize: 16,
    color: '#fbbf24',
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  ratingDivider: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 8,
  },
  viewsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  viewsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  genresSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.secondary,
  },
  genreText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  readButton: {
    flex: 1.5,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  readButtonIcon: {
    fontSize: 14,
    color: colors.white,
    marginRight: 8,
  },
  readButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  followButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  descriptionSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  readMore: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  chaptersSection: {
    paddingHorizontal: 16,
  },
  chaptersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chapterCountBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  chapterCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  chaptersList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chapterNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chapterNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  chapterTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chapterRight: {
    marginLeft: 8,
  },
  chapterArrow: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: '300',
  },
  bottomSpacer: {
    height: 40,
  },
});
