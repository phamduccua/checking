import request from '../utils/request';

export const login = async (username, password) => {
    const response = await request.post('/admin/login', { username, password });
    return response.data;
}