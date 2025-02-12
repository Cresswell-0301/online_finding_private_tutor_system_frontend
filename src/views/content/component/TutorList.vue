<template>
    <div class="container">
        <div>
            <h1 class="text-center">Tutor List</h1>
            <!-- Sorting Options -->
            <div class="text-center my-3">
                <label for="sortSelect" class="me-2 fw-bold">Sort by:</label>
                <select id="sortSelect" v-model="selectedSort" class="form-select w-auto d-inline-block" @change="applySort">
                    <option value="">Default</option>
                    <option value="ratingDesc">Rating (High to Low)</option>
                    <option value="ratingAsc">Rating (Low to High)</option>
                    <option value="priceAsc">Price (Low to High)</option>
                    <option value="priceDesc">Price (High to Low)</option>
                </select>
            </div>
        </div>
        <!-- Tutor List -->
        <div class="container d-flex justify-content-center align-items-center flex-column">
            <div class="row mt-4 col-md-12">
                <div v-for="(tutor, index) in tutorStore.tutors" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                    <router-link :to="`/tutor_details/${tutor.user_id}`" class="text-decoration-none">
                        <div class="card h-100 d-flex flex-column">
                            <img :src="tutor.title_image" class="rounded-t-lg object-cover" :alt="tutor.title_image" />
                            <div class="card-body d-flex flex-column flex-grow-1">
                                <p class="fw-bold mb-1 d-flex justify-content-between align-items-center">
                                    <span>MYR {{ tutor.session.price }}</span>
                                    <small class="text-muted p-1 rounded" style="background-color: #ffe5b4">Per Month</small>
                                </p>
                                <h5 class="fw-bold mb-2">{{ tutor.session.title }}</h5>
                                <div class="mt-auto">
                                    <hr style="border: 1px solid #e0e0e0; margin: 0.5rem 0" />
                                    <p class="d-flex justify-content-between align-items-center">
                                        <span>
                                            <span style="color: #ffc107">★</span>
                                            <small class="text-muted" style="margin-left: 4px">{{ tutor.overallRate.toFixed(1) || 0 }}</small>
                                        </span>
                                        <small class="text-muted">{{ tutor.enrolledStudent }} Enrolled</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
            <!-- Pagination (omitted for brevity) -->
            <nav aria-label="Tutor pagination">
                <ul class="pagination">
                    <li class="page-item" :class="{ disabled: tutorStore.currentPage === 1 }">
                        <button class="page-link" @click="changePage(tutorStore.currentPage - 1)" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>

                    <li v-for="page in tutorStore.totalPages" :key="page" class="page-item" :class="{ active: page === tutorStore.currentPage }">
                        <button class="page-link" @click="changePage(page)">{{ page }}</button>
                    </li>

                    <li class="page-item" :class="{ disabled: tutorStore.currentPage === tutorStore.totalPages }">
                        <button class="page-link" @click="changePage(tutorStore.currentPage + 1)" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTutorStore } from "@/stores/tutor.js";
import { RouterLink } from "vue-router";

const tutorStore = useTutorStore();
const selectedSort = ref("");

// Helper function to extract sortBy and sortOrder from the selectedSort value.
const getSortParams = () => {
    let sortBy = "";
    let sortOrder = "";

    if (selectedSort.value.startsWith("rating")) {
        sortBy = "rating";
        sortOrder = selectedSort.value === "ratingDesc" ? "desc" : "asc";
    } else if (selectedSort.value.startsWith("price")) {
        sortBy = "price";
        sortOrder = selectedSort.value === "priceDesc" ? "desc" : "asc";
    }
    return { sortBy, sortOrder };
};

const applySort = () => {
    const { sortBy, sortOrder } = getSortParams();
    tutorStore.fetchTutors(1, sortBy, sortOrder); // Fetch from page 1 with sort params.
};

const changePage = (page) => {
    if (page >= 1 && page <= tutorStore.totalPages) {
        tutorStore.fetchTutors(page);
    }
};

onMounted(async () => {
    tutorStore.fetchTutors();
});
</script>
