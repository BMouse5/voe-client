<template>
    <div class="garanties">
      <div class="garanties-wrapp container">
        <div class="garanties-title">
          <h2>Мы гарантируем вам</h2>
        </div>
        <div class="garanties-cards">
          <div class="cards-wrapp">
            <div class="card">
              <div class="card-title">
                <img src="../../../src/assets/img/quality.png" alt="Качество">
                <h4>Качество</h4>
              </div>
              <div class="card-description">
                <p>Мы гарантируем качество нашей продукции и услуг</p>
              </div>
            </div>
            <div class="card">
              <div class="card-title">
                <img src="../../../src/assets/img/assoriment.png" alt="Ассортимент">
                <h4>Ассортимент</h4>
              </div>
              <div class="card-description">
                <p>Мы предлагаем клиентам широкий выбор товара</p>
              </div>
            </div>
            <div class="card">
              <div class="card-title">
                <img src="../../../src/assets/img/experience.png" alt="Опыт">
                <h4>Опыт</h4>
              </div>
              <div class="card-description">
                <p>Наш опыт работы позволяет выполнять работу в лучшем виде</p>
              </div>
            </div>
            <div class="card">
              <div class="card-title">
                <img src="../../../src/assets/img/effect.png" alt="Эффективность">
                <h4>Эффективность</h4>
              </div>
              <div class="card-description">
                <p>Выполняем работу в кратчайшие сроки</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .garanties {
    background-color: var(--about-us-apshalt);
    color: var(--primary-white-color);
  }
  
  .garanties-wrapp {
    padding: 0 20px;
  }
  
  .garanties-title {
    display: inline-block;
    padding: 56px 0;
  }
  
  .garanties-title h2 {
    border-bottom: 1px solid var(--primary-orange-color);
    font-size: clamp(18px, 4vw, 42px);
    text-transform: uppercase;
    padding-bottom: 8px;
    margin: 0;
  }
  
  .cards-wrapp {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    padding-bottom: 60px;
  }
  
  .card {
    border: 4px solid var(--about-us-border);
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: all 0.3s ease;
    max-width: 100%;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: var(--primary-orange-color);
  }
  
  .card-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .card-title img {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
  
  .card-title h4 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }
  
  .card-description p {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.8);
  }
  
  /* Адаптация для планшетов */
  @media (max-width: 992px) {
    .cards-wrapp {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .garanties-title {
      padding: 40px 0;
    }
  }
  
  /* Адаптация для мобильных */
  @media (max-width: 576px) {
    .cards-wrapp {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .garanties-title {
      padding: 30px 0;
      width: 100%;
    }
    
    .card {
      padding: 25px 15px;
    }
    
    .card-title img {
      width: 50px;
      height: 50px;
    }
  }
  </style>