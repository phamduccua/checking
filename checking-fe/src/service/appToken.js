import request from '../utils/request';

export const getAppToken = async () => {
  const response = await request.get('/admin/app-tokens');
  return response.data;
};

export const updateAppToken = async (data) => {
  const response = await request.put('/admin/app-tokens', data);
  return response.data;
};
