<template>
    <div v-if="tutor">
        <div class="container bg-white p-5">
            <h4>Tutor Details</h4>
            <div class="row mb-3">
                <div class="col-sm-6 col-md-8">
                    <div class="mb-3">
                        <label for="fullname" class="form-label">Full Name </label>
                        <input type="text" class="form-control" id="fullname" v-model="tutor.user.name" readonly />
                    </div>
                    <label for="phone_number" class="form-label">Phone Number</label>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" id="phone_number" v-model="tutor.user.phone" readonly />
                    </div>

                    <div class="row mb-3 align-items-end">
                        <div class="col">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" v-model="tutor.user.email" aria-describedby="emailHelp" readonly />
                        </div>

                        <div class="col">
                            <label for="education_background" class="form-label">Education Background</label>
                            <input type="text" class="form-control" id="education_background" v-model="tutor.education_background" readonly />
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-md-4">
                    <div class="mb-3">
                        <label for="profile_picture" class="form-label">Profile Picture</label>
                        <br />
                        <img :src="'http://127.0.0.1:8000' + tutor.user.image" alt="" class="img-fluid mt-2" style="max-width: 163px; height: auto" />
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <label for="teaching_experience" class="form-label">Teaching Experience</label>
                <textarea class="form-control" id="teaching_experience" v-model="tutor.teaching_experience" rows="1" readonly></textarea>
            </div>
            <div>
                <label for="about_me" class="form-label">About Me</label>
                <textarea class="form-control" id="about_me" v-model="tutor.about_me" rows="4" readonly></textarea>
            </div>
        </div>

        <div class="container bg-white p-5 my-4">
            <h4>Social Profile</h4>
            <div class="row mb-3">
                <div class="col">
                    <label for="instagram" class="form-label">Instagram</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <font-awesome-icon icon="fa-brands fa-instagram" style="color: #ff6636" />
                        </span>
                        <input type="text" class="form-control" id="instagram" v-model="tutor.instagram" readonly />
                    </div>
                </div>
                <div class="col">
                    <label for="linkedln" class="form-label">LinkedIn</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <font-awesome-icon icon="fa-brands fa-linkedin-in" style="color: #ff6636" />
                        </span>
                        <input type="text" class="form-control" id="linkedln" v-model="tutor.linkedln" readonly />
                    </div>
                </div>
                <div class="col">
                    <label for="whatsapp" class="form-label">WhatsApp</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <font-awesome-icon icon="fa-brands fa-whatsapp" style="color: #ff6636" />
                        </span>
                        <input type="text" class="form-control" id="whatsapp" v-model="tutor.whatsapp" readonly />
                    </div>
                </div>
            </div>
        </div>

        <div class="container bg-white p-5 my-4">
            <!-- Title -->
            <h4>Feedback</h4>

            <!-- Feedback List -->
            <div v-if="reviews.length > 0" v-for="review in reviews" :key="review.id" class="feedback-item d-flex flex-column gap-3 border-bottom pb-3 mt-3" style="border-color: #e9eaf0">
                <div class="feedback_stud_detail d-flex align-items-center gap-3">
                    <img v-if="authStore.user" :src="review.user.image" width="50" height="50" alt="user picture" class="rounded-circle me-3" />
                    <div class="d-flex flex-column gap-2">
                        <span class="fw-bold" style="color: #1d2026">{{ review.user.name }}</span>
                        <div class="d-flex align-items-center gap-2">
                            <font-awesome-icon v-for="n in 5" :key="n" :icon="n <= review.rate ? 'fa-solid fa-star' : 'fa-regular fa-star'" class="text-warning" />
                        </div>
                    </div>
                </div>

                <p style="color: #4e5566; font-size: 1rem; margin: 0">{{ review.description || "No feedback provided." }}</p>
            </div>

            <div class="feedback-item d-flex flex-column gap-3 border-bottom pb-3 mt-3" style="border-color: #e9eaf0" v-if="reviews.length === 0">
                <p style="color: #4e5566; font-size: 1rem; margin: 0">No feedback provided</p>
            </div>
        </div>

        <div class="container d-flex flex-row-reverse gap-3">
            <div class="btn btn-orange" @click="tutorStore.updateStatus(tutor.id, 'approved', email, name)">Approve</div>
            <div class="btn btn-orange" @click="tutorStore.updateStatus(tutor.id, 'rejected', email, name)">Reject</div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useTutorStore } from "@/stores/tutor.js";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const tutorStore = useTutorStore();
const authStore = useAuthStore();
const tutorId = router.currentRoute.value.params.id;
const reviews = ref([]);

const tutor = ref();
const email = ref("");
const name = ref("");

onMounted(async () => {
    await tutorStore.fetchTutors();
    await tutorStore.fetchPendingTutors();

    let found = tutorStore.pendingTutors.find((tutor) => tutor.id === parseInt(tutorId));
    if (!found) {
        found = tutorStore.tutors.find((tutor) => tutor.id === parseInt(tutorId));
    }
    tutor.value = found;
    email.value = tutor.value.user.email;
    name.value = tutor.value.user.name;

    await tutorStore.fetchRating(tutor.value.user_id);
    reviews.value = tutorStore.rating;
});
</script>
