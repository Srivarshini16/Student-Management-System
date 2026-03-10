import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000'
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Student APIs
export const addStudent = (data) => API.post('/students', data);
export const getStudents = (params) => API.get('/students', { params });
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// Attendance APIs
export const markAttendance = (data) => API.post('/attendance', data);
export const getAttendanceReport = () => API.get('/attendance/report');
export const getStudentAttendance = (email) => API.get(`/attendance/student/${email}`);

// Message APIs
export const saveMessage = (data) => API.post('/messages', data);
export const getConversation = (user1, user2) => API.get('/messages/conversation', { params: { user1, user2 } });
export const getAnnouncements = () => API.get('/messages/announcements');
export const getContacts = (email) => API.get(`/messages/contacts/${email}`);
export const uploadFile = (formData) => API.post('/messages/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});