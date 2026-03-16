import request from '../utils/request';

export const getReviewWebsites = async () => {
  const response = await request.get('/admin/review-webs');
  return response.data;
};

export const createReviewWebsite = async (data) => {
  const response = await request.post('/admin/review-webs', data);
  return response.data;
};

export const updateReviewWebsite = async (id, data) => {
  const response = await request.put(`/admin/review-webs/${id}`, data);
  return response.data;
};

export const deleteReviewWebsite = async (id) => {
  const response = await request.delete(`/admin/review-webs/${id}`);
  return response.data;
};
