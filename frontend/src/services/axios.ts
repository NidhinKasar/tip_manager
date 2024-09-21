import axios from "axios";

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",  // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",  // Default content-type for all requests
  },
  withCredentials: true,  // Allow credentials like cookies or authorization headers
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Replace with your key for the token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token as Bearer
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to handle POST requests
export const postApi = async (url: string, data?: any) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error making POST request:", error);
    throw error;  // Re-throw error for further handling
  }
};

// Function to handle GET requests
export const getApi = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error making GET request:", error);
    throw error;
  }
};
