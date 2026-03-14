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

export async function getComicReviews(comicId) {
  const response = await axiosInstance.get(`/api/comments/comic/${comicId}`);
  return response.data;
}

export async function createReview(comicId, content, rating) {
  const response = await axiosInstance.post('/api/comments', {
    comic: comicId,
    content,
    rating,
  });
  return response.data;
}
