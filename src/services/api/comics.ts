import { axiosInstance } from './axios';

export async function getRecommendedComics(page = 1): Promise<any> {
  const response = await axiosInstance.get('/api/comics', {
    params: { sort: 'viewsDesc', page },
  });

  return response.data;
}
