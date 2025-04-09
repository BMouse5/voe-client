import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Базовый URL API

// Функция для получения продуктов
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    throw error; // Можно обработать ошибку в компоненте
  }
};

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`)
        return response.data
    }
    catch(error) {
        console.log("Ошибка получения категорий", error)
    }
};
