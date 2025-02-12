<template>
    <div class="d-flex justify-content-center align-items-center" style="height: 100%" v-if="loading">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div class="d-flex flex-column min-vh-100" v-if="!loading">
        <div class="position-relative flex-fill">
            <!-- background color -->
            <div class="background position-absolute w-100 z-n1" :style="{ backgroundColor: backgroundColor }" style="height: 225px"></div>
            <!-- content -->
            <div class="m-4 p-4 d-flex flex-column justify-content-center align-items-center">
                <div class="bg-white rounded-3 w-75 gap-3 d-flex flex-column">
                    <div class="d-flex align-items-center p-4 border-bottom">
                        <img v-if="imagePreview" :src="imagePreview" width="150" height="150" alt="user picture" class="rounded-circle me-3" />
                        <div class="flex-fill">
                            <!-- Username -->
                            <span class="fs-5 fw-bold">{{ fullname }}</span>

                            <!-- Review and Students Section -->
                            <div class="d-flex justify-content-start align-items-center mt-2 gap-2">
                                <!-- Reviews Section -->
                                <div class="d-flex align-items-center gap-2">
                                    <font-awesome-icon icon="fa-solid fa-star" class="text-warning" />
                                    <span class="fw-semibold">
                                        {{ overallRate?.toFixed(1) || "-" }}
                                        <small class="text-muted">({{ reviews.length }} reviews)</small>
                                    </span>
                                </div>
                                <!-- Students Section -->
                                <div class="d-flex align-items-center gap-2">
                                    <font-awesome-icon icon="fa-solid fa-user-graduate" class="text-primary" />
                                    <span class="fw-semibold">{{ enrolledStudents }} students</span>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex gap-3">
                            <!-- whatsapp -->
                            <a v-if="whatsapp" :href="whatsapp" target="_blank" rel="noopener noreferrer" class="text-white d-flex align-items-center justify-content-center sm-btn" style="height: 36px; width: 36px">
                                <div class="text-white d-flex align-items-center justify-content-center sm-btn" style="height: 36px; width: 36px">
                                    <font-awesome-icon icon="fa-brands fa-whatsapp" class="icon" />
                                </div>
                            </a>

                            <!-- instagram -->
                            <a v-if="instagram" :href="instagram" target="_blank" rel="noopener noreferrer" class="text-white d-flex align-items-center justify-content-center sm-btn" style="height: 36px; width: 36px">
                                <div class="text-white d-flex align-items-center justify-content-center sm-btn" style="height: 36px; width: 36px">
                                    <font-awesome-icon icon="fa-brands fa-instagram" class="icon" />
                                </div>
                            </a>

                            <!-- linkedin -->
                            <a v-if="linkedln" :href="linkedln" target="_blank" rel="noopener noreferrer" class="text-white d-flex align-items-center justify-content-center sm-btn" style="height: 36px; width: 36px">
                                <div class="text-white d-flex align-items-center justify-content-center sm-btn" style="height: 36px; width: 36px">
                                    <font-awesome-icon icon="fa-brands fa-linkedin-in" class="icon" />
                                </div>
                            </a>
                        </div>
                    </div>
                    <!-- content -->
                    <div class="d-flex justify-content-center gap-3">
                        <!-- Left -->
                        <div class="left-section d-flex flex-column" style="width: 30%; gap: 1rem">
                            <!-- aboutme -->
                            <div class="aboutme p-3 rounded" style="border: 1px solid #e9eaf0">
                                <h5 class="fw-bold">About Me</h5>
                                <p style="color: #6e7485; text-align: justify; word-wrap: break-word; overflow-wrap: break-word">
                                    {{ about_me }}
                                </p>
                            </div>
                            <div class="btn-area d-flex flex-column gap-3">
                                <!-- upper：Write a Review & Write a Report (Row Layout) -->
                                <div class="d-flex gap-2">
                                    <button class="btn-orange-secondary w-50 py-2 px-3" @click="$router.push('/auth/sign_in')" v-if="!authStore.user">Sign in to Write a Review</button>

                                    <button class="btn-orange-secondary w-50 py-2 px-3" @click="showReviewModal = true" v-if="authStore.user">Write a Review</button>
                                    <ReviewModal v-if="showReviewModal" @close="showReviewModal = false" :rateBy="authStore.user.id" :tutorId="tutorId" />

                                    <button class="btn-orange-secondary w-50 py-2 px-3" @click="showReportModal = true" v-if="authStore.user">Write a Report</button>
                                    <ReportModal v-if="showReportModal" @close="showReportModal = false" :tutorId="tutorId" />
                                </div>

                                <!-- bottom：Book Sessions  -->
                                <div class="d-flex">
                                    <button class="btn-orange-primary w-50 py-2 px-3" @click="$router.push('/auth/sign_in')" v-if="!authStore.user">Sign in to Book</button>

                                    <button class="btn-orange-primary w-100 py-2 px-3" @click="sendNotificationToParent" v-if="authStore.user && authStore.user.role === 'student'">
                                        Notify Parent
                                        <span v-if="loadingNotify" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    </button>

                                    <button class="btn-orange-primary w-100 py-2 px-3 flex-1" @click="showBookSessionModal = true" v-if="authStore.user && authStore.user.role === 'parent'">Book Sessions</button>
                                    <!-- Book Session Modal -->
                                    <BookSessionModal v-if="showBookSessionModal" @close="showBookSessionModal = false" :month="session_month" :availabilityList="availabilityList" :price="price" :title="title" :tutorId="tutorId" :userId="authStore.user.id" />
                                </div>
                            </div>
                        </div>

                        <!-- right -->
                        <div class="right-section d-flex flex-column" style="width: 70%; gap: 1rem">
                            <!-- Title -->
                            <h3 class="fw-bold" style="color: #1d2026">Profile Details</h3>

                            <!-- Details Section -->
                            <div class="details p-3 rounded" style="border: 1px solid #e9eaf0">
                                <div class="d-flex justify-content-around gap-3 w-100">
                                    <!-- Left Details -->
                                    <div class="leftdetail w-50">
                                        <div class="mb-3">
                                            <label style="font-size: 1.3rem; color: #6e7485; display: block">FULL NAME</label>
                                            <span style="color: #1d2026; font-size: 1.1rem">{{ fullname }}</span>
                                        </div>
                                        <div class="mb-3">
                                            <label style="font-size: 1.3rem; color: #6e7485; display: block">PHONE NUMBER</label>
                                            <span style="color: #1d2026; font-size: 1.1rem">{{ phone_number }}</span>
                                        </div>
                                        <div class="mb-3">
                                            <label style="font-size: 1.3rem; color: #6e7485; display: block">EMAIL</label>
                                            <span style="color: #1d2026; font-size: 1.1rem">{{ email }}</span>
                                        </div>
                                        <div class="mb-3">
                                            <label style="font-size: 1.3rem; color: #6e7485; display: block">EDUCATION BACKGROUND</label>
                                            <span style="color: #1d2026; font-size: 1.1rem">{{ education_background }}</span>
                                        </div>
                                    </div>

                                    <!-- Right Details -->
                                    <div class="rightdetail w-50">
                                        <div class="mb-3">
                                            <label style="text-align: justify; font-size: 1.3rem; color: #6e7485; display: block">TEACHING EXPERIENCE</label>
                                            {{ teaching_experience }}
                                        </div>
                                        <div class="mb-3">
                                            <label style="font-size: 1.3rem; color: #6e7485; display: block">LOCATION</label>
                                            <ul style="margin: 0; padding-left: 1.2rem; list-style-type: disc; color: #1d2026; font-size: 1.1rem">
                                                <li>{{ location ? location : teaching_mode }}</li>
                                            </ul>
                                        </div>
                                        <div class="mb-3">
                                            <label style="font-size: 1.3rem; color: #6e7485; display: block">AVAILABILITY ( {{ session_month }} )</label>
                                            <ul style="margin: 0; padding-left: 1.2rem; list-style-type: disc; color: #1d2026; font-size: 1.1rem">
                                                <li v-for="item in availabilityList" :key="item">{{ item }}</li>
                                            </ul>
                                        </div>
                                        <div class="mb-3">
                                            <label style="font-size: 1.3rem; color: #6e7485; display: block">Price</label>
                                            <span style="color: #1d2026; font-size: 1.1rem">MYR {{ price }}/month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Student Feedback Section -->
                            <div class="student-feedback-section mt-4">
                                <!-- Title -->
                                <h3 class="fw-bold mb-4" style="color: #1d2026">Feedback</h3>

                                <!-- Feedback List -->
                                <div v-if="reviews.length > 0" v-for="review in reviews" :key="review.id" class="feedback-item d-flex flex-column gap-3 border-bottom pb-3 mt-3" style="border-color: #e9eaf0">
                                    <!-- Feedback Student Detail -->
                                    <div class="feedback_stud_detail d-flex align-items-center gap-3">
                                        <img v-if="authStore.user" :src="review.user.image" width="50" height="50" alt="user picture" class="rounded-circle me-3" />
                                        <div class="d-flex flex-column gap-2">
                                            <span class="fw-bold" style="color: #1d2026">{{ review.user.name }}</span>
                                            <div class="d-flex align-items-center gap-2">
                                                <font-awesome-icon v-for="n in 5" :key="n" :icon="n <= review.rate ? 'fa-solid fa-star' : 'fa-regular fa-star'" class="text-warning" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Feedback Description -->
                                    <p style="color: #4e5566; font-size: 1rem; margin: 0">{{ review.description || "No feedback provided." }}</p>
                                </div>

                                <div class="feedback-item d-flex flex-column gap-3 border-bottom pb-3 mt-3" style="border-color: #e9eaf0" v-if="reviews.length === 0">
                                    <p style="color: #4e5566; font-size: 1rem; margin: 0">No feedback provided</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import ReviewModal from "@/views/user/student&parent/component/popup_review.vue";
