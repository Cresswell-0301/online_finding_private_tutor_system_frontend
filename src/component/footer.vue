<template>
    <footer class="d-flex flex-column text-secondary p-3" style="background-color: #1d2026; min-height: 380px">
        <div class="flex-fill d-flex align-items-center justify-content-center gap-4">
            <div>
                <RouterLink to="#" class="d-flex align-items-center text-white text-decoration-none mb-4" style="background: none">
                    <img src="@/assets/png/logo.png" height="40" />
                    <span class="fs-2 fw-semibold">Amazing Tutor Finder</span>
                </RouterLink>
                <div class="d-flex gap-3">
                    <a :href="facebook" target="_blank" class="text-white d-flex align-items-center justify-content-center sm-btn" style="height: 36px; width: 36px">
                        <font-awesome-icon icon="fa-brands fa-facebook-f" />
                    </a>
                    <a :href="instagram" target="_blank" class="text-white d-flex align-items-center justify-content-center sm-btn" style="height: 36px; width: 36px">
                        <font-awesome-icon icon="fa-brands fa-instagram" />
                    </a>
                    <a :href="linkedin" target="_blank" class="text-white d-flex align-items-center justify-content-center sm-btn" style="height: 36px; width: 36px">
                        <font-awesome-icon icon="fa-brands fa-linkedin-in" />
                    </a>
                </div>
            </div>
            <div>
                <label class="text-uppercase text-white mb-3 fs-6">Quick Links</label>
                <ul class="nav flex-column gap-3">
                    <li class="nav-item">
                        <RouterLink to="/about" class="nav-link text-secondary p-0">About</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/contact" class="nav-link text-secondary p-0">Contact</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
        <hr />
        <p class="text-center">&copy; 2024 - Software Project. Designed by SBX. All rights reserved.</p>
    </footer>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();

const facebook = ref("");
const instagram = ref("");
const linkedin = ref("");

onMounted(async () => {
    const response = await authStore.fetchSocialMedia();
    facebook.value = response.facebook;
    instagram.value = response.instagram;
    linkedin.value = response.linkedin;
});
</script>

<style scoped>
.sm-btn {
    background-color: #363b47;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.sm-btn:hover {
    background-color: #ff6636;
    transform: scale(1.1);
    box-shadow: 0 0 10px 2px rgba(255, 102, 54, 0.8);
}
.nav-link:hover {
    color: white !important;
}
</style>
