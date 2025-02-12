<template>
    <div class="w-75 m-3">
        <div class="container py-4">
            <h3 class="mb-4">Tutors</h3>

            <!-- Search Bar -->
            <div><h4 class="search-title">Search:</h4></div>

            <div class="search-container d-flex justify-content-start w-50 position-relative mb-4">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon" />
                <input type="text" class="form-control search-input" placeholder="Search in your tutors..." v-model="searchQuery" />
            </div>

            <!-- Check if tutors list is empty -->
            <div v-if="tutors.length === 0" class="no-tutor-message text-center">No any Tutor are enrolled</div>

            <!-- Card Grid -->
            <div class="row">
                <div class="col-md-3" v-for="tutor in tutors" :key="tutor.id">
                    <div class="card text-center shadow-sm mb-4">
                        <img :src="tutor.title_image" alt="profile" class="card-img-top" />
                        <div class="card-body">
                            <h5 class="card-title">{{ tutor.name }}</h5>
                            <span class="card-text text-muted">{{ tutor.session.title }}</span>
                            <div class="card-text pb-3 border-bottom text-muted">
                                <p class="p-0 m-0" v-for="session in tutor.enrolledSession">{{ session.day }}: {{ session.time_slot }}</p>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="text-warning"> <i class="bi bi-star-fill"></i> {{ tutor?.overallRate?.toFixed(1) }} </span>

                                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />

                                <span class="text-weight-bold">{{ tutor.enrolledStudent }} <span class="textgrey">students</span></span>
                            </div>

                            <div class="d-flex flex-column gap-2 mt-3">
                                <router-link :to="`/tutor_details/${tutor.user_id}`">
                                    <button class="btn btn-detail btn-sm w-100">Detail</button>
                                </router-link>

                                <button class="btn btn-review btn-outline btn-sm w-100" @click="toggleReviewModal(tutor.user_id)">Review</button>
                            </div>
                        </div>
                    </div>
                    <ReviewModal style="z-index: 100" v-if="showReviewModal[tutor.user_id]" @close="showReviewModal[tutor.user_id] = false" :rateBy="authStore.user.id" :tutorId="tutor.user_id" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import ReviewModal from "@/views/user/student&parent/component/popup_review.vue";
import { onMounted, ref, watch } from "vue";
import { useTutorStore } from "../../../../stores/tutor";
import { useAuthStore } from "../../../../stores/auth";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const tutorStore = useTutorStore();

const showReviewModal = ref({});
const searchQuery = ref("");
const tutors = ref([]);

const fetchTutors = async () => {
    try {
        await tutorStore.fetchEnrolledTutorDetails(authStore.user.id, searchQuery.value);
        tutors.value = tutorStore.tutors;
        console.log("Tutors:", tutors.value);
    } catch (error) {
        console.error("Error fetching tutors:", error);
    }
};

watch(searchQuery, async () => {
    await fetchTutors();
});

onMounted(fetchTutors);

const toggleReviewModal = (tutorId) => {
    showReviewModal.value[tutorId] = !showReviewModal.value[tutorId];
};
</script>

<style>
.container {
    margin-top: 20px;
}
/* No Tutor Message */
.no-tutor-message {
    font-size: 1.4rem;
    font-weight: 300;
    color: #6e7485;
    background-color: #f5f4f4;
    text-align: center;
    padding: 2rem;
}
/* ✅ Search Container */
.search-container {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 12px;
    font-size: 1rem;
    color: #6e7485;
}
.search-title {
    color: #6e7485;
    font-size: 0.9rem;
    font-weight: normal;
}
.search-input {
    padding-left: 36px;
    border-radius: 0;
}

.card {
    /* border-radius: 15px; */
    overflow: hidden;
    transition: transform 0.3s;
}

.card:hover {
    transform: translateY(-5px);
}

/* Fixed Image Size */
.card-img-top {
    width: 312px;
    height: 312px;
    object-fit: cover;
    margin: auto;
}
.textgrey {
    color: #6e7485;
}

/* Pagination Styling */
.pagination .page-item {
    cursor: pointer;
}

.pagination .page-item.active .page-link {
    background-color: #ff6600;
    border-color: #ff6600;
    color: white;
}

.pagination .page-link {
    color: #ff6600;
}

.d-flex {
    display: flex;
}

.justify-content-between {
    justify-content: space-between;
}

.align-items-center {
    align-items: center;
}

.btn-review {
    background-color: #ff6600; /* orange */
    color: white;
}

.btn-detail {
    background-color: rgba(255, 102, 0, 0.2); /* light orange */
    color: #ff6600; /* orange */
    font-weight: 500;
    border-radius: 0;
}
</style>
