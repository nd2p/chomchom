import { axiosInstance } from '../../services/api/axios';
import { endpoints } from '../../services/api/endpoints';

export async function getComics(params = {}) {
  const response = await axiosInstance.get(endpoints.comics, {
    params: {
      ...params,
    },
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

export async function getGenres() {
  const response = await axiosInstance.get(endpoints.genres);
  return response.data;
}