import BookSessionModal from "@/views/user/student&parent/component/popup_booksessions.vue";
import ReportModal from "@/views/user/student&parent/component/popup_report.vue";

import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useTutorStore } from "../../stores/tutor";

const authStore = useAuthStore();
const tutorStore = useTutorStore();
const backgroundColor = computed(() => (authStore.user?.role === "student" ? "#FFEEE8" : "#FFC7B2"));

const route = useRoute();

const loading = ref(true);
const loadingNotify = ref(false);
const tutorId = route.params.id;

const fullname = ref("");
const phone_number = ref("");
const email = ref("");
const education_background = ref("");
const teaching_experience = ref("");
const about_me = ref("");
const instagram = ref("");
const linkedln = ref("");
const whatsapp = ref("");

const teaching_mode = ref("");
const location = ref("");
const session_month = ref("");
const availabilityList = ref([]);
const price = ref("");
const title = ref("");

const reviews = ref([]);
const overallRate = ref(0);
const enrolledStudents = ref(0);

const imagePreview = ref("");

onMounted(async () => {
    try {
        if (authStore.user) {
            await authStore.fetchLinkAccount(authStore.user.id);
        }

        await tutorStore.fetchTutorDetails(tutorId);
        await tutorStore.fetchSession(tutorId);
        await tutorStore.fetchRating(tutorId);

        const tutorDetail = tutorStore.tutorDetail;
        const tutorData = tutorStore.tutor;
        const session = tutorStore.tutorSession;
        reviews.value = tutorStore.rating;
        overallRate.value = tutorStore.overallRate;

        const enrolled = await tutorStore.fetchEnrolledStudents(tutorId);
        enrolledStudents.value = enrolled.length;

        if (tutorDetail && tutorData) {
            fullname.value = tutorData.name;
            phone_number.value = tutorData.phone;
            email.value = tutorData.email;
            imagePreview.value = tutorStore.titleImage;

            education_background.value = tutorDetail.education_background || "";
            teaching_experience.value = tutorDetail.teaching_experience || "";
            about_me.value = tutorDetail.about_me || "";
            instagram.value = tutorDetail.instagram || "";
            linkedln.value = tutorDetail.linkedln || "";
            whatsapp.value = tutorDetail.whatsapp || "";
        }

        if (session) {
            teaching_mode.value = session.teaching_mode ?? "";
            location.value = session.teaching_location ?? "";
            session_month.value = session.session_month ?? "";
            price.value = session.price ?? "";
            title.value = session.title ?? "";

            if (session.session_day) {
                const dayMapping = {
                    monday: "Monday",
                    tuesday: "Tuesday",
                    wednesday: "Wednesday",
                    thursday: "Thursday",
                    friday: "Friday",
                    saturday: "Saturday",
                    sunday: "Sunday",
                };

                availabilityList.value = [];

                const dayList = session.session_day.slice(1, -1).split(",");

                for (let i = 0; i < dayList.length; i++) {
                    if (dayList[i].includes("true")) {
                        const dayName = dayMapping[Object.keys(dayMapping)[i]];
                        const slot = `${dayName} ${session.session_time}`;

                        const isEnrolled = enrolled.some((enroll) => enroll.day === dayName && enroll.month === session_month.value && enroll.time_slot === session.session_time);

                        if (!isEnrolled) {
                            availabilityList.value.push(slot);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

    loading.value = false;
});

const showReviewModal = ref(false);
const showBookSessionModal = ref(false);
const showReportModal = ref(false);

const sendNotificationToParent = async () => {
    loadingNotify.value = true;

    try {
        await authStore.fetchLinkAccount(authStore.user.id);

        const emailTitle = "Request to book session";
        const name = authStore.linkAccount.name;
        const mail_to = authStore.linkAccount.email;
        const customTemplate = {
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #2c3e50;">Request to Book a Session</h2>

                    <p><strong>Student:</strong> ${authStore.user.name} (<a href="mailto:${authStore.user.email}" style="color: #3498db; text-decoration: none;">${authStore.user.email}</a>)</p>
                    <p><strong>Tutor:</strong> ${tutorStore.tutor.name} (<a href="mailto:${tutorStore.tutor.email}" style="color: #3498db; text-decoration: none;">${tutorStore.tutorDetail.email}</a>)</p>

                    <hr style="border: none; border-top: 1px solid #ccc;">

                    <p><strong>Title:</strong> ${title.value}</p>
                    <p><strong>Session:</strong> ${session_month.value}</p>

                    <p><strong>Availability:</strong></p>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${availabilityList.value.map((day) => `<li>${day}</li>`).join("")}
                    </ul>

                    <hr style="border: none; border-top: 1px solid #ccc;">

                    <h3 style="color: #e67e22;">Price: ${price.value}</h3>

                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${window.location.href}"
                        style="background-color: #e67e22; color: #fff; padding: 12px 20px; border-radius: 5px; text-decoration: none; display: inline-block; font-weight: bold;">
                            Click here to view tutor details
                        </a>
                    </div>
                </div>
            `,
        };

        await authStore.sendEmail(emailTitle, name, mail_to, customTemplate, "refresh");
    } catch (error) {
        console.error("Error sending notification:", error);
        alert("Failed to send notification to parent. Please try again.");
    }
    loadingNotify.value = false;
};
</script>

<style scoped>
.btn-orange-primary {
    background-color: #ff6636;
    color: #ffeee8;
    border-radius: 2px;
    border: none;
}
.btn-orange-secondary {
    background-color: #ffeee8;
    color: #ff6636;
    border-radius: 2px;
    border: none;
}
.nav-item .btn {
    /* padding: 0.5rem 2rem;         */
    font-size: 1rem;
    color: #1d2026;
    background-color: transparent;
    border: none;
    border-radius: 0;
    height: 100%;
}

.nav-item .btn:hover {
    background-color: #f5f7fa;
}

.nav-item .btn.active {
    background-color: #ffffff;
    border-bottom: 3px solid #ff6636;
}
.sm-btn {
    background-color: #f5f7fa;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s, color 0.3s;
}
.sm-btn .icon {
    color: #333333;
    transition: color 0.3s;
}
.sm-btn:hover {
    background-color: #ff6636;
    transform: scale(1.1);
    box-shadow: 0 0 10px 2px rgba(255, 102, 54, 0.8);
}
.sm-btn:hover .icon {
    color: #f5f7fa !important;
}
</style>
