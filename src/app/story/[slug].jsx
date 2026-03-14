import { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { fonts } from '../../theme/fonts';
import { useSettings } from '../../features/settings/hooks';
import { getComicById, getComicChapters, getComicReviews } from '../../services/api/comics';
import { extractAuthorFromParentheses } from '../../utils/format';

function makeStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollView: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 16,
      backgroundColor: colors.background,
    },
    backButton: { padding: 8 },
    backText: { fontSize: 24, color: colors.text },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    moreButton: { padding: 8 },
    moreText: { fontSize: 24, color: colors.text },
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
    tabButtonActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
    tabText: { fontSize: 14, color: colors.textSecondary, fontFamily: fonts.regular },
    tabTextActive: { color: colors.primary, fontWeight: '600' },
    tabContent: { padding: 16 },
    overviewHeader: { flexDirection: 'row', marginBottom: 20 },
    coverImage: { width: 120, height: 180, borderRadius: 12, backgroundColor: colors.card },
    overviewInfo: { flex: 1, marginLeft: 16, justifyContent: 'flex-start' },
    storyTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4 },
    authorName: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
      fontFamily: fonts.regular,
    },
    genreContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    genreTag: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 4,
    },
    genreText: { fontSize: 12, color: colors.primary, fontFamily: fonts.regular },
    statusBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    statusText: { fontSize: 12, color: colors.white, fontFamily: fonts.regular },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    statItem: { alignItems: 'center' },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: { fontSize: 12, color: colors.textSecondary, fontFamily: fonts.regular },
    statDivider: { width: 1, backgroundColor: colors.border },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
      fontFamily: fonts.regular,
    },
    ratingContainer: { flexDirection: 'row', alignItems: 'center' },
    star: { marginRight: 2 },
    starFilled: { color: '#f59e0b' },
    starEmpty: { color: colors.border },
    ratingValue: { fontSize: 14, fontWeight: '600', color: colors.text, marginLeft: 4 },
    chapterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    chapterCount: { fontSize: 14, color: colors.textSecondary, fontFamily: fonts.regular },
    sortButton: { fontSize: 14, color: colors.primary, fontFamily: fonts.regular },
    chapterItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    chapterInfo: { flex: 1 },
    chapterTitle: { fontSize: 15, color: colors.text, fontFamily: fonts.regular },
    chapterRead: { color: colors.textMuted },
    chapterDate: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
      fontFamily: fonts.regular,
    },
    readBadge: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    readBadgeText: { fontSize: 11, color: colors.primary, fontFamily: fonts.regular },
    reviewSummary: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    ratingBig: { fontSize: 48, fontWeight: '700', color: colors.text, marginBottom: 8 },
    ratingCount: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      fontFamily: fonts.regular,
    },
    writeReviewContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    reviewInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      fontSize: 14,
      color: colors.text,
      maxHeight: 80,
      fontFamily: fonts.regular,
    },
    submitButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      marginLeft: 12,
    },
    submitButtonText: { color: colors.white, fontWeight: '600', fontSize: 14 },
    reviewsList: { marginTop: 8 },
    reviewTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 16 },
    reviewItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    reviewHeader: { flexDirection: 'row', marginBottom: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card },
    reviewUserInfo: { flex: 1, marginLeft: 12 },
    reviewUser: { fontSize: 14, fontWeight: '600', color: colors.text },
    reviewMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    reviewDate: {
      fontSize: 12,
      color: colors.textMuted,
      marginLeft: 8,
      fontFamily: fonts.regular,
    },
    reviewContent: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      fontFamily: fonts.regular,
    },
    reviewFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
    },
    likeButton: { flexDirection: 'row', alignItems: 'center' },
    likeIcon: { fontSize: 16, color: colors.error, marginRight: 4 },
    likeCount: { fontSize: 12, color: colors.textSecondary, fontFamily: fonts.regular },
    replyButton: { fontSize: 12, color: colors.primary, fontFamily: fonts.regular },
    bottomActions: {
      flexDirection: 'row',
      padding: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    bookmarkButton: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    bookmarkIcon: { fontSize: 24 },
    readButton: {
      flex: 1,
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    readButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });
}

const TabButton = ({ title, active, onPress, styles }) => (
  <TouchableOpacity style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{title}</Text>
  </TouchableOpacity>
);

const StarRating = ({ rating, size = 14, showValue = false, styles }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text
        key={i}
        style={[styles.star, { fontSize: size }, i <= Math.floor(rating) ? styles.starFilled : styles.starEmpty]}
      >
        ★
      </Text>,
    );
  }
  return (
    <View style={styles.ratingContainer}>
      {stars}
      {showValue && <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>}
    </View>
  );
};

