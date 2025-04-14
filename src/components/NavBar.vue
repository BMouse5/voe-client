<template>
  <div class="nav">
    <div class="nav-wrapp container">
      <div class="logo-wrapp">
        <router-link to="/">
          <img src="../assets/img/logo.png" alt="Voe logo" class="logo-img">
        </router-link>
      </div>
      
      <!-- Бургер-меню -->
      <div class="burger" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div class="nav-content" :class="{ 'active': isMenuOpen }">
        <div class="nav-links">
          <div class="link">
            <router-link to="/">Главная</router-link>
          </div>
          <div class="link">
            <div class="dropdown">
              <router-link to="/catalog" @click="handleDropdownClick">
                Каталог продукции 
                <img src="../assets/img/arrow.png" alt="" class="arrow-img" :class="{ 'rotated': isDropdownOpen }">
              </router-link>
              <ul class="dropdown-menu" :class="{ 'open': isDropdownOpen }">
                <li 
                  v-for="category in parentCategories" 
                  :key="category.id"
                  @click="navigateToCategory(category.id)"
                >
                  {{ category.name }}
                </li>
              </ul>
            </div>
          </div>
          <div class="link">
            <router-link to="/about-us">О компании</router-link>
          </div>
          <div class="link">
            <router-link to="/contacts">Контакты</router-link>
          </div>
        </div>
        
        <div class="nav-contacts">
          <img src="../assets/img/telephone.png" alt="">
          <div class="contacts-number">
            <span>Свяжитесь с нами</span>
            <span>+7(1234)-56-78-90</span>
            <span>+7(1234)-56-78-90</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isMenuOpen = ref(false);
const isDropdownOpen = ref(false);
const isMobile = ref(window.innerWidth <= 768);

const props = defineProps({
  parentCategories: {
    type: Array,
    required: true,
    default: () => []
  }
})

const navigateToCategory = (categoryId) => {
  // Закрываем меню на мобильных устройствах
  if (isMobile.value) {
    isMenuOpen.value = false;
    isDropdownOpen.value = false;
  }
  
  // Переходим в каталог с query-параметром
  router.push({ 
    name: 'catalog', 
    query: { category: categoryId } 
  });
};

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  // Закрываем дропдаун при изменении размера, если перешли в десктопный режим
  if (!isMobile.value) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', updateIsMobile);
  document.addEventListener('click', closeDropdownOnClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile);
  document.removeEventListener('click', closeDropdownOnClickOutside);
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  // Закрываем дропдаун при закрытии меню
  if (!isMenuOpen.value) {
    isDropdownOpen.value = false;
  }
};

const handleDropdownClick = (event) => {
  if (isMobile.value) {
    event.preventDefault();
    // Только для мобильной версии - переключаем состояние по клику
    isDropdownOpen.value = !isDropdownOpen.value;
  }
  // Для десктопа ничего не делаем - работает по hover
};

const closeDropdownOnClickOutside = (event) => {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};
</script>

<style scoped>
/* Базовые стили */
.nav {
  background-color: var(--primary-black-color);
  height: 114px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1000;
}

.nav-wrapp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo-img {
  width: 135px;
  height: 74px;
  object-fit: contain;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.link a {
  color: var(--primary-white-color);
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.link a:hover {
  color: var(--primary-orange-color);
}

.link a.router-link-active {
  color: var(--primary-orange-color);
}

.arrow-img {
  margin-left: 8px;
  transition: transform 0.3s;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--primary-asphalt-gray);
  border: 1px solid var(--primary-asphalt-border);
  min-width: 200px;
  padding: 10px 0;
  display: none;
  z-index: 100;
}

/* Десктопное поведение - открытие по hover */
@media (hover: hover) and (pointer: fine) {
  .dropdown:hover .dropdown-menu {
    display: block;
  }
}

.dropdown-menu.open {
  display: block;
}

.dropdown-menu li {
  padding: 10px 20px;
  color: var(--primary-white-color);
  cursor: pointer;
  transition: all 0.3s;
}

.dropdown-menu li:hover {
  background-color: var(--primary-asphalt-border);
  color: var(--primary-orange-color);
}

.nav-contacts {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-contacts img {
  border: 1px solid var(--primary-orange-color);
  border-radius: 5px;
  padding: 9px;
  width: 33px;
  height: 33px;
}

.contacts-number {
  display: flex;
  flex-direction: column;
}

.contacts-number span {
  color: var(--primary-white-color);
  font-size: 9px;
}

.contacts-number span:nth-child(2),
.contacts-number span:nth-child(3) {
  color: var(--primary-orange-color);
  font-size: 12px;
}

/* Бургер меню */
.burger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  cursor: pointer;
  z-index: 1001;
}

.burger span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--primary-white-color);
  transition: all 0.3s;
}

.burger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.burger.active span:nth-child(2) {
  opacity: 0;
}

.burger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Адаптация */
@media (max-width: 1024px) {
  .nav-content {
    gap: 20px;
  }
  
  .nav-links {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .burger {
    display: flex;
  }
  
  .nav-content {
    position: fixed;
    top: 114px;
    left: 0;
    width: 100%;
    background-color: var(--primary-black-color);
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 30px;
    transform: translateY(-150%);
    transition: transform 0.3s;
    z-index: 999;
  }
  
  .nav-content.active {
    transform: translateY(0);
  }
  
  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 15px;
  }

  .arrow-img.rotated {
    transform: rotate(180deg);
  }
  
  .dropdown {
    width: 100%;
  }
  
  .dropdown-menu {
    display: none;
    position: static;
    width: 100%;
    border: none;
    background-color: transparent;
    padding-left: 15px;
    animation: fadeIn 0.3s ease-out;
  }
  
  .dropdown-menu.open {
    display: block;
    background-color: var(--primary-asphalt-gray);
    border: 1px solid var(--primary-asphalt-border);
  }
  
  .dropdown-menu li {
    padding: 10px 0;
    border-bottom: 1px solid var(--primary-asphalt-border);
  }
  
  .dropdown-menu li:last-child {
    border-bottom: none;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; max-height: 0; }
    to { opacity: 1; max-height: 500px; }
  }
  
  .nav-contacts {
    width: 100%;
    justify-content: flex-start;
  }
  
  .contacts-number span {
    font-size: 12px;
  }
  
  .contacts-number span:nth-child(2),
  .contacts-number span:nth-child(3) {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .nav {
    height: 80px;
  }
  
  .logo-img {
    width: 100px;
    height: 55px;
  }
  
  .nav-content {
    top: 80px;
  }
}
</style>