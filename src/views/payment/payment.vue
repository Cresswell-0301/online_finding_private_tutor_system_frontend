<template>
    <div class="d-flex flex-column align-items-center justify-content-center" style="min-height: 100vh; background-color: #f8f9fa">
        <div class="text-center p-5 bg-white rounded shadow-sm">
            <!-- Success Message -->
            <div v-if="$route.params.status === 'success'" class="mb-4">
                <font-awesome-icon icon="fa-solid fa-circle-check" class="text-success mb-3" style="font-size: 5rem" />
                <h2 class="fw-bold text-success">Payment Successful!</h2>
                <p class="text-muted">Your payment has been processed successfully.</p>
            </div>

            <!-- Failure Message -->
            <div v-else class="mb-4">
                <font-awesome-icon icon="fa-solid fa-circle-xmark" class="text-danger mb-3" style="font-size: 5rem" />
                <h2 class="fw-bold text-danger">Payment Failed!</h2>
                <p class="text-muted">Something went wrong with your payment. Please try again.</p>
            </div>

            <!-- Return Button -->
            <div class="d-flex flex-column align-items-center gap-2">
                <router-link to="/" class="btn btn-orange-primary px-4 py-2"> Click here to continue </router-link>
                <p class="text-muted">Redirecting in {{ countdown }} seconds...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const countdown = ref(5);
let timer;

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get("session");
    const sessions = urlParams.get("sessions");

    if (session && sessions) {
        try {
            const decodedSessions = atob(sessions);

            if (session !== decodedSessions) {
                alert("Session ID mismatch");
            }

            timer = setInterval(() => {
                countdown.value--;
                if (countdown.value <= 0) {
                    clearInterval(timer);
                    window.history.replaceState({}, document.title, window.location.pathname); // clear the url, prevent user from going back to the payment page
                    router.push("/");
                }
            }, 1000);
        } catch (error) {
            alert("Session ID mismatch", error);
        }
    } else {
        alert("Missing session or sessions parameters");
    }
});

onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer);
    }
});
</script>
