import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000' // Replace with your base URL
});

export default instance;