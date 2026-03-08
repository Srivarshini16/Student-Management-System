const axios = require('axios');
const data = { name: "Test Student", rollNo: "T001", department: "CSE" };
axios.post('http://localhost:5000/students', data)
    .then(res => console.log('SUCCESS:', res.data))
    .catch(err => console.log('ERROR:', err.response?.data || err.message));
