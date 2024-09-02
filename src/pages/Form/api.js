import axios from 'axios';

// Base URL for your backend API
const API_URL = 'http://localhost:3000/user'; // Adjust this URL to match your backend API

// Sign Up function
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Signup failed');
    }
};

// Login function
export const login = async (credentials) => {
    try {
        // console.log(credentials);
        const response = await axios.post(`${API_URL}/login`, credentials);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

