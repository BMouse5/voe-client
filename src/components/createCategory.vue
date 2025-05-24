<template>
    <div>
      <h1>Создать категорию</h1>
      <form @submit.prevent="createCategory">
        <input v-model="name" placeholder="Название категории" required />
        <textarea v-model="description" placeholder="Описание категории" required></textarea>
  
        <!-- Выбор родительской категории из выпадающего списка -->
        <select v-model="parentId">
          <option value="">Нет родительской категории</option>
          <!-- Фильтруем категории, исключая те, которые уже имеют родительскую категорию -->
          <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
  
        <button type="submit">Создать категорию</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        name: '',
        description: '',
        parentId: null, // Для подкатегории, родительский ID
        categories: [],  // Список категорий для выбора родительской категории
      };
    },
    created() {
      this.fetchCategories();  // Загружаем категории при создании компонента
    },
    computed: {
      // Фильтруем категории, исключая те, которые уже имеют родительскую категорию
      filteredCategories() {
        return this.categories.filter(category => !category.parent_id);
      },
    },
    methods: {
      // Метод для получения всех категорий с сервера
      async fetchCategories() {
        try {
          const response = await axios.get('https://voenerdgy.ru/api/categories');
          this.categories = response.data;  // Сохраняем категории в state
        } catch (error) {
          console.error('Ошибка при получении категорий:', error);
        }
      },
  
      // Метод для создания категории
      async createCategory() {
        try {
          const response = await axios.post('https://voenerdgy.ru/api/categories', {
            name: this.name,
            description: this.description,
            parent_id: this.parentId || null, // если нет parentId, то это основная категория
          });
          console.log('Категория создана:', response.data);
        } catch (error) {
          console.error('Ошибка при создании категории:', error);
        }
        finally {
          alert("Категория/подкатегория создана");
          this.name = '';
          this.description = '';
          this.parentId = null;
        }
      },
    },
  };
  </script>
  