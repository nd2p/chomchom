import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '../../services/api/axios';

export async function likeComic(comicId) {
  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await axiosInstance.post(
      `/api/comics/${comicId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log('API Error:', error.response?.data || error.message);
    throw error;
  }
}

export async function getLikedComics() {
  const res = await axiosInstance.get('/api/comics/likes');
  return res.data;
}

export async function getReadingHistory() {
  const res = await axiosInstance.get('/api/reading-history');
  return res.data;
}

export const updateReadingHistory = async (comicId, chapterId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await axiosInstance.post(
      '/api/reading-history',
      {
        comicId: comicId,
        chapterId: chapterId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log('API Error:', error.response?.data || error.message);
    throw error;
  }
};

export async function deleteReadingHistory(comicId) {
  try {
    const response = await axiosInstance.delete(`/api/reading-history/${comicId}`);
    return response.data;
  } catch (error) {
    console.error('Delete reading history error:', error);
    throw error;
  }
}
