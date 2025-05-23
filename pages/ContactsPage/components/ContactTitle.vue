<template>
    <div class="contact-title">
        <!-- Toast уведомление -->
        <div v-if="showToast" class="toast" :class="{ success: toastSuccess }">
          {{ toastMessage }}
        </div>
      <div class="container contact-wrapp">
        <div class="contact-info">
          <!-- Контактные данные -->
          <div class="info-item" v-for="(item, index) in contactItems" :key="index">
            <div class="item-img">
              <img :src="item.icon" :alt="item.title">
            </div>
            <div class="item-text">
              <h5>{{ item.title }}</h5>
              <p v-for="(text, i) in item.texts" :key="i">{{ text }}</p>
            </div>
          </div>
        </div>
        <div class="contact-form">
          <form @submit.prevent="handleSubmit">
            <!-- Поля формы -->
            <div class="input-group">
              <input
                required
                type="text"
                placeholder="Ваше имя"
                v-model="form.name"
              >
            </div>
            <div class="input-group">
              <input
                required
                type="tel"
                placeholder="Телефон"
                v-model="form.phone"
              >
            </div>
            <div class="input-group">
              <input
                required
                type="email"
                placeholder="Email"
                v-model="form.email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              >
            </div>
            <div class="input-group">
              <textarea placeholder="Комментарий" v-model="form.message"></textarea>
            </div>
            <div class="button-group">
              <ButtonComp class="submit-btn" :disabled="isLoading">
                <span v-if="!isLoading">Отправить</span>
                <span v-else class="loader"></span>
              </ButtonComp>
              <span class="consent-text">
                Оставляя заявку вы соглашаетесь с политикой обработки 
                <a href="#">персональных данных</a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ButtonComp from '../../../src/components/UI/ButtonComp.vue';
import axios from 'axios';

const isLoading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastSuccess = ref(false)

  const contactItems = [
    {
      icon: '/src/assets/img/position.svg',
      title: 'Адрес',
      texts: ['г. Ижевск']
    },
    {
      icon: '/src/assets/img/telephone.svg',
      title: 'Телефон',
      texts: ['+7(1234)-56-78-90', '+7(1234)-56-78-90']
    },
    {
      icon: '/src/assets/img/email.svg',
      title: 'Email',
      texts: ['pochta@gmail.com']
    },
    {
      icon: '/src/assets/img/clock.svg',
      title: 'Режим работы',
      texts: ['Пн-Пт с 9:00 до 19:00']
    }
  ];
  
  const form = ref({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  
  const showNotification = (message, success) => {
  toastMessage.value = message
  toastSuccess.value = success
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

  const handleSubmit = async () => {
    try {
      isLoading.value = true
      const response = await axios.post(
        'http://62.113.41.108/api/consultations',
         form.value
      );
      if(response) {
        form.value = {
        name: '',
        email: '',
        phone: '',
        message: ''
      };
        showNotification('Заявка успешно отправлена!', true)
      }
    }
    catch(error){
      console.log("Ошибка отправки заявки", error);
      showNotification('Ошибка при отправке заявки', false)
    }
    finally {
      isLoading.value = false
    }
  };
  </script>
  
  <style scoped>

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s, fadeOut 0.5s 1.5s forwards;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.success {
  background-color: #4caf50;
}

.toast:not(.success) {
  background-color: #f44336;
}

@keyframes slideIn {
  from { top: -50px; opacity: 0; }
  to { top: 20px; opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Стили для индикатора загрузки */
.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

  .contact-title {
    position: relative;
    min-height: 300px;
    padding: 80px 0;
    color: var(--primary-white-color);
  }
  
  .contact-title::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/src/assets/img/about-bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    filter: contrast(1) saturate(0) brightness(0.3);
    z-index: -1;
  }
  
  .contact-wrapp {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 40px;
    align-items: center;
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 30px;
    flex: 1;
    min-width: 300px;
  }
  
  .info-item {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  
  .item-img {
    width: 50px;
    min-width: 50px;
    height: 50px;
  }
  
  .item-img img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .item-text h5 {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .item-text p {
    font-size: 16px;
    margin: 5px 0;
  }
  
  .contact-form {
    flex: 1;
    min-width: 300px;
    max-width: 410px;
  }
  
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .input-group {
    width: 100%;
  }
  
  input, textarea {
    width: 100%;
    border: 1px solid transparent;
    border-radius: 15px;
    padding: 15px 20px;
    background-color: var(--input-bg);
    transition: all 0.2s ease-in-out;
    color: var(--primary-black-color);
    font-size: 16px;
  }
  
  input::placeholder, 
  textarea::placeholder {
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    color: var(--primary-black-color);
  }
  
  input:focus::placeholder,
  textarea:focus::placeholder {
    color: var(--primary-dark-orange);
  }
  
  input:focus, 
  textarea:focus {
    border-color: var(--primary-dark-orange);
    outline: none;
  }
  
  textarea {
    height: 120px;
    resize: none;
  }
  
  .button-group {
    display: flex;
    gap: 15px;
  }
  
  .consent-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
    text-align: left;
  }
  
  .consent-text a {
    color: var(--primary-orange-color);
    text-decoration: underline;
  }
  
  /* Адаптация для планшетов */
  @media (max-width: 992px) {
    .contact-title {
      padding: 60px 0;
    }
    
    .contact-wrapp {
      gap: 30px;
    }
    
    .contact-info {
      gap: 25px;
    }
  }
  
  /* Адаптация для мобильных устройств */
  @media (max-width: 768px) {
    .contact-title {
      padding: 40px 0;
    }
    
    .contact-wrapp {

    }
    
    .contact-info {
      width: 100%;
      min-width: auto;
    }
    
    .contact-form {
      width: 100%;
      max-width: 100%;
    }
    
    .info-item {
      gap: 15px;
    }
    
    .item-img {
      width: 40px;
      min-width: 40px;
      height: 40px;
    }
    
    input, textarea {
      padding: 12px 15px;
    }
    
    input::placeholder, 
    textarea::placeholder {
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .contact-title {
      padding: 30px 0;
    }
    
    .info-item {

    }
    
    .item-text {
      width: 100%;
    }
    
    .button-group {
      align-items: center;
      text-align: center;
    }
  }
  </style>