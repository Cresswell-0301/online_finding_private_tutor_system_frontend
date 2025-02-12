<template>
    <div class="main d-flex flex-column">
        <div class="row">
            <div class="col-md-12">
                <h1>Forgot Password</h1>
                <p>Enter your email address and we'll send you a otp to reset your password.</p>
                <form @submit.prevent="checkEmail">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="email" v-model="email" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Next</button>
                </form>
                <form  @submit.prevent="checkOTP" v-if="authStore.otp != null">
                    <div class="mb-3">
                        <label for="otp" class="form-label">OTP</label>
                        <input type="text" class="form-control" id="otp" v-model="otp" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Next</button>
                </form>
                <form @submit.prevent="resetPassword" v-if="authStore.otpVerified">
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" v-model="password" required>
                    </div>
                    <div class="mb-3">
                        <label for="password_confirmation" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="password_confirmation" v-model="password_confirmation" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Reset Password</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const otp = ref('');
const password = ref('');
const password_confirmation = ref('');

const checkEmail = async() => {
    await authStore.checkEmail({
        email: email.value,
    }); 
}

const checkOTP = () => {
    if(authStore.otp == otp.value) {
        authStore.otpVerified = true;
    } else {
        alert('Invalid OTP');
    }
}

const resetPassword = async() => {
    if(password.value == password_confirmation.value) {
        await authStore.resetPassword({
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
        }, router);
    } else {
        alert('Password does not match');
    }
}
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