const OverviewTab = ({ story, chaptersCount = 0, styles, t }) => (
  <View style={styles.tabContent}>
    <View style={styles.overviewHeader}>
      <Image source={{ uri: story.cover }} style={styles.coverImage} />
      <View style={styles.overviewInfo}>
        <Text style={styles.storyTitle}>{story.title}</Text>
        <Text style={styles.authorName}>by {story.author}</Text>
        <View style={styles.genreContainer}>
          {(story.genres || []).map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{typeof genre === 'string' ? genre : genre.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{story.status}</Text>
        </View>
      </View>
    </View>

    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{story.views.toLocaleString()}</Text>
        <Text style={styles.statLabel}>{t('story.overview.reads')}</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <StarRating rating={story.ratings} showValue styles={styles} />
        <Text style={styles.statLabel}>{story.ratingCount.toLocaleString()}</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{chaptersCount}</Text>
        <Text style={styles.statLabel}>{t('story.overview.chapters')}</Text>
      </View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('story.overview.intro')}</Text>
      <Text style={styles.description}>{story.description}</Text>
    </View>
  </View>
);

const ChapterItem = ({ chapter, onPress, styles }) => (
  <TouchableOpacity style={styles.chapterItem} onPress={onPress}>
    <View style={styles.chapterInfo}>
      <Text style={[styles.chapterTitle, chapter.isRead && styles.chapterRead]}>
        {chapter.title || `Chương ${chapter.chapterNumber}`}
      </Text>
      <Text style={styles.chapterDate}>{chapter.createdAt?.split('T')[0] || chapter.date}</Text>
    </View>
    {chapter.isRead && (
      <View style={styles.readBadge}>
        <Text style={styles.readBadgeText}>Đã đọc</Text>
      </View>
    )}
  </TouchableOpacity>
);

const ChaptersTab = ({ chapters, router, styles }) => (
  <View style={styles.tabContent}>
    <View style={styles.chapterHeader}>
      <Text style={styles.chapterCount}>{chapters.length} chương</Text>
      <TouchableOpacity>
        <Text style={styles.sortButton}>Sắp xếp ↓</Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={chapters}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChapterItem
          chapter={item}
          onPress={() => item.id && router.push(`/story/chapter/${item.id}`)}
          styles={styles}
        />
      )}
      scrollEnabled={false}
    />
  </View>
);

const ReviewItem = ({ review, styles }) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <Image
        source={{ uri: review.user?.avatar || review.avatar || 'https://i.pravatar.cc/100' }}
        style={styles.avatar}
      />
      <View style={styles.reviewUserInfo}>
        <Text style={styles.reviewUser}>{review.user?.name || review.user || 'Anonymous'}</Text>
        <View style={styles.reviewMeta}>
          <StarRating rating={review.rating || 0} size={12} styles={styles} />
          <Text style={styles.reviewDate}>{review.createdAt?.split('T')[0] || review.date}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.reviewContent}>{review.content || review.comment}</Text>
    <View style={styles.reviewFooter}>
      <TouchableOpacity style={styles.likeButton}>
        <Text style={styles.likeIcon}>♥</Text>
        <Text style={styles.likeCount}>{review.likes || review.likeCount || 0}</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.replyButton}>Trả lời</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ReviewsTab = ({ reviews, comic, styles, colors }) => (
  <View style={styles.tabContent}>
    <View style={styles.reviewSummary}>
      <Text style={styles.ratingBig}>{comic.ratings}</Text>
      <StarRating rating={comic.ratings} size={18} styles={styles} />
      <Text style={styles.ratingCount}>{comic.ratingCount.toLocaleString()} đánh giá</Text>
    </View>

    <View style={styles.writeReviewContainer}>
      <TextInput
        style={styles.reviewInput}
        placeholder="Viết đánh giá của bạn..."
        placeholderTextColor={colors.textMuted}
        multiline
      />
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Gửi</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.reviewsList}>
      <Text style={styles.reviewTitle}>Đánh giá gần đây</Text>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} styles={styles} />
      ))}
    </View>
  </View>
);

export default function StoryDetail() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const { colors } = useSettings();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [comicRes, chaptersRes, reviewsRes] = await Promise.all([
          getComicById(slug),
          getComicChapters(slug),
          getComicReviews(slug),
        ]);

        setComic(comicRes?.comic || comicRes);
        setChapters(chaptersRes?.chapters || chaptersRes || []);
        setReviews(reviewsRes?.reviews || reviewsRes || []);
      } catch (error) {
        console.log('Failed to fetch comic data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!comic) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={{ color: colors.text }}>{t('story.notFound')}</Text>
      </View>
    );
  }

  const normalizedComic = {
    id: comic?._id,
    title: comic?.title || 'N/A',
    author: extractAuthorFromParentheses(comic?.title) || 'N/A',
    cover: comic?.coverImage,
    description: comic?.description,
    genres: comic?.categories || [],
    status:
      comic?.status === 'completed' ? t('story.status.completed') : t('story.status.ongoing'),
    views: comic?.views || 0,
    ratings: comic?.averageRating || 0,
    ratingCount: comic?.totalRatings || 0,
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            story={normalizedComic}
            chaptersCount={chapters.length}
            styles={styles}
            t={t}
          />
        );
      case 'chapters':
        return <ChaptersTab chapters={chapters} router={router} styles={styles} />;
      case 'reviews':
        return (
          <ReviewsTab reviews={reviews} comic={normalizedComic} styles={styles} colors={colors} />
        );
      default:
        return (
          <OverviewTab
            story={normalizedComic}
            chaptersCount={chapters.length}
            styles={styles}
            t={t}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router && router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {normalizedComic.title}
          </Text>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreText}>⋮</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TabButton
            title={t('story.tabs.overview')}
            active={activeTab === 'overview'}
            onPress={() => setActiveTab('overview')}
            styles={styles}
          />
          <TabButton
            title={`${t('story.overview.chapters')} (${chapters.length})`}
            active={activeTab === 'chapters'}
            onPress={() => setActiveTab('chapters')}
            styles={styles}
          />
          <TabButton
            title={`${t('story.tabs.reviews')} (${reviews.length})`}
            active={activeTab === 'reviews'}
            onPress={() => setActiveTab('reviews')}
            styles={styles}
          />
        </View>

        {renderTabContent()}
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Text style={styles.bookmarkIcon}>🔖</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.readButton}
          onPress={() => router && chapters[0] && router.push(`/story/chapter/${chapters[0]._id}`)}
        >
          <Text style={styles.readButtonText}>{t('story.readContinue')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
