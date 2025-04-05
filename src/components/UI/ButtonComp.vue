<template>
  <button :class="['btn', dynamicClass]">
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // значение по умолчанию
    validator: (value) => ['primary', 'transparent'].includes(value) // валидация вариантов
  }
})

const dynamicClass = computed(() => {
  return {
    primary: '',
    transparent: 'btn-transparent'
  }[props.variant]
})
</script>

<style scoped>
.btn {
  border-radius: 15px;
  padding: 14px;
  background-color: var(--btn-primary-orange);
  color: var(--primary-white-color);
  width: 156px;
  height: 47px;
  transition: all 0.3s ease-in-out;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-transparent {
  background-color: var(--btn-transparent-color);
  border: 1px solid var(--btn-primary-orange);
  color: var(--primary-white-color);
  transition: all 0.3s ease-in-out;
}

.btn-transparent:hover {
  background-color: var(--btn-primary-orange);
  color: white;
  transform: translateY(-1px);
}

.btn:hover {
  background-color: var(--btn-hover-orange);
  transform: translateY(-1px);
}
</style>