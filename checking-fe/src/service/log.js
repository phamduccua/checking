import request from '../utils/request';

export const getStats = async (subject) => {
    try{
        const response = await request.get(`admin/stats?subject=${subject}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getFlaggedLogs = async (subject, limit=30, offset=0) => {
    try {
        const response = await request.get(`admin/flagged?subject=${subject}&limit=${limit}&offset=${offset}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getLogs = async (username, app, title, subject, flag, limit=30, offset=0) => {
    try {
        let url = `admin/logs?limit=${limit}&offset=${offset}`;
        if (username) {
            url += `&username=${encodeURIComponent(username)}`;
        }
        if (app) {
            url += `&app=${encodeURIComponent(app)}`;
        }
        if (title) {
            url += `&title=${encodeURIComponent(title)}`;
        }
        if (subject) {
            url += `&subject=${subject}`;
        }
        if (flag) {
            url += `&flag=${encodeURIComponent(flag)}`;
        }
        const response = await request.get(url);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getByUsername = async (username) => {
    try {
        const response = await request.get(`admin/logs/users/${encodeURIComponent(username)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteLogsBySubject = async (subject) => {
  const response = await request.delete(
    `admin/logs/subject/${encodeURIComponent(subject)}`
  );
  return response.data;
};
