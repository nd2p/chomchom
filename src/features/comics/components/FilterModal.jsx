import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

const FilterModal = ({
  visible,
  onClose,
  genres = [],
  genresLoading = false,
  selectedStatus,
  setSelectedStatus,
  selectedSort,
  setSelectedSort,
  selectedGenres = [],
  setSelectedGenres,
  onApply,
}) => {
  const handleClear = () => {
    setSelectedStatus('all');
    setSelectedSort('latest');
    setSelectedGenres([]);
  };

  const toggleGenre = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalSheet}
          activeOpacity={1}
          onPress={() => { }}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Lọc Truyện</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Status Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Trạng thái</Text>
              <View style={styles.optionsRow}>
                {[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Hoàn thành', value: 'completed' },
                  { label: 'Đang ra', value: 'ongoing' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.optionChip,
                      selectedStatus === item.value && styles.optionChipSelected,
                    ]}
                    onPress={() => setSelectedStatus(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedStatus === item.value && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Xếp theo</Text>
              <View style={styles.optionsRow}>
                {[
                  { label: 'Ngày cập nhật', value: 'latest' },
                  { label: 'Lượt xem', value: 'viewsDesc' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.optionChip,
                      selectedSort === item.value && styles.optionChipSelected,
                    ]}
                    onPress={() => setSelectedSort(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedSort === item.value && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Genre Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Thể loại</Text>
              {genresLoading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <View style={styles.optionsRow}>
                  {genres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre._id);
                    return (
                      <TouchableOpacity
                        key={genre._id}
                        style={[
                          styles.optionChip,
                          isSelected && styles.optionChipSelected,
                        ]}
                        onPress={() => toggleGenre(genre._id)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {genre.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerBtn, styles.clearBtn]}
              onPress={handleClear}
            >
              <Text style={styles.clearBtnText}>Xoá</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerBtn, styles.confirmBtn]}
              onPress={onApply}
            >
              <Text style={styles.confirmBtnText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    backgroundColor: '#f3f4f6',
  },
  confirmBtn: {
    backgroundColor: colors.primary,
  },
  clearBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4b5563',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default FilterModal;
