import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000'
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