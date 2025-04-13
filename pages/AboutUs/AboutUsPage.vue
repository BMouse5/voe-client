<template>
  <NavBar :parentCategories="parentCategories"></NavBar>
  <section class="about-title">
    <AboutTitle></AboutTitle>
  </section>
  <section class="about-pluses">
    <AboutPluses backgroundColor="var(--primary-dark-gray)"></AboutPluses>
  </section>
  <section class="garanties">
    <AboutGaranties></AboutGaranties>
  </section>
  <section class="consultation">
    <ConsultationRequest></ConsultationRequest>
  </section>
  <FooterComp :parentCategories="parentCategories"></FooterComp>
</template>

<script setup>
import NavBar from '../../src/components/NavBar.vue'
import AboutTitle from './components/AboutTitle.vue'
import AboutPluses from '../../src/components/AboutPluses.vue'
import AboutGaranties from './components/AboutGaranties.vue'
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
.about-title {
  box-shadow: 0px 4px 4px 0px #00000040;
  border-top: 1px solid var(--primary-white-color);
}

.garanties {
  box-shadow: 0px 4px 4px 0px #00000040;
  position: relative;
}
</style>