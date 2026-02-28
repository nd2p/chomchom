import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface StoryCardProps {
  title: string;
  author: string;
  cover: string;
  rating?: number;
  chapters?: number;
  onPress?: () => void;
  variant?: 'horizontal' | 'vertical';
}

const StoryCard: React.FC<StoryCardProps> = ({
  title,
  author,
  cover,
  rating,
  chapters,
  onPress,
  variant = 'vertical',
}) => {
  const styles = variant === 'vertical' ? verticalStyles : horizontalStyles;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: cover }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {author}
        </Text>
        {chapters && <Text style={styles.meta}>{chapters} chapters</Text>}
        {rating && <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const verticalStyles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 12,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  content: {
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: '#666',
    fontFamily: fonts.regular,
  },
  meta: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontFamily: fonts.regular,
  },
  rating: {
    fontSize: 12,
    color: '#f59e0b',
    marginTop: 4,
    fontFamily: fonts.regular,
  },
});

const horizontalStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  image: {
    width: 100,
    height: 120,
    backgroundColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: fonts.regular,
  },
  meta: {
    fontSize: 11,
    color: '#999',
    fontFamily: fonts.regular,
  },
  rating: {
    fontSize: 12,
    color: '#f59e0b',
    marginTop: 4,
    fontFamily: fonts.regular,
  },
});

export default StoryCard;
