import { axiosInstance } from '../../services/api/axios';
import { endpoints } from '../../services/api/endpoints';

export async function getRecommendedComics(page = 1) {
  const response = await axiosInstance.get(endpoints.comics, {
    params: { sort: 'viewsDesc', page },
  });

  return response.data;
}

export async function getReadingHistory(page = 1) {
  const response = await axiosInstance.get(endpoints.readingHistory, {
    requiresAuth: true,
    params: { page },
  });

  return response.data;
}

export async function getComicDetails(comicId) {
  const response = await axiosInstance.get(`${endpoints.comics}/${comicId}`);
  return response.data;
}