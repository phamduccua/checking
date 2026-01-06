import request from '../utils/request';

export const login = async (username, password) => {
    try{
        const response = await request.post('/admin/login', { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
}