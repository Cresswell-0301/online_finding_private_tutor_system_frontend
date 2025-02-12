<template>
    <div class="main d-flex flex-column">
        <div class="p-3 custom-input">
            <h2 class="text-center">Sign in to your account</h2>
            <form @submit.prevent="handleSignIn">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp" placeholder="Username or email address" required />
                </div>
                <div class="mb-3 ">
                    <label for="password" class="form-label">Password</label>
                    <input v-model="password" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control " id="password" placeholder="Password" required />
                    <font-awesome-icon @click="showPassword = !showPassword" class="hide-show-icon position-relative " 
                    :icon="showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'" size="lg" 
                    />
                </div>
                <div class="row mb-3 align-items-center justify-content-between w-100 g-0">
                    <div class="form-check col-auto">
                        <input type="checkbox" class="form-check-input" id="rememberMe" />
                        <label class="form-check-label mb-3" for="rememberMe">Remember Me</label>
                    </div>
                    <div class="col-auto p-0">
                        <button type="submit" class="btn btn-orange px-5" :disabled="authStore.loading">
                            Sign In
                            <span v-if="authStore.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <font-awesome-icon v-else icon="fa-solid fa-arrow-right" class="ms-2"/>
                        </button>
                    </div>
                    <RouterLink to="/auth/forgot_password" class="text-decoration-none">Forgot Password?</RouterLink>
                    
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const handleSignIn = async () => {
    await authStore.login(
        {
            email: email.value,
            password: password.value,
        },
        router
    );
};
</script>

<style scoped>
.main {
    min-width: 300px;
}

.custom-input {
  width: 100%; 
}

.btn-orange {
    background-color: #ff6636;
    color: #FFFFFF;
    border-radius: 2px;
}

.btn-orange:focus {
    background-color: #ff6636;
    color: #ffeee8;
}

.hide-show-icon {
    float: right;
    top: -30px;
    right: 10px;
    cursor: pointer;
}

@media only screen and (min-width: 1200px) {
    .main {
        min-width: 600px;
    }

    .custom-input {
    width: 90%; 
    }
}
</style>
