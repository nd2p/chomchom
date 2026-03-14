import { axiosInstance } from '../../services/api/axios';

export async function getChaptersByComic(comicId) {
  const response = await axiosInstance.get(`api/chapters/comic/${comicId}`);
  return response.data;
}

export async function getChapterById(chapterId) {
  const response = await axiosInstance.get(`/api/chapters/${chapterId}`);
  return response.data;
}
