<template>
    <div class="contact-title">
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
                v-mask="'+7(###)-###-####'"
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
              <textarea placeholder="Комментарий" v-model="form.comment"></textarea>
            </div>
            <div class="button-group">
              <ButtonComp>Отправить</ButtonComp>
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
    comment: ''
  });
  
  const handleSubmit = () => {
    // Обработка отправки формы
    console.log('Форма отправлена:', form.value);
  };
  </script>
  
  <style scoped>
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
    color: var(--primary-white-color);
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