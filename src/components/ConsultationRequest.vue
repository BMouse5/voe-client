<template>
    <div class="consultation">
      <div class="consultation-cont container">
        <div class="consultation-title">
          <h3>Оставьте заявку на консультацию</h3>
        </div>
        <div class="consultation-form">
            <div class="form-wrapper">
                <div class="form-cont">
                    <form @submit.prevent="submitForm">
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
                    <ButtonComp class="submit-btn">Отправить</ButtonComp>
                    </form>
                </div>
                <span class="consent-text">Оставляя заявку вы соглашаетесь с политикой обработки <a>персональных данных</a></span>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import ButtonComp from '../components/UI/ButtonComp.vue'
  import { ref } from 'vue'
  
  const form = ref({
    name: '',
    phone: '',
    email: ''
  })
  
  
  const submitForm = () => {
    console.log('Форма отправлена:', form.value)
  }
  </script>
  
  <style scoped>
  .consultation {
    background-color: var(--primary-dark-gray);
    padding: clamp(60px, 10vw, 122px) 0;
  }
  
  .consultation-cont {
    display: flex;
    flex-direction: column;
    gap: clamp(20px, 3vw, 33px);
  }
  
  .consultation-title {
    font-size: clamp(18px, 4vw, 36px);
    text-align: center;
    margin: 0 auto;
  }
  
  .consultation-title h3 {
    font-family: 'Montserrat Bold';
    border-bottom: 1px solid var(--primary-orange-color);
    display: inline-block;
    padding-bottom: 10px;
  }
  
  .consultation-form {
  padding: clamp(40px, 10vw, 130px) clamp(15px, 5vw, 60px);
  background-color: var(--consultation-form-color);
  max-width: 1112px;
  border-radius: 15px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.consent-text {
    text-align: center;
    margin-top: auto;
    font-size: 14px;
    color: var(--primary-white-color);
    opacity: 0.8;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    padding-bottom: 5px;
}

.consent-text a {
  color: var(--primary-orange-color);
  text-decoration: underline;
  transition: color 0.3s ease;
}


.consent-text a:hover {
  color: var(--primary-dark-orange);
}

  
  .form-cont {
    display: flex;
    justify-content: center;
  }
  
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 86px;
    max-width: 1112px;
  }
  
  .input-group {
    width: 100%;
  }
  
  input {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--primary-white-color);
  background-color: transparent;
  color: var(--primary-white-color);
  padding: 12px 0;
  font-size: clamp(14px, 2vw, 18px);
  transition: all 0.3s ease-in-out;
  -webkit-appearance: none; /* Важно для Safari */
  border-radius: 0; /* Убираем скругления */
  outline: none;
  box-shadow: none; /* Убираем тени на iOS */
}

/* Убираем дополнительные стили на iOS */
input[type="text"],
input[type="tel"],
input[type="email"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Убираем подсветку при автозаполнении */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--primary-white-color);
  -webkit-box-shadow: 0 0 0px 1000px transparent inset;
  transition: background-color 5000s ease-in-out 0s;
}
  
  input::placeholder {
    font-size: clamp(14px, 2vw, 18px);
    color: var(--primary-white-color);
    font-family: 'Montserrat Bold';
    opacity: 0.8;
    transition: all 0.3s ease-in-out;
  }
  
  input:focus::placeholder {
    color: var(--primary-orange-color);
  }

  input:focus {
    outline: none;
    border-bottom-color: var(--primary-orange-color);
  }
  
  .submit-btn {
    margin-top: 20px;
    align-self: center;
    width: 100%;
    max-width: 200px;
  }
  
  /* Адаптация для планшетов */
  @media (min-width: 768px) {
    form {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 40px;
    }
    
    .input-group {
      width: 48%;
    }
    
    .submit-btn {
      width: auto;
      padding: 0 40px;
    }
  }

  @media (max-width: 767px) {
    form {
        gap: 20px;
    }
    .consent-text {
    padding-top: 20px;
    font-size: 12px;
  }
  input {
    border-left: none;
    border-right: none;
    border-top: none;
    /* Оставляем только нижний бордер */
  }
  
  .input-group {
    padding: 0 15px; /* Добавляем отступы по бокам */
  }
  }
  
  /* Адаптация для десктопов */
  @media (min-width: 1024px) {
    form {
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 20px;
    }
    
    .input-group {
      width: auto;
      flex-grow: 1;
    }
    
    .submit-btn {
      margin-top: 0;
      flex-shrink: 0;
    }
  }
  </style>