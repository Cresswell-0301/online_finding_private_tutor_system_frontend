<template>
    <div class="d-flex flex-column min-vh-100">
        <!-- header -->
        <header_design />

        <div class="position-relative flex-fill">
            <!-- background color -->
            <div class="background position-absolute w-100 z-n1" :style="{ backgroundColor: backgroundColor }" style="height: 225px"></div>
            <!-- content -->
            <div class="m-4 p-4 d-flex flex-column justify-content-center align-items-center">
                <div class="bg-white rounded-3 w-75">
                    <div class="d-flex align-items-center p-4">
                        <img v-if="authStore.user" :src="authStore.image" width="100" height="100" alt="user picture" class="rounded-circle me-3" />

                        <span class="fs-5 fw-bold me-auto">{{ authStore.user.name }}</span>
                        <div class="btn btn-orange-secondary px-4" @click="signOut">Sign Out</div>
                    </div>
                    <!-- navbar link -->
                    <div class="d-flex justify-content-center border-top border-bottom">
                        <ul class="nav">
                            <li class="nav-item" v-if="authStore.user.role == 'student'">
                                <RouterLink to="/user/tutor_list" class="btn px-4 py-3" :class="{ active: $route.path === '/user/tutor_list' }" @click="isActive = 'tutors'"> Tutors</RouterLink>
                            </li>
                            <li class="nav-item" v-if="authStore.user.role == 'parent'">
                                <RouterLink to="/user/purchase_history" class="btn px-4 py-3" :class="{ active: $route.path === '/user/purchase_history' }" @click="isActive = 'purchase-history'"> Purchase History </RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink to="/user/setting" class="btn px-4 py-3" :class="{ active: $route.path === '/user/setting' }" @click="isActive = 'settings'"> Setting & Privacy</RouterLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <router-view></router-view>
            </div>
        </div>
        <!-- footer -->
        <footer_design />
    </div>
</template>

<script setup>
import header_design from "@/component/header.vue";
import footer_design from "@/component/footer.vue";

import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const backgroundColor = computed(() => (authStore.user?.role === "student" ? "#FFEEE8" : "#FFC7B2"));

const router = useRouter();
const signOut = async () => {
    await authStore.logout(router);
};
</script>

<style scoped>
.btn-orange-secondary {
    background-color: #ffeee8;
    color: #ff6636;
    border-radius: 2px;
}
.nav-item .btn {
    /* padding: 0.5rem 2rem;         */
    font-size: 1rem;
    color: #1d2026;
    background-color: transparent;
    border: none;
    border-radius: 0;
    height: 100%;
}

.nav-item .btn:hover {
    background-color: #f5f7fa;
}

.nav-item .btn.active {
    background-color: #ffffff;
    border-bottom: 3px solid #ff6636;
}
</style>
