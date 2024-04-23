import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('store', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),

  actions: {
    async login({ email, password }) {
      try {
        const response = await axios.post("http://localhost:3000/api/login", { email, password });
        const { user } = response.data;
        this.isAuthenticated = true;
        this.user = user;
      } catch (error) {
        console.error('Error:', error);
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
    },

    async signup({ fullname, email, password }) {
      try {
        const response = await axios.post("http://localhost:3000/api/signup", { fullname, email, password });
        const { user } = response.data;
        this.isAuthenticated = true;
        this.user = user;
      } catch (error) {
        console.error('Error:', error);
      }
    },
  },
})