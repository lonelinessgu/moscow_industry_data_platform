// src/api/axios_api.jsx
import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // Базовый путь к вашему API
  withCredentials: true
});

// Интерсептор для добавления токена авторизации (если есть)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерсептор для обработки ошибок, например, 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.config.url === '/login') {} else{
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      window.location.reload();
    }}
    return Promise.reject(error);
  }
);