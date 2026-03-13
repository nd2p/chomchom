import { axiosInstance } from './axios';

export async function getRecommendedComics(page = 1) {
  const response = await axiosInstance.get('/api/comics', {
    params: { sort: 'viewsDesc', page },
  });

  return response.data;
}

export async function getReadingHistory(page = 1) {
  const response = await axiosInstance.get('/api/reading-history', {
    params: { page },
  });

  return response.data;
}

export async function getComicDetails(comicId) {
  const response = await axiosInstance.get(`/api/comics/${comicId}`);
  return response.data;
}
