<template>
        <router-link to="/" class="back-link"><svg
              class="arrow-icon"
              width="16"
              height="10"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg></router-link>
    <div class="admin-login">
      <div class="login-container">
        <h1>Админ логин</h1>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              placeholder="Введите пароль администратора"
              @input="clearError"
            />
          </div>
          <button type="submit" :disabled="loading">
            {{ loading ? 'Вход...' : 'Вход' }}
          </button>
          <p v-if="error" class="error-message">Неверный пароль</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { login } from '../../src/services/api.service';
  
  const password = ref('');
  const loading = ref(false);
  const error = ref('');
  const router = useRouter();
  
  const clearError = () => {
    error.value = '';
  };
  
  const handleLogin = async () => {
    if (!password.value) {
      error.value = 'Password is required';
      return;
    }
  
    loading.value = true;
    error.value = '';
    
    try {
      const { token } = await login(password.value);
      localStorage.setItem('adminToken', token);
      router.push('/admin/dashboard');
    } catch (err) {
      error.value = typeof err === 'string' ? err : 'Invalid credentials';
      password.value = '';
    } finally {
      loading.value = false;
    }
  };
  </script>

  <style scoped>
  .admin-login {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .login-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--primary-orange-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: var(--primary-dark-orange);
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #f44336;
    margin-top: 1rem;
    text-align: center;
  }

.arrow-icon {
    transform: rotate(90deg);
}


path {
    stroke: var(--primary-black-color);
    transition: all 0.3s ease
}

.back-link {
  position: absolute;
  top: 10px;
  left: 10px;
}
  </style>