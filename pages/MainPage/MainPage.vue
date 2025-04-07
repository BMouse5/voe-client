<template>
  <NavBar></NavBar>
  <section class="carousel">
    <div class="carousel-wrapp container">
        <CarouselComp></CarouselComp>
    </div>
  </section>
  <section class="carousel-about">
    <div class="carousel-about-wrapp container">
        <div class="carousel-about-title">
            <h2>Каталог продукции</h2>
            <span>Широкий ассортимент насосов и запасных деталей</span>
        </div>
        <CarouselAbout></CarouselAbout>
    </div>
  </section>
  <section class="why-we">
    <div class="why-we-wrapp container">
        <h2 class="why-we-title">Почему <span class="why-we-title-2">мы</span></h2>
        <div class="why-we-pluses">
          <div class="pluses-title">
            <h2>ООО «Виктори Ойл Энерджи»- это современная динамично развивающаяся компания, основным видом деятельности которой является производство и продажа запасных частей, оборудования для систем очистки бурового раствора зарубежных фирм Derrick, Swaco, Brand.</h2>
            <p>Высокое качество выпускаемой продукции, короткие сроки изготовления, вся продукция сертифицирована.
                Различные виды логистических решений для наших покупателей с учетом их требований.
                Большой ассортимент готовой продукции на складе.
                Гарантия на продукцию от 1 года до 2 лет.
          </p>
          </div>
          <div class="pluses-cards">
              <WhyWeCards></WhyWeCards>
          </div>
        </div>
    </div>
  </section>
  <ConsultationRequest></ConsultationRequest>
  <FooterComp></FooterComp>
</template>

<script setup>
import NavBar from '../../src/components/NavBar.vue'
import CarouselComp from './components/CarouselComp.vue'
import ButtonComp from '../../src/components/UI/ButtonComp.vue'
import CarouselAbout from './components/CarouselAbout.vue'
import WhyWeCards from './components/WhyWeCards.vue'
import ConsultationRequest from '../../src/components/ConsultationRequest.vue'
import FooterComp from '../../src/components/FooterComp.vue'
</script>
<style scoped>
.carousel {
    background-color: var(--primary-light-gray);
    padding: 88px 0 100px 0;
    box-shadow: 0px 4px 4px 0px #00000040;
    position: relative;
    z-index: 999;
}

.carousel-about {
    padding: 87px 10px 97px 10px;
    background-color: var(--primary-dark-gray);
}

.carousel-about-title {
    max-width: 552px;
    width: 100%;
}

.carousel-about-title h2 {
    text-transform: uppercase;
    font-size: 42px;
    border-bottom: var(--primary-orange-color) 1px solid;
    display: inline-block;
}

.carousel-about-title span {
    font-size: 12px;
}

.why-we {
  padding: 35px 0;
  background-color: var(--primary-dark-orange);
  box-shadow: 0px 4px 4px 0px #00000040;
  position: relative;
  z-index: 2;
}

.why-we-wrapp {
  padding: 0 15px;
}

.why-we-title {
  display: inline-block;
  font-size: clamp(36px, 8vw, 92px);
  font-weight: bold;
  color: transparent;
  -webkit-text-stroke: 1px var(--primary-white-color);
  text-transform: uppercase;
  font-family: 'Montserrat Bold';
  line-height: 1.2;
  margin-bottom: 30px;
}

.why-we-title-2 {
  color: var(--primary-white-color);
  -webkit-text-stroke: 0;
}

.why-we-pluses {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.pluses-title {
  width: 100%;
  color: var(--primary-white-color);
  font-weight: 200;
}

.pluses-title h2 {
  font-size: clamp(20px, 4vw, 25px);
  line-height: 1.4;
  margin-bottom: 20px;
}

.pluses-title p {
  font-size: clamp(16px, 3vw, 18px);
  line-height: 1.6;
}

.pluses-cards {
  width: 100%;
}

/* Десктопная версия */
@media (min-width: 992px) {
  .why-we-pluses {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
  }
  
  .pluses-title {
    width: 45%;
  }
  
  .pluses-cards {
    width: 50%;
  }
}

/* Оптимизация для очень широких экранов */
@media (min-width: 1600px) {
  .why-we-pluses {
    gap: 60px;
  }
  
  .pluses-title {
    padding-top: 20px;
  }
}

/* Корректировка для средних экранов */
@media (max-width: 991px) and (min-width: 768px) {
  .pluses-title h2 {
    font-size: 22px;
  }
  
  .pluses-title p {
    font-size: 17px;
  }
}

/* Мобильная адаптация */
@media (max-width: 767px) {
  .why-we {
    padding: 25px 0;
  }
  
  .why-we-title {
    margin-bottom: 20px;
  }
  
  .pluses-title h2 {
    margin-bottom: 15px;
  }
}
</style>