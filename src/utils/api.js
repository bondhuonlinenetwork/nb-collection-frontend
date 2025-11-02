import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // change to your backend URL

});
export { api };