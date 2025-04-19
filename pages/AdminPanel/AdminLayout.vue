<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-content">
        <h1>Панель администратора</h1>
        <button @click="handleLogout" class="logout-btn">Выход</button>
      </div>
      <nav class="admin-nav">
        <router-link to="/admin/dashboard">Главная</router-link>
        <router-link to="/admin/products">Товары</router-link>
        <router-link to="/admin/categories">Категории</router-link>
      </nav>
    </header>
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { logout } from '../../src/services/api.service';

const router = useRouter();

const handleLogout = async () => {
  try {
    await logout();
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
    window.location.reload();
  } catch (error) {
    console.error('Logout failed:', error);
    router.push('/admin/login');
  }
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.admin-nav {
  background-color: #34495e;
  padding: 0.5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.admin-nav a {
  color: white;
  text-decoration: none;
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.admin-nav a:hover {
  background-color: #3d566e;
}

.admin-nav a.router-link-exact-active {
  background-color: #4CAF50;
}

.admin-main {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>