<template>
    <div class="container bg-white p-3">
        <div class="row w-75 m-3">
            <span class="col text-secondary">
                <font-awesome-icon icon="fa-solid fa-user" />
                Reported by
            </span>
            <span class="col text-secondary">
                <font-awesome-icon icon="fa-solid fa-clock" />
                Report Time
            </span>
            <span class="col text-secondary">
                <font-awesome-icon icon="fa-solid fa-pencil" />
                Title
            </span>
        </div>
        <div class="d-flex flex-column gap-1 p-1" style="background-color: #f5f7fa">
            <div v-if="reportLists.length === 0" class="text-center text-secondary">No report found.</div>
            <div v-for="report in reportLists" :key="report.id" class="bg-white d-flex align-items-center">
                <div class="row w-75 m-3">
                    <span class="col">{{ report.user.name }}</span>
                    <span class="col">{{ new Date(report.created_at).toLocaleString() }}</span>
                    <span class="col">{{ report.description.length > 30 ? report.description.slice(0, 30) + "....." : report.description }}</span>
                </div>
                <div class="btn btn-orange ms-auto me-3" @click="goToDetails(report.id)">
                    Details
                    <font-awesome-icon icon="fa-solid fa-arrow-right" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../../../stores/auth";
import router from "../../../router";

const authStore = useAuthStore();

const reportLists = ref([]);

onMounted(async () => {
    reportLists.value = await authStore.fetchReportedTutors();
});

const goToDetails = (id) => {
    router.push({ name: "Report_Details", params: { id: id } });
};
</script>
