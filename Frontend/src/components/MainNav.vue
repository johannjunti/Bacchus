<template>
    <b-navbar>
        <template #end>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-primary" @click="emitSignUp">Sign up</a>
                    <a class="button is-light" @click="emitLogin">Log in</a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
export default {
    methods: {
        emitSignUp() {
            this.$emit("signup");
        },
        emitLogin() {
            this.$emit("login");
        }
    }
};
</script>
