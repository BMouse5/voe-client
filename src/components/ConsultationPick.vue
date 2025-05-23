<template>
    <div class="consultation-form">
      <h2>Оставить заявку</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Ваше имя:</label>
          <input 
            v-model="form.name" 
            type="text" 
            required
            placeholder="Иван Иванов"
          >
        </div>
  
        <div class="form-group">
          <label>Email:</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            placeholder="example@mail.com"
          >
        </div>
  
        <div class="form-group">
          <label>Телефон:</label>
          <input 
            v-model="form.phone" 
            type="tel"
            placeholder="+7 (999) 123-45-67"
          >
        </div>
  
        <div class="form-group">
          <label>Ваш вопрос:</label>
          <textarea 
            v-model="form.message" 
            required
            placeholder="Опишите ваш вопрос..."
          ></textarea>
        </div>
  
        <button type="submit" :disabled="loading">
          {{ loading ? 'Отправка...' : 'Отправить заявку' }}
        </button>
  
        <div v-if="message.text" :class="['alert', message.type]">
          {{ message.text }}
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        form: {
          name: '',
          email: '',
          phone: '',
          message: ''
        },
        loading: false,
        message: {
          text: '',
          type: '' // 'success' или 'error'
        }
      };
    },
    methods: {
      async submitForm() {
        this.loading = true;
        this.message.text = '';
  
        try {
          const response = await axios.post(
            'http://127.0.0.1:3000/api/consultations',
            this.form
          );
          
          this.message = {
            text: 'Ваша заявка успешно отправлена!',
            type: 'success'
          };
          
          // Очищаем форму
          this.form = {
            name: '',
            email: '',
            phone: '',
            message: ''
          };
          
        } catch (error) {
          this.message = {
            text: error.response?.data?.error || 'Ошибка при отправке формы',
            type: 'error'
          };
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .consultation-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  input, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
  
  button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    transition: background 0.3s;
  }
  
  button:hover {
    background: #45a049;
  }
  
  button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
  
  .alert {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
  }
  
  .alert.success {
    background: #d4edda;
    color: #155724;
  }
  
  .alert.error {
    background: #f8d7da;
    color: #721c24;
  }
  </style>