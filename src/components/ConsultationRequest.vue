<template>
  <div class="consultation">
    <!-- Toast уведомление -->
    <div v-if="showToast" class="toast" :class="{ success: toastSuccess }">
      {{ toastMessage }}
    </div>
    
    <div class="consultation-cont container">
      <div class="consultation-title">
        <h3><slot></slot></h3>
      </div>
      <div class="consultation-form">
        <div class="form-wrapper">
          <div class="form-cont">
            <form @submit.prevent="submitForm">
              <div class="inputs-group">
                <div class="input-group">
                  <input
                    required
                    type="text"
                    placeholder="Ваше имя"
                    v-model="form.name"
                    :disabled="isLoading"
                  >
                </div>
                <div class="input-group">
                  <input
                    required
                    type="tel"
                    placeholder="Телефон"
                    v-model="form.phone"
                    :disabled="isLoading"
                  >
                </div>
                <div class="input-group">
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    v-model="form.email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    :disabled="isLoading"
                  >
                </div>
              </div>
              <div class="textarea-group">
                <textarea
                  required
                  placeholder="Комментарий"
                  v-model="form.message"
                  :disabled="isLoading"
                ></textarea>
              </div>
              <ButtonComp class="submit-btn" :disabled="isLoading">
                <span v-if="!isLoading">Отправить</span>
                <span v-else class="loader"></span>
              </ButtonComp>
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
import axios from 'axios'

const form = ref({
  name: '',
  phone: '',
  email: '',
  message: ''
})

const isLoading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastSuccess = ref(false)

const showNotification = (message, success) => {
  toastMessage.value = message
  toastSuccess.value = success
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const submitForm = async () => {
  try {
    isLoading.value = true
    
    const response = await axios.post(
      'http://localhost:3000/api/consultations',
      form.value
    )
    
    if(response) {
      form.value = {
        name: '',
        email: '',
        phone: '',
        message: ''
      }
      showNotification('Заявка успешно отправлена!', true)
    }
  } catch (error) {
    console.log("Ошибка отправки заявки", error)
    showNotification('Ошибка при отправке заявки', false)
  } finally {
    isLoading.value = false
  }
}
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
  gap: 20px;
  max-width: 1112px;
}

.inputs-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.input-group {
  width: 100%;
}

input, textarea {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--primary-white-color);
  background-color: transparent;
  color: var(--primary-white-color);
  padding: 12px 0;
  font-size: clamp(14px, 2vw, 18px);
  transition: all 0.3s ease-in-out;
  -webkit-appearance: none;
  border-radius: 0;
  outline: none;
  box-shadow: none;
  resize: none; /* Отключаем изменение размера textarea */
}

textarea {
  min-height: 100px;
  margin-top: 20px;
}

/* Убираем дополнительные стили на iOS */
input[type="text"],
input[type="tel"],
input[type="email"],
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Убираем подсветку при автозаполнении */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--primary-white-color);
  -webkit-box-shadow: 0 0 0px 1000px transparent inset;
  transition: background-color 5000s ease-in-out 0s;
}

input::placeholder,
textarea::placeholder {
  font-size: clamp(14px, 2vw, 18px);
  color: var(--primary-white-color);
  font-family: 'Montserrat Bold';
  opacity: 0.8;
  transition: all 0.3s ease-in-out;
}

input:focus::placeholder,
textarea:focus::placeholder {
  color: var(--primary-orange-color);
}

input:focus,
textarea:focus {
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
  .inputs-group {
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
  
  input,
  textarea {
    border-left: none;
    border-right: none;
    border-top: none;
  }
  
  .input-group {
    padding: 0 15px;
  }

  .textarea-group {
    padding: 0 15px;
  }
}

/* Адаптация для десктопов */
@media (min-width: 1024px) {
  .inputs-group {
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