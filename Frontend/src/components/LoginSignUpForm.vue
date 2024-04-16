<template>
    <div>
        <div v-if="isSignUp" class="SignUpInputs">
            <b-field label="Full Name" :label-position="labelPosition" expanded>
                <b-input v-model="fullName" type="text" placeholder="Enter your full name"
                    class="full-width no-outline"></b-input>
            </b-field>

            <b-field label="Email" :label-position="labelPosition" expanded>
                <b-input v-model="email" type="email" placeholder="Enter your email"
                    class="full-width no-outline"></b-input>
            </b-field>

            <b-field label="Password" :label-position="labelPosition" expanded>
                <b-input v-model="password" type="password" placeholder="Enter your password"
                    class="full-width no-outline"></b-input>
            </b-field>

            <b-field label="Confirm Password" :label-position="labelPosition" expanded>
                <b-input v-model="confirmPassword" type="password" placeholder="Confirm your password"
                    class="full-width no-outline"></b-input>
            </b-field>
        </div>

        <div v-else class="LoginInputs">
            <b-field label="Email" :label-position="labelPosition" expanded>
                <b-input v-model="email" type="email" placeholder="Enter your email"
                    class="full-width no-outline"></b-input>
            </b-field>

            <b-field label="Password" :label-position="labelPosition" expanded>
                <b-input v-model="password" type="password" placeholder="Enter your password"
                    class="full-width no-outline"></b-input>
            </b-field>
        </div>

        <!-- Button and switch -->
        <div class="button-and-switch">
            <b-button @click="isSignUp ? signup() : login()" type="is-success" class="sign-up-button">{{ isSignUp ? 'Sign Up' : 'Login'}}</b-button>
            <div class="switch-container">
                <a @click="toggleForm" class="full-width is-text">{{ isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}}</a>
            </div>
        </div>
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
            labelPosition: 'on-border'
        };

    },
    props: {
        isSignUp: Boolean,
        required: true
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
            this.$emit('toggle-form', !this.isSignUp);
        }
    }
};
</script>

<style scoped>
.b-field label {
    font-size: 18px;
    padding-bottom: 5px;
}

.b-input input {
    height: 40px;
    font-size: 16px;
}

.b-button {
    margin-top: 10px;
}

.button-and-switch {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
}

.sign-up-button {
    width: 100%;
}

.switch-container {
    padding-top: 10px;
}
</style>