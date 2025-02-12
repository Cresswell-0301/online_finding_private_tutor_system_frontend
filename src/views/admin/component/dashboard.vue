<template>
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh" v-if="loading">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <!-- Dashboard -->
    <div class="dashboard-container">
        <div class="databar">
            <!-- Register Account -->
            <div class="data-box">
                <div class="icon-div">
                    <font-awesome-icon icon="fa-solid fa-user" class="icon" />
                </div>
                <div class="info-div">
                    <span class="data">{{ account }}</span>
                    <span class="label">Register Account</span>
                </div>
            </div>

            <!-- Register Parent -->
            <div class="data-box">
                <div class="icon-div">
                    <font-awesome-icon icon="fa-solid fa-users" class="icon" />
                </div>
                <div class="info-div">
                    <span class="data">{{ parent }}</span>
                    <span class="label">Register Parent</span>
                </div>
            </div>

            <!-- Register Student -->
            <div class="data-box">
                <div class="icon-div">
                    <font-awesome-icon icon="fa-solid fa-user-graduate" class="icon" />
                </div>
                <div class="info-div">
                    <span class="data">{{ student }}</span>
                    <span class="label">Register Student</span>
                </div>
            </div>

            <!-- Register Tutor -->
            <div class="data-box">
                <div class="icon-div">
                    <font-awesome-icon icon="fa-solid fa-chalkboard-teacher" class="icon" />
                </div>
                <div class="info-div">
                    <span class="data">{{ tutor }}</span>
                    <span class="label">Register Tutor</span>
                </div>
            </div>

            <!-- Tutor Applications -->
            <div class="data-box">
                <div class="icon-div">
                    <font-awesome-icon icon="fa-solid fa-file-alt" class="icon" />
                </div>
                <div class="info-div">
                    <span class="data">{{ tutor_application }}</span>
                    <span class="label">Tutor Applications</span>
                </div>
            </div>

            <!-- Reports -->
            <div class="data-box">
                <div class="icon-div">
                    <font-awesome-icon icon="fa-solid fa-clipboard-list" class="icon" />
                </div>
                <div class="info-div">
                    <span class="data">{{ report }}</span>
                    <span class="label">Reports</span>
                </div>
            </div>

            <!-- Total Earnings -->
            <div class="data-box">
                <div class="icon-div">
                    <font-awesome-icon icon="fa-solid fa-wallet" class="icon" />
                </div>
                <div class="info-div">
                    <span class="data">MYR {{ earn.toFixed(2) }}</span>
                    <span class="label">Total Earning</span>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../../stores/auth";

const account = ref(0);
const student = ref(0);
const parent = ref(0);
const tutor = ref(0);
const tutor_application = ref(0);
const report = ref(0);
const earn = ref(0);

const loading = ref(true);

const authStore = useAuthStore();

onMounted(async () => {
    try {
        const data = await authStore.fetchAdminDashboard();

        account.value = data.account;
        student.value = data.student;
        parent.value = data.parent;
        tutor.value = data.tutor;
        tutor_application.value = data.tutor_application;
        report.value = data.report;
        earn.value = data.earn;
    } catch (error) {
        console.error("Error fetching admin dashboard: ", error);
    }

    loading.value = false;
});
</script>

<style scoped>
/* Dashboard Container */
.dashboard-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

/* Databar */
.databar {
    display: flex;
    flex-wrap: wrap; /* ✅wrap */
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
}

/* Data Box */
.data-box {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    background: #ffffff;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    flex: 1 1 calc(25% - 1rem); /* ✅ 4column */
    min-width: 250px; /* ✅ set min width */
    gap: 1rem;
}

/* Responsive */
@media (max-width: 992px) {
    .data-box {
        flex: 1 1 calc(50% - 1rem); /* ✅ 2column */
    }
}

@media (max-width: 600px) {
    .data-box {
        flex: 1 1 100%; /* ✅ 1column*/
    }
}

/* Icon */
.icon-div {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    width: 50px;
    height: 50px;
    
}

.icon {
    font-size: 1.5rem;
    color: #ff6636;
}

/* Data Info */
.info-div {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.data {
    font-size: 1.4rem;
    font-weight: bold;
    color: #1d2026;
    text-align: center;
}

.label {
    font-size: 1rem;
    font-weight: 300;
    color: #6e7485;
}

</style>
