<template>
    <div class="vh-100 d-flex overflow-hidden">
        <div class="d-flex flex-column flex-shrink-0 text-secondary bg-dark" style="width: 280px">
            <RouterLink to="#" class="d-flex p-3 align-items-center text-white text-decoration-none">
                <img src="@/assets/png/logo.png" height="40" />
                <span class="fs-4">Amazing Tutor</span>
            </RouterLink>
            <hr class="mt-0" />
            <ul class="nav flex-column mb-auto">
                <li class="nav-item">
                    <RouterLink to="/tutor/dashboard" class="nav-link text-secondary" :class="{ active: route.name === 'Tutor_Dashboard' }"><font-awesome-icon icon="fa-solid fa-chart-column" class="mx-3" />Dashboard</RouterLink>
                </li>
                <li>
                    <RouterLink to="/tutor/sessions" class="nav-link text-secondary" :class="{ active: route.name === 'Sessions' }"><font-awesome-icon icon="plus" class="mx-3" />Sessions</RouterLink>
                </li>
                <li>
                    <RouterLink to="/tutor/schedule" class="nav-link text-secondary" :class="{ active: route.name === 'Schedule' }"><font-awesome-icon icon="fa-solid fa-layer-group" class="mx-3" />Schedule</RouterLink>
                </li>
                <li>
                    <RouterLink to="/tutor/payment_list" class="nav-link text-secondary" :class="{ active: route.name === 'Payment_List' }"><font-awesome-icon icon="fa-solid fa-credit-card" class="mx-3" />Payment</RouterLink>
                </li>
                <li>
                    <RouterLink to="/tutor/profile" class="nav-link text-secondary" :class="{ active: route.name === 'Profile' }"><font-awesome-icon icon="fa-solid fa-gear" class="mx-3" />Profile</RouterLink>
                </li>
            </ul>
            <div class="nav mb-3">
                <div class="nav-link text-secondary w-100" @click="signOut" style="cursor: pointer"><font-awesome-icon icon="fa-solid fa-right-from-bracket" class="mx-3" />Sign Out</div>
            </div>
        </div>

        <div class="d-flex flex-column flex-grow-1" style="background-color: #f5f7fa">
            <header class="d-flex align-items-center bg-white fw-bold" style="min-height: 72px; padding-left: 160px">
                {{ route.name.replace(/_/g, " ") }}
            </header>
            <hr class="mt-0" />
            <div class="overflow-auto p-4">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from "../../stores/auth";
import { RouterLink, useRoute } from "vue-router";
import { useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const signOut = async () => {
    await authStore.logout(router);
};
</script>

<style scoped>
.nav-link:hover {
    background-color: #ff6636;
    color: white !important;
}
.active {
    background-color: #ff6636;
    color: white !important;
}
</style>
