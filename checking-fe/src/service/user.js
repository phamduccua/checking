import request from '../utils/request';

export const getUser = async (usernameOrFullname, isFlag, limit=30, offset=0) => {
    let url = `admin/users?limit=${limit}&offset=${offset}`;
    if (usernameOrFullname) {
        url += `&usernameOrFullname=${encodeURIComponent(usernameOrFullname)}`;
    }
    if (isFlag !== undefined && isFlag !== null) {
        url += `&isFlag=${isFlag}`;
    }

    const response = await request.get(url);
    return response.data;
}

export const registerUsers = async (users) => {
  const response = await request.post("/admin/register", users);
  return response.data;
};