<template>
    <div class="footer">
      <div class="footer-cont container">
        <div class="footer-wrapper">
          <div class="footer-logo">
            <img src="../assets/img/logo.png" alt="Логотип">
          </div>
          <div class="footer-links footer-card">
            <h4>Каталог</h4>
            <div class="footer-links">
              <a href="">Центробежные шламовые насосы</a>
              <a href="">Центробежные шламовые насосы</a>
              <a href="">Центробежные шламовые насосы</a>
              <a href="">Центробежные шламовые насосы</a>
              <a href="">Центробежные шламовые насосы</a>
            </div>
          </div>
          <div class="footer-links">
            <h4>Меню</h4>
            <div class="footer-links">
              <router-link to="/">Главная</router-link>
              <router-link to="/catalog">Каталог продукции</router-link>
              <router-link to="/about-us">О компании</router-link>
              <router-link to="/contacts">Контакты</router-link>
            </div>
          </div>
          <div class="footer-links">
            <h4>Контакты</h4>
            <div class="footer-links">
              <div class="link-title">
                <img src="../assets/img/telephone.png" alt="Телефон">
                <div class="link-description">
                  <span>+7(1234)-56-78-90</span>
                  <span>+7(1234)-56-78-90</span>
                </div>
              </div>
              <div class="link-title">
                <img src="../assets/img/email.png" alt="Email">
                <span>pochta@gmail.com</span>
              </div>
              <div class="link-title">
                <img src="../assets/img/position.png" alt="Адрес">
                <span>г. Ижевск</span>
              </div>
              <div class="link-title">
                <img src="../assets/img/clock.png" alt="Часы работы">
                <span>Пн.-Пт. с 9:00-18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FooterComponent'
  }
  </script>
  
  <style scoped>
  .footer {
    background-color: var(--primary-black-color);
    padding: clamp(40px, 5vw, 71px) 0;
    color: var(--primary-white-color);
  }
  
  .footer-cont {
    display: flex;
    align-items: center;
  }
  
  .footer-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    width: 100%;
    max-width: 1150px;
    margin: 0 auto;
  }
  
  .footer-logo {
    max-width: 197px;
    height: auto;
    display: flex;
  }
  
  .footer-logo img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  
  h4 {
    font-size: clamp(14px, 1.2vw, 15px);
    margin-bottom: 15px;
    font-weight: 700;
  }
  
  .footer-card {
    display: flex;
    flex-direction: column;
    gap: 13px;
  }
  
  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  
  .footer-links a {
    color: var(--primary-white-color);
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: clamp(12px, 1vw, 14px);
  }
  
  .footer-links a:hover {
    color: var(--primary-orange-color);
  }
  
  .link-title {
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: clamp(12px, 1vw, 14px);
  }
  
  .link-title img {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }
  
  .link-description {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  /* Мобильная адаптация */
  @media (max-width: 768px) {
    .footer-wrapper {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  
    .footer-logo {
      max-width: 150px;
      margin: 0 auto 20px;
    }
  
    .footer-links {
      text-align: center;
    }
  
    .link-title {
      justify-content: center;
    }
  
    .footer-card {
      align-items: center;
    }
  }
  
  /* Планшетная адаптация */
  @media (min-width: 769px) and (max-width: 1024px) {
    .footer-wrapper {
      grid-template-columns: repeat(2, 1fr);
    }
  
    .footer-logo {
      grid-column: span 2;
      margin: 0 auto 30px;
    }
  }
  </style>