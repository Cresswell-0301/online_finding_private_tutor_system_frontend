<template>
    <div class="d-flex gap-5" style="background-color: #f0f2f5">
        <div class="flex-fill d-flex align-items-center">
            <div class="w-auto ms-auto">
                <p class="fw-bold" style="font-size: 4vw">
                    Learn with expert <br />
                    anytime anywhere
                </p>
                <p style="font-size: 1vw">
                    Our mission is to help peolpe to find the best tutor <br />
                    and learn with expert anytime, anywhere
                </p>
                <div class="btn btn-orange" type="button" v-if="showCreateBtn">Create Account</div>
            </div>
        </div>

        <div style="width: 45%; height: 100%">
            <img src="@/assets/png/home_page.png" alt="" class="img-fluid" style="clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 1% 100%)" />
        </div>
    </div>

    <div class="d-flex flex-column align-items-center justify-content-center" style="height: 50vh">
        <h3 class="fw-bold">Tutor Recommended</h3>
        <p v-if="!showRecommendedTutors" class="text-muted mt-4">No recommended tutors</p>

        <div v-else class="container-sm" style="height: 60%">
            <div id="recommendedTutorCarousel" class="carousel carousel-dark slide" data-bs-ride="carousel" style="height: 100%">
                <!-- Carousel Indicators -->
                <div class="carousel-indicators">
                    <button v-for="(tutor, index) in tutorStore.recommendedTutors" :key="index" type="button" data-bs-target="#recommendedTutorCarousel" :data-bs-slide-to="index" :class="{ active: index === 0 }" :aria-current="index === 0 ? 'true' : false" :aria-label="'Slide ' + (index + 1)"></button>
                </div>

                <!-- Carousel Items -->
                <div class="carousel-inner" style="height: 100%">
                    <div v-for="(tutor, index) in tutorStore.recommendedTutors" :key="index" class="carousel-item" :class="{ active: index === 0 }" style="height: 100%">
                        <router-link :to="`/tutor_details/${tutor.user_id}`" class="text-decoration-none" style="height: 100%">
                            <img :src="tutor.title_image" class="d-block w-auto mx-auto" style="height: 100%; object-fit: cover" :alt="tutor.title_image" />
                            <div class="carousel-caption d-none d-md-block">
                                <p class="fw-bold mb-1 d-flex justify-content-between align-items-center">
                                    <span>MYR {{ tutor.session.price }}</span>
                                    <small class="text-muted p-1 rounded" style="background-color: #ffe5b4"> Per Session </small>
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="fw-bold mb-2">{{ tutor.session.title }}</h5>
                                </div>
                                <div class="mt-auto">
                                    <hr style="border: 1px solid #e0e0e0; margin: 0.5rem 0" />
                                    <p class="d-flex justify-content-between align-items-center">
                                        <span>
                                            <span style="color: #ffc107">★</span>
                                            <small style="margin-left: 4px" class="text-muted">
                                                {{ tutor.overallRate.toFixed(1) || 0 }}
                                            </small>
                                        </span>
                                        <small class="text-muted"> {{ tutor.enrolledStudent }} Enrolled </small>
                                    </p>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>

                <!-- Carousel Controls -->
                <button class="carousel-control-prev" type="button" data-bs-target="#recommendedTutorCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#recommendedTutorCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        <RouterLink to="/tutor_list" class="btn btn-orange mt-4">
            <button class="btn btn-orange">Browse All Tutor</button>
        </RouterLink>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useTutorStore } from "@/stores/tutor.js";
import { RouterLink } from "vue-router";

const tutorStore = useTutorStore();

onMounted(async () => {
    await tutorStore.fetchTutors();
    showRecommendedTutors.value = tutorStore.tutors.length > 0;
});

const showCreateBtn = ref(false);
const showRecommendedTutors = ref(false);
</script>

<style scoped>
.card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
}
</style>
