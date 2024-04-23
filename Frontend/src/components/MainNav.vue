<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a role="button" :class="['navbar-burger', { 'is-active': isMenuOpen }]" aria-label="menu" aria-expanded="false"
        @click="toggleMenu">
        <span aria-hidden="true" style="height: 2px; width: 20px;"></span>
        <span aria-hidden="true" style="height: 2px; width: 20px;"></span>
        <span aria-hidden="true" style="height: 2px; width: 20px;"></span>
      </a>

    </div>

    <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }" style="position: absolute; top: 100%; right: 0;">
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <div class="navbar-dropdown">
            <a class="navbar-item" @click="showLoginModal">
              Login
            </a>
            <a class="navbar-item" @click="showSignUpModal">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="navbar-menu">
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <b-button @click="showLoginModal" type="is-primary" outlined>Login</b-button>
            <b-button @click="showSignUpModal" type="is-success" outlined>Sign Up</b-button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import "@/styles/navbar.css";
import { useAuthStore } from '@/store/auth.js'

export default {
  data() {
    return {
      isMenuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    showLoginModal() {
      console.log("Login button clicked");
      this.$emit("login");
    },
    showSignUpModal() {
      console.log("Sign Up button clicked");
      this.$emit("signup");
    }
  }
};
</script>