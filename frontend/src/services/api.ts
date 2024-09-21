import { getApi, postApi } from "./axios.ts";

// Axios POST request to sign up the user
import axios from 'axios';


export const signupUser = async (newUser: {
  name: string;
  email: string;
  password: string;
  image?: File | null; // Image is optional
}) => {
  // Create a FormData object to handle multipart form data
  const formData = new FormData();
  
  // Append individual fields of user_data to formData
  formData.append('name', newUser.name);
  formData.append('email', newUser.email);
  formData.append('password', newUser.password);
  
  // Append the image file to formData, if it exists
  if (newUser.image) {
    formData.append('proPic', newUser.image);
  }

  // Use Axios to make the POST request
  const response = await axios.post("http://localhost:8000/api/user", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: 'application/json',
    },
  });

  return response.data;
};


export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await axios.post("http://localhost:8000/api/user/login", {
    email,
    password,
  }); // Replace with your API URL
  return response.data;
};

export const GetAllTips = async (user_id: string, startDate?: string, endDate?: string) => {
  let query = '';
  
  if (startDate) {
    query += `&startDate=${startDate}`;
  }

  if (endDate) {
    query += `&endDate=${endDate}`;
  }
  const response = await getApi(`http://localhost:8000/api/tip${query ? '?' + query : ''}`);
  
  return response;
};


export const CalculateTip = async ( user_id: string, total_amount: string, percentage: string, place: string) => {
  const response = await postApi(`http://localhost:8000/api/tip/calculate?place=${place}&total_amount=${total_amount}&percentage=${percentage}`);
  return response;
}