import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000'
});

export const addStudent = (data) => API.post('/students', data);
export const getStudents = (params) => API.get('/students', { params });
export const deleteStudent = (id) => API.delete(`/students/${id}`);