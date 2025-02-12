<template>
    <div class="main d-flex flex-column justify-content-center">
        <h2 class="text-center">Create your account</h2>
        <form @submit.prevent="handleSignUp">
            <div class="row mb-3">
                <div class="col-auto">
                    <label for="role" class="form-label">I am</label>
                    <select id="role" v-model="role" class="form-select" aria-label="Default select">
                        <option value="student" selected>Student</option>
                        <option value="parent">Parent</option>
                    </select>
                </div>
                <div class="col-auto ms-auto d-flex flex-column justify-content-end">
                    <p class="text-secondary mb-2 me-2">You are Tutor??</p>
                    <RouterLink to="/tutor_registration" class="btn btn-purple px-4 align-items-end" type="button"> Become A Tutor</RouterLink>
                </div>
            </div>
            <div class="row mb-3 align-items-end">
                <div class="col">
                    <label class="form-label">Full Name </label>
                    <input type="text" class="form-control" id="first_name" placeholder="First name" v-model="first_name" required />
                </div>
                <div class="col">
                    <input type="text" class="form-control" id="last_name" placeholder="Last name" v-model="last_name" required />
                </div>
            </div>

            <div class="mb-3">
                <label for="name" class="form-label">Username</label>
                <input type="text" class="form-control" id="name" v-model="name" placeholder="Username" required />
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp" placeholder="Email address" required />
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label for="password" class="form-label">Password</label>
                    <input :type="showPassword ? 'text' : 'password'" class="form-control" id="password" v-model="password" placeholder="Create password" required />
                    <font-awesome-icon @click="showPassword = !showPassword" class="hide-show-icon position-relative" :icon="showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'" size="lg" />
                </div>
                <div class="col">
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <input :type="showPassword ? 'text' : 'password'" class="form-control" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm password" required />
                    <font-awesome-icon @click="showPassword = !showPassword" class="hide-show-icon position-relative" :icon="showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'" size="lg" />
                </div>
            </div>
            <div class="row mb-3 align-items-center">
                <div class="col-auto">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="AgreementCheck" required />
                        <label class="form-check-label text-secondary" for="AgreementCheck">I Agree with all of your Terms & Conditions</label>
                    </div>
                </div>

                <div class="col-auto ms-auto">
                    <button type="submit" class="btn btn-orange px-4" :disabled="authStore.loading">
                        Create Account
                        <span v-if="authStore.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <font-awesome-icon v-else icon="fa-solid fa-arrow-right" />
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const first_name = ref("");
const last_name = ref("");
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref("student");

const showPassword = ref(false);

const handleSignUp = async () => {
    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    await authStore.register(
        {
            first_name: first_name.value,
            last_name: last_name.value,
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: confirmPassword.value,
            role: role.value,
        },
        router
    );
};
</script>

<style scoped>
.text-secondary {
    font-size: 0.8rem !important;
}
.btn-orange {
    background-color: #ff6636;
    color: #ffffff;
    border-radius: 2px;
}

.btn-orange:focus {
    background-color: #ff6636;
    color: #ffeee8;
}

.btn-purple {
    background-color: #564ffd;
    color: #ffffff;
    border-radius: 2px;
}

.btn-purple:focus {
    background-color: #564ffd;
    color: #ffeee8;
}

.main {
    min-width: 300px;
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
}
</style>
