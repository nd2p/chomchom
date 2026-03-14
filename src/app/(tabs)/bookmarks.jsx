import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FavoritesStory from '../story/favoritesStory';
import HistoryReading from '../story/historyReading';

export default function Bookmarks() {
  const [tab, setTab] = useState('favorites');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER TITLE */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tủ sách của tôi</Text>
      </View>

      {/* TAB HEADER */}
      <View style={styles.tabContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'favorites' && styles.activeTab]}
            onPress={() => setTab('favorites')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab === 'favorites' ? 'heart' : 'heart-outline'}
              size={20}
              color={tab === 'favorites' ? '#FF6B00' : '#666'}
            />
            <Text style={[styles.tabText, tab === 'favorites' && styles.activeTabText]}>
              Yêu thích
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, tab === 'history' && styles.activeTab]}
            onPress={() => setTab('history')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab === 'history' ? 'time' : 'time-outline'}
              size={20}
              color={tab === 'history' ? '#FF6B00' : '#666'}
            />
            <Text style={[styles.tabText, tab === 'history' && styles.activeTabText]}>Lịch sử</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TAB CONTENT */}
      <View style={styles.content}>
        {tab === 'favorites' ? <FavoritesStory /> : <HistoryReading />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  tabContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});
