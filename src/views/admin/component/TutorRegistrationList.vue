<template>
    <div class="container bg-white p-3">
        <div class="row w-75 m-3">
            <span class="col text-secondary">
                <font-awesome-icon icon="fa-solid fa-user" />
                Tutor name
            </span>
            <span class="col text-secondary">
                <font-awesome-icon icon="fa-solid fa-at" />
                Email
            </span>
            <span class="col text-secondary">
                <font-awesome-icon icon="fa-solid fa-phone" />
                Phone Number
            </span>
        </div>
        <div class="d-flex flex-column gap-1 p-1" style="background-color: #f5f7fa">
            <div v-if="tutorStore.pendingTutors?.length === 0" class="text-center text-secondary">No pending tutors found.</div>
            <div v-for="tutor in tutorStore.pendingTutors" :key="tutor.id" class="bg-white d-flex align-items-center">
                <div class="row w-75 m-3">
                    <span class="col">{{ tutor.user.name }}</span>
                    <span class="col">{{ tutor.user.email }}</span>
                    <span class="col">{{ tutor.user.phone }}</span>
                </div>
                <div class="btn btn-orange ms-auto me-3" @click="goToDetails(tutor.id)">
                    Details
                    <font-awesome-icon icon="fa-solid fa-arrow-right" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTutorStore } from "@/stores/tutor.js";

const router = useRouter();
const tutorStore = useTutorStore();

onMounted(async () => {
    tutorStore.fetchPendingTutors();
});

const goToDetails = (tutorId) => {
    router.push({ name: "Tutor_Details", params: { id: tutorId } });
};
</script>
