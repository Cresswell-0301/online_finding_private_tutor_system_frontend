<template>
    <div class="container mt-4">
        <div class="card shadow-sm p-4" id="print-area">
            <h1 class="text-center text-primary">Payment Details</h1>

            <!-- Payment Summary -->
            <div class="mt-4">
                <h2 class="border-bottom pb-2 text-secondary">Summary</h2>
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Pay To:</strong> {{ paymentData.payTo }}</p>
                        <p><strong>Paid By:</strong> {{ paymentData.paidBy }}</p>
                    </div>
                    <div class="col-md-6">
                        <p>
                            <strong>Amount:</strong> <span class="fw-bold">MYR {{ paymentData.amount }}</span>
                        </p>
                        <p>
                            <strong>Status:</strong>
                            <span :class="{ 'text-success fw-bold': paymentData.status === 'success', 'text-danger fw-bold': paymentData.status !== 'success' }" style="margin-left: 5px">
                                {{ paymentData.status.charAt(0).toUpperCase() + paymentData.status.slice(1) }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Parent Information -->
            <div class="mt-4">
                <h2 class="border-bottom pb-2 text-secondary">Parent Information</h2>
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Name:</strong> {{ paymentData.parent.name }}</p>
                        <p><strong>Email:</strong> {{ paymentData.parent.email }}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Phone:</strong> {{ paymentData.parent.phone ? paymentData.parent.phone : "N/A" }}</p>
                    </div>
                </div>
            </div>

            <!-- Student Information -->
            <div class="mt-4">
                <h2 class="border-bottom pb-2 text-secondary">Student Information</h2>
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Name:</strong> {{ paymentData.student.name }}</p>
                        <p><strong>Email:</strong> {{ paymentData.student.email }}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Phone:</strong> {{ paymentData.student.phone ? paymentData.student.phone : "N/A" }}</p>
                    </div>
                </div>
            </div>

            <!-- Tutor Information -->
            <div class="mt-4">
                <h2 class="border-bottom pb-2 text-secondary">Tutor Information</h2>
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Name:</strong> {{ paymentData.tutor.name }}</p>
                        <p><strong>Email:</strong> {{ paymentData.tutor.email }}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Phone:</strong> {{ paymentData.tutor.phone ? paymentData.tutor.phone : "N/A" }}</p>
                    </div>
                </div>
            </div>

            <!-- Booked Sessions -->
            <div class="mt-4">
                <h2 class="border-bottom pb-2 text-secondary">Booked Time</h2>
                <div class="list-group">
                    <div v-for="session in paymentData.sessions" :key="session.sessionId" class="list-group-item list-group-item-light">
                        <p class="mb-1"><strong>Date:</strong> {{ session.day }}, {{ session.month }}</p>
                        <p class="mb-0"><strong>Time Slot:</strong> {{ session.time_slot }}</p>
                    </div>
                </div>
            </div>

            <!-- Buttons -->
            <div class="mt-4 text-center">
                <button class="btn btn-outline-primary px-4 me-2 hide-buttons btn" @click="goBack">
                    <font-awesome-icon icon="fa-solid fa-arrow-left" class="me-2" />
                    Back
                </button>
                <button class="btn btn-danger px-4 hide-buttons btn" @click="downloadPDF">
                    <font-awesome-icon icon="fa-solid fa-file-pdf" class="me-2" />
                    Download PDF
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import html2pdf from "html2pdf.js";

const router = useRouter();
const route = useRoute();
const paymentData = route.query.data ? JSON.parse(decodeURIComponent(route.query.data)) : {};

const goBack = () => {
    router.go(-1);
};

const downloadPDF = () => {
    const element = document.getElementById("print-area");

    // Add class to hide buttons
    element.classList.add("hide-buttons");

    // Generate and download PDF
    html2pdf()
        .from(element)
        .save("Payment_Details.pdf")
        .then(() => {
            // Remove class after PDF download
            element.classList.remove("hide-buttons");
        });
};
</script>

<style scoped>
.card {
    border-radius: 10px;
}

.list-group-item {
    border-radius: 5px;
    margin-bottom: 5px;
}

.text-secondary {
    color: #6c757d !important;
}

.text-primary {
    color: #007bff !important;
}

.fw-bold {
    font-weight: bold;
}

.hide-buttons .btn {
    display: none !important;
}
</style>
