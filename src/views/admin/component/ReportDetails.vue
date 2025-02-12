<template>
    <div class="container bg-white p-5">
        <form @submit.prevent="submitReport">
            <div class="mb-3">
                <label for="fullName" class="form-label">Reported By (Full Name)</label>
                <input type="text" class="form-control" id="fullName" v-model="reporterName" readonly disabled />
            </div>
            <div class="mb-3 row">
                <div class="col">
                    <label for="phoneNumber" class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="phoneNumber" v-model="phoneNumber" readonly disabled />
                </div>
                <div class="col">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="email" readonly disabled />
                </div>
            </div>

            <div class="mb-3">
                <label for="tutorName" class="form-label">Tutor Name</label>
                <input type="text" class="form-control" id="tutorName" v-model="tutorName" readonly disabled />
            </div>

            <div class="mb-3">
                <label for="content" class="form-label">Content</label>
                <textarea class="form-control" id="content" v-model="content" rows="4" readonly disabled></textarea>
            </div>
            <div class="mb-3">
                <label for="feedback" class="form-label">Feedback</label>
                <textarea class="form-control" id="feedback" v-model="feedback" rows="4" required></textarea>
            </div>
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" @click="viewTutor">View Tutor</button>
                <div class="d-flex">
                    <button type="button" class="btn btn-secondary me-2" @click="cancelAction">Cancel</button>
                    <button type="submit" class="btn btn-orange">Submit</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import router from "../../../router";
import { useAuthStore } from "../../../stores/auth";

const authStore = useAuthStore();

const reporterName = ref("");
const phoneNumber = ref("");
const email = ref("");
const tutorName = ref("");
const content = ref("");
const previousFeedback = ref("");
const feedback = ref("");

const reportId = router.currentRoute.value.params.id;
const tutorId = ref("");

onMounted(async () => {
    const report = await authStore.fetchReportedTutor(reportId);
    reporterName.value = report.user.name;
    phoneNumber.value = report.user.phone || "-";
    email.value = report.user.email;
    tutorName.value = report.report_tutor.name;
    content.value = report.description;
    previousFeedback.value = report.feedback;
    feedback.value = report.feedback;
    tutorId.value = report.report_tutor.is_tutor.id;
});

const submitReport = async () => {
    if (feedback.value !== previousFeedback.value) {
        const data = {
            report_id: reportId,
            feedback: feedback.value,

            report_by: reporterName.value,
            email: email.value,
            description: content.value,
        };

        await authStore.submitReport(data);
    } else {
        alert("No changes to feedback");
    }
};

const viewTutor = () => {
    router.push({ name: "Tutor_Details", params: { id: tutorId.value } });
};

const cancelAction = () => {
    location.reload();
};
</script>
