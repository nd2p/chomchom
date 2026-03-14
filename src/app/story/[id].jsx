import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { getComicDetails, getComicReviews, createReview } from '../../services/api/comics';

const { width } = Dimensions.get('window');

export default function StoryDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const comicId = route.params?.id;

  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'chapter', or 'review'
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  // Helper to normalize status from API
  const getStatusText = (status) => {
    if (status === 'completed') return 'Hoàn thành';
    if (status === 'ongoing') return 'Đang ra';
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchComicDetails = async () => {
      if (!comicId) {
        setLoading(false);
        return;
      }
      try {
        const [comicRes, reviewsRes] = await Promise.all([
          getComicDetails(comicId),
          getComicReviews(comicId)
        ]);
        const comicData = comicRes?.comic || comicRes;
        setComic(comicData);
        setChapters(comicData?.chapters || []);
        setReviews(reviewsRes?.comments || []);
      } catch (error) {
        console.log('Failed to fetch comic details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComicDetails();
  }, [comicId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBookmark = () => {
    // Handle bookmark
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

  const handleSubmitReview = async () => {
    if (!reviewText.trim() || reviewRating === 0) {
      return;
    }
    try {
      await createReview(comicId, reviewText, reviewRating);
      // Refresh reviews
      const reviewsRes = await getComicReviews(comicId);
      setReviews(reviewsRes?.comments || []);
      setReviewText('');
      setReviewRating(0);
    } catch (error) {
      // Handle error silently
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
          <Text style={styles.chapterTime}>{formatDate(item.updatedAt)}</Text>
        </View>
      </View>
      <View style={styles.chapterRight}>
        <Text style={styles.chapterArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  // Skip loading screen - show content directly
  // if (loading) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ActivityIndicator size="large" color={colors.primary} />
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
                <Text style={styles.ratingValue}>{String(comic?.rating?.toFixed(1) || '0.0')}</Text>
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
            <Text style={styles.statValue}>{chapters?.length || '0'}</Text>
            <Text style={styles.statLabel}>Chương</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {getStatusText(comic?.status)}
            </Text>
            <Text style={styles.statLabel}>Trạng thái</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatDate(comic?.updatedAt) || ''}</Text>
            <Text style={styles.statLabel}>Cập nhật</Text>
          </View>
        </View>

        {/* Tabs: Overview / Chapter / Review */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'chapter' && styles.tabActive]}
            onPress={() => setActiveTab('chapter')}
          >
            <Text style={[styles.tabText, activeTab === 'chapter' && styles.tabTextActive]}>
              Chapter ({chapters.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'review' && styles.tabActive]}
            onPress={() => setActiveTab('review')}
          >
            <Text style={[styles.tabText, activeTab === 'review' && styles.tabTextActive]}>
              Review
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <View style={styles.tabContent}>
            {/* Author */}
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Tác giả</Text>
              <Text style={styles.overviewValue}>{comic?.author || 'Đang cập nhật'}</Text>
            </View>

            {/* Status */}
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Trạng thái</Text>
              <Text style={styles.overviewValue}>{getStatusText(comic?.status)}</Text>
            </View>

            {/* Genres */}
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Thể loại</Text>
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

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Nội dung</Text>
              <Text
                style={styles.description}
                numberOfLines={showFullDescription ? undefined : 5}
              >
                {comic?.description || 'Đang cập nhật...'}
              </Text>
              {comic?.description && comic.description.length > 100 && (
                <TouchableOpacity
                  onPress={() => setShowFullDescription(!showFullDescription)}
                >
                  <Text style={styles.readMore}>
                    {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : activeTab === 'chapter' ? (
          <View style={styles.tabContent}>
            {/* Chapters List */}
            <View style={styles.chaptersSection}>
              <View style={styles.chaptersHeader}>
                <Text style={styles.sectionTitle}>Danh sách chương</Text>
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

              <View style={styles.chaptersList}>
                {chapters.map((item, index) => (
                  <View key={item._id || index}>
                    {renderChapter({ item, index })}
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.tabContent}>
            {/* Review Tab */}
            <View style={styles.reviewHeader}>
              <View style={styles.reviewHeaderLeft}>
                <Text style={styles.reviewTitle}>Đánh giá</Text>
                <Text style={styles.reviewStar}>★</Text>
                <Text style={styles.reviewCount}>{reviews.length}</Text>
              </View>
            </View>

            {/* Write Review */}
            <View style={styles.writeReview}>
              <View style={styles.writeReviewContent}>
                {/* Star Rating */}
                <View style={styles.starRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                      <Text style={[styles.starIcon, star <= reviewRating && styles.starIconActive]}>★</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Viết đánh giá..."
                  placeholderTextColor={colors.textMuted}
                  value={reviewText}
                  onChangeText={setReviewText}
                  multiline
                />
              </View>
              <TouchableOpacity style={styles.sendButton} onPress={handleSubmitReview}>
                <Text style={styles.sendButtonText}>Gửi</Text>
              </TouchableOpacity>
            </View>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <View style={styles.reviewsList}>
                {reviews.map((review) => (
                  <View key={review.id} style={styles.reviewItem}>
                    <Image source={{ uri: review.user.avatar }} style={styles.reviewAvatar} />
                    <View style={styles.reviewContent}>
                      <View style={styles.reviewHeaderRow}>
                        <Text style={styles.reviewUser}>{review.user.name}</Text>
                        <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                      </View>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Text key={star} style={[styles.reviewStarIcon, star <= review.rating && styles.reviewStarActive]}>★</Text>
                        ))}
                      </View>
                      <Text style={styles.reviewText}>{review.content}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.reviewPlaceholder}>Chưa có đánh giá nào</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons - Fixed at bottom - Only show on Overview */}
      {activeTab === 'overview' ? (
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.readButton}
          onPress={handleReadNow}
          activeOpacity={0.8}
        >
          <Text style={styles.readButtonIcon}>▶</Text>
          <Text style={styles.readButtonText}>Đọc ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.followButton}
          activeOpacity={0.8}
        >
          <Text style={styles.followButtonText}>+ Theo dõi</Text>
        </TouchableOpacity>
      </View>
      ) : null}

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
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
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
    paddingBottom: 20,
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  reviewSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  reviewPlaceholder: {
    fontSize: 14,
    color: colors.textMuted,
  },
  reviewHeader: {
    marginBottom: 16,
    paddingTop: 8,
  },
  reviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  reviewStar: {
    fontSize: 16,
    color: '#f59e0b',
    marginLeft: 8,
  },
  writeReview: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 8,
  },
  writeReviewContent: {
    flex: 1,
  },
  starRating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 24,
    color: colors.border,
    marginRight: 4,
  },
  starIconActive: {
    color: '#f59e0b',
  },
  reviewInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  reviewsList: {
    marginTop: 8,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewStarIcon: {
    fontSize: 12,
    color: colors.border,
    marginRight: 2,
  },
  reviewStarActive: {
    color: '#f59e0b',
  },
  reviewText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  overviewLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 2,
    textAlign: 'right',
  },
  actionSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 34,
    gap: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    marginTop: 16,
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