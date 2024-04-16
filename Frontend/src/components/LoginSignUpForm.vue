<template>
    <div>
        <!-- Full Name field only visible in signup mode -->
        <b-field v-if="isSignUp" label="Full Name" :label-position="labelPosition">
            <b-input v-model="fullName" type="text" placeholder="Enter your full name" class="full-width no-outline"></b-input>
        </b-field>

        <!-- Email field always visible -->
        <b-field label="Email" :label-position="labelPosition">
            <b-input type="email" class="full-width no-outline"></b-input>
        </b-field>

        <!-- Password field always visible -->
        <b-field label="Password" :label-position="labelPosition">
            <b-input v-model="password" type="password" placeholder="Enter your password" class="full-width no-outline"></b-input>
        </b-field>

        <!-- Confirm Password field only visible in signup mode -->
        <b-field v-if="isSignUp" label="Confirm Password" :label-position="labelPosition">
            <b-input v-model="confirmPassword" type="password" placeholder="Confirm your password" class="full-width no-outline"></b-input>
        </b-field>
        <div1>
            <!-- Button to perform login or signup based on mode -->
            <b-button @click="isSignUp ? signup() : login()" type="is-success" class="full-width">{{ isSignUp ? 'Sign Up' : 'Login' }}</b-button>
            <a @click="toggleForm" class="full-width is-text">{{ isSignUp ? 'Switch to Login' : 'Switch to Sign Up' }}</a>
        </div1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            isSignUp: false,
            labelPosition: 'on-border'
        };
    },
    methods: {
        login() {
            // Implement login logic
            console.log("Login button clicked");
        },
        signup() {
            // Implement signup logic
            console.log("Sign Up button clicked");
        },
        toggleForm() {
            this.isSignUp = !this.isSignUp;
        }
    }
};
</script>

<style scoped>
.field {
    margin-bottom: 20px;
}

.field .control {
    margin-top: 10px;
}

.field .label {
    font-size: 24px; /* Increased font size */
}

.full-width {
    width: calc(100% - 2px);
}

.no-outline input {
    outline: none;
}

/* Adjust positioning for buttons */
.div1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    margin-top: auto;
}
</style>
