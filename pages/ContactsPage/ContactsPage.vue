<template>
  <NavBar :parentCategories="parentCategories"></NavBar>
  <section class="title">
    <ContactTitle></ContactTitle>
  </section>
  <section class="contact-map">
  <div class="map-container container">
    <iframe 
      src="https://yandex.ru/map-widget/v1/?ll=53.191790%2C56.852042&mode=poi&poi%5Bpoint%5D=53.209337%2C56.852042&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1046381508&z=14" 
      width="100%" 
      height="500" 
      frameborder="0"
      allowfullscreen="true"
      aria-hidden="false"
      tabindex="0"
    ></iframe>
    <!-- Ссылки перенесены вниз и скрыты на мобильных -->
    <div class="map-attribution">
      <a href="https://yandex.ru/maps/org/gosudarstvenny_teatr_opery_i_baleta_udmurtskoy_respubliki_imeni_p_i_chaykovskogo/1046381508/?utm_medium=mapframe&utm_source=maps" target="_blank" rel="noopener noreferrer">
        Государственный театр оперы и балета Удмуртской Республики имени П.И. Чайковского
      </a>
      <a href="https://yandex.ru/maps/44/izhevsk/category/theatre/184105872/?utm_medium=mapframe&utm_source=maps" target="_blank" rel="noopener noreferrer">
        Театр в Ижевске
      </a>
    </div>
  </div>
</section>
  <section class="contacts-pluses">
    <AboutPluses backgroundColor="var(--primary-dark-orange)" :showTitle="false">
      
    </AboutPluses>
  </section>
  <section class="contacts-consultation">
    <ConsultationRequest>Оставьте заявку на консультацию</ConsultationRequest>
  </section>
  <FooterComp :parentCategories="parentCategories"></FooterComp>
</template>

<script setup>
import NavBar from '../../src/components/NavBar.vue'
import ContactTitle from './components/ContactTitle.vue'
import AboutPluses from '../../src/components/AboutPluses.vue'
import ConsultationRequest from '../../src/components/ConsultationRequest.vue'
import FooterComp from '../../src/components/FooterComp.vue'


const props = defineProps({
  parentCategories: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.title {
  border-top: 1px solid var(--primary-white-color);
}
.contact-map {
  background-color: var(--primary-black-color);
  padding: 40px 0;
}

.map-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
}

.map-container iframe {
  display: block;
  width: 100%;
  height: 500px;
  border: none;
  border-radius: 15px;
}

.map-attribution {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.map-attribution a {
  color: #eee;
  font-size: 12px;
  text-decoration: none;
  background: rgba(0,0,0,0.5);
  padding: 2px 5px;
  border-radius: 3px;
  margin-bottom: 5px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.map-attribution a:hover {
  opacity: 1;
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .contact-map {
    padding: 20px 0;
  }
  
  .map-container iframe {
    height: 400px;
  }
  
  .map-attribution {
    display: none; /* Скрываем атрибуцию на мобильных */
  }
}

@media (max-width: 480px) {
  .map-container iframe {
    height: 300px;
    border-radius: 10px;
  }
}
</style>