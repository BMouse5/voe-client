// api.service.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';



// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем interceptor для автоматической вставки токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Методы авторизации
export const login = async (password) => {
  try {
    const response = await api.post('/auth/login', { password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

// api.service.js
export const logout = async () => {
  try {
    // Добавляем очистку токена на клиенте в любом случае
    localStorage.removeItem('adminToken');
    
    // Отправляем запрос на сервер
    const response = await api.post('/auth/logout');
    return true;
  } catch (error) {
    // Даже если серверный logout не удался, очищаем токен на клиенте
    localStorage.removeItem('adminToken');
    throw error.response?.data?.error || 'Logout failed';
  }
};

export const validateToken = async () => {
  try {
    await api.get('/admin/dashboard');
    return true;
  } catch (error) {
    return false;
  }
};

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

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении продукта:', error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании продукта:', error);
    throw error.response?.data?.error || 'Ошибка при создании продукта';
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении продукта:', error);
    throw error.response?.data?.error || 'Ошибка при обновлении продукта';
  }
};

// Метод для удаления продукта
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении продукта:', error);
    throw error.response?.data?.error || 'Ошибка при удалении продукта';
  }
};

export const fetchCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении категории:', error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании категории:', error);
    throw error.response?.data?.error || 'Ошибка при создании категории';
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error);
    throw error.response?.data?.error || 'Ошибка при обновлении категории';
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    throw error.response?.data?.error || 'Ошибка при удалении категории';
  }
};

export const fetchChildCategories = async (parentId) => {
  try {
    const response = await api.get(`/categories/children/${parentId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении подкатегорий:', error);
    throw error;
  }
};

export const fetchCategoryProductsCount = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}/products/count`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении количества товаров:', error);
    throw error;
  }
};