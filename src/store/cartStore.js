import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  actions: {
    init() {
      // Загружаем из localStorage только если window доступен (клиент)
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cart')
        this.items = saved ? JSON.parse(saved) : []
      }
    },
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveToLocalStorage();
    },
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.saveToLocalStorage();
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
        this.saveToLocalStorage();
      }
    },
    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  },
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
  }
});