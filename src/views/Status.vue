<template>
    <div class="d-flex justify-content-center align-items-center" style="height: 100%">
        <div class="spinner-border" role="status" v-if="loading">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const userStore = useAuthStore();
const loading = ref(true);

const id = window.location.pathname.split("/")[2];

const urlParams = new URLSearchParams(window.location.search);
const status = urlParams.get("status");

setTimeout(() => {
    loading.value = false;
    waitTimer();
}, 2000);

const waitTimer = async () => {
    await userStore.updateLinkAccountStatus(id, status);
};
</script>
