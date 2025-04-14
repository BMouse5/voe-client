<template>
    <NavBar :parentCategories="parentCategories"></NavBar>
    <div class="product-wrapp container">
        <router-link to="/catalog" class="back-link"><svg
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
        <div class="product-card">
            <ProductCard @scroll-to-consultation="scrollToConsultation"></ProductCard>
        </div>
    </div>
    <div class="product-consultation" ref="consultationRef">
            <ConsultationRequest>Позвоните нам, или оставьте заявку на звонок</ConsultationRequest>
        </div>
    <FooterComp :parentCategories="parentCategories"></FooterComp>
</template>

<script setup>
import { ref} from 'vue'
import ProductCard from './Components/ProductCard.vue'
import NavBar from '../../src/components/NavBar.vue'
import FooterComp from '../../src/components/FooterComp.vue'
import ConsultationRequest from '../../src/components/ConsultationRequest.vue'
import ButtonComp from '../../src/components/UI/ButtonComp.vue'
const props = defineProps({
   parentCategories: {
    type: Array,
    default: () => []
   } 
});

const consultationRef = ref(null);

const scrollToConsultation = () => {
  consultationRef.value?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
};
</script>

<style scoped>
.product-wrapp {
    padding: 20px 20px;
}
.arrow-icon {
    transform: rotate(90deg);
}


path {
    stroke: var(--primary-orange-color);
    transition: all 0.3s ease
}

path:hover {
    stroke: var(--primary-dark-orange);
}
</style>