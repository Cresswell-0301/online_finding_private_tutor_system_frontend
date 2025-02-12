<template>
    <div class="modal-overlay">
        <form class="review" @submit.prevent="submitReport">
            <!-- Header -->
            <div class="header">
                <span class="header-title">Write a Report</span>
                <button class="close-btn" @click="$emit('close')">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </button>
            </div>

            <!-- Report To Section -->
            <div class="report-to">
                <label for="report-to">Report to</label>
                <input id="report-to" type="text" v-model="tutorName" class="disabled-input" disabled />
            </div>

            <!-- Feedback -->
            <div class="feedback">
                <label for="feedback">Description</label>
                <textarea id="feedback" v-model="description" placeholder="Write down your desciption here..."></textarea>
            </div>

            <!-- Button Area -->
            <div class="buttonarea">
                <button class="submit-btn" @click="submitReview">Submit Report</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTutorStore } from "../../../../stores/tutor";
import { useAuthStore } from "../../../../stores/auth";

const authStore = useAuthStore();
const tutorStore = useTutorStore();

const props = defineProps({
    tutorId: {
        type: String,
        required: true,
    },
});

const tutorName = ref("");
const description = ref("");

const userId = authStore.user.id;
const tutorId = tutorStore.tutor.id;

const submitReport = async () => {
    if (description.value.trim() === "") {
        alert("Description cannot be empty");
        return;
    }

    try {
        await authStore.reportTutor({
            report_by: userId,
            report_to: tutorId,
            description: description.value,
        });
    } catch (error) {
        console.error("Error submitting report:", error);
    }
};

onMounted(async () => {
    try {
        await tutorStore.fetchTutorDetails(props.tutorId);
        tutorName.value = tutorStore.tutor.name || "Unknown Tutor"; // make sure tutor name is not empty
    } catch (error) {
        console.error("Error fetching tutor name:", error);
    }
});
</script>

<style scoped>
/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.review {
    background: #ffffff;
    padding: 2rem;

    /* adjust size for review form */
    width: 550px;

    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border-radius: 8px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
}

.header-title {
    font-size: 1.2rem;
    font-weight: bold;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #8c94a3;
}

/* Report To Section */
.report-to {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.report-to label {
    font-size: 1rem;
    font-weight: 500;
}

.disabled-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 1rem;
    background-color: #e9eaf0;
    color: #6e7485;
    cursor: not-allowed;
}

/* Feedback */
.feedback {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.feedback label {
    font-size: 1rem;
    font-weight: 500;
}

.feedback textarea {
    width: 100%;
    height: 100px;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    resize: none;
    font-size: 1rem;
    color: #333;
}

.feedback textarea::placeholder {
    color: #8c94a3;
}

/* Button */
.buttonarea {
    display: flex;
    justify-content: flex-end;
    padding-right: 1rem;
}

.submit-btn {
    background: #ff6636;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
}

.submit-btn:hover {
    background: #e05530;
}
</style>
