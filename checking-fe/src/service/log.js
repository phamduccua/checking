import request from '../utils/request';

export const getStats = async (subject, startTime = null, endTime = null) => {
    let url = `admin/stats?subject=${subject}`;
    if (startTime) url += `&startTime=${encodeURIComponent(startTime)}`;
    if (endTime) url += `&endTime=${encodeURIComponent(endTime)}`;
    
    const response = await request.get(url);
    return response.data;
}

export const getFlaggedLogs = async (subject, limit=30, offset=0, startTime = null, endTime = null) => {
    let url = `admin/flagged?subject=${subject}&limit=${limit}&offset=${offset}`;
    if (startTime) url += `&startTime=${encodeURIComponent(startTime)}`;
    if (endTime) url += `&endTime=${encodeURIComponent(endTime)}`;

    const response = await request.get(url);
    return response.data;
}

export const getLogs = async (username, app, title, subject, flag, limit=30, offset=0, startTime = null, endTime = null) => {
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
    if (startTime) {
        url += `&startTime=${encodeURIComponent(startTime)}`;
    }
    if (endTime) {
        url += `&endTime=${encodeURIComponent(endTime)}`;
    }
    const response = await request.get(url);
    return response.data;
}

export const getByUsername = async (username) => {
    const response = await request.get(`admin/logs/users/${encodeURIComponent(username)}`);
    return response.data;
}

export const deleteLogsBySubject = async (subject) => {
  const response = await request.delete(
    `admin/logs/subject/${encodeURIComponent(subject)}`
  );
  return response.data;
};
