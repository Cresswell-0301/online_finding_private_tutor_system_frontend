<template>
    <div class="dboardcontent mx-5">
        <div class="profilebar">
            <div class="profile-avatar">
                <img :src="useAuthStore().image" alt="Tutor Avatar" class="avatar" />
            </div>

            <div class="profile-info">
                <span class="tutor-name">{{ user.name }}</span>
                <span class="tutor-email">{{ user.email }}</span>
            </div>

            <div class="profile-action">
                <RouterLink to="/tutor/profile">
                    <button class="edit-btn">Edit Profile</button>
                </RouterLink>
            </div>
        </div>

        <div class="databar">
            <div class="data-box">
                <div class="icon-div">
                    <font-awesome-icon icon="fa-solid fa-user-graduate" class="icon" />
                </div>
                <div class="info-div">
                    <span class="data">{{ students.length }}</span>
                    <span class="label">Students</span>
                </div>
            </div>

            <div class="data-box">
                <div class="icon-div">
                    <font-awesome-icon icon="fa-solid fa-wallet" class="icon" />
                </div>
                <div class="info-div">
                    <span class="data">MYR {{ amount }}</span>
                    <span class="label">Total Earning</span>
                </div>
            </div>

            <div class="data-box">
                <div class="icon-div">
                    <font-awesome-icon icon="fa-solid fa-calendar-alt" class="icon" />
                </div>
                <div class="info-div">
                    <span class="data">{{ sessions.length }}</span>
                    <span class="label">{{ sessions[0]?.teaching_mode ?? "" }} Sessions</span>
                </div>
            </div>

            <!-- <div class="data-box">
              <div class="icon-div">
                  <font-awesome-icon icon="fa-solid fa-person-walking-luggage" class="icon" />
              </div>
              <div class="info-div">
                  <span class="data">1</span>
                  <span class="label">Physical Sessions</span>
              </div>
          </div> -->
        </div>
        <div class="infobar">
            <div class="schedule">
                <div class="schedule-header">
                    <span class="schedule-label">Schedule</span>
                </div>

                <div class="schedule-content">
                    <div class="content-row" v-for="(sd, index) in scheduleData" :key="index">
                        <div class="content-icon">
                            <font-awesome-icon icon="fa-solid fa-calendar-alt" class="icon" />
                        </div>

                        <div class="content">
                            <span class="student-name">{{ sd.student }}</span>
                            <span class="student-session">{{ sd.time }}</span>
                            <span class="session-method" :class="sd.method === 'Online' ? 'online' : 'physical'">
                                {{ sd.method }}
                            </span>
                        </div>
                    </div>

                    <div class="no-schedule d-flex" v-if="scheduleData.length === 0" style="justify-content: center; align-items: center; height: 100rem">
                        <span class="no-schedule-text">No schedule found</span>
                    </div>
                </div>
            </div>

            <div class="right-section">
                <div class="overall-rating">
                    <div class="rating-header">
                        <span class="rating-label">Overall Rating</span>
                    </div>

                    <div class="rating-content">
                        <div class="average-rating">
                            <span class="rating-number">{{ overallRate.toFixed(1) }}</span>
                            <span class="rating-text">Overall Rating</span>
                        </div>

                        <div class="rating-progress">
                            <div class="progress-row" v-for="star in [5, 4, 3, 2, 1]" :key="star">
                                <span class="star-label">{{ star }} Star</span>
                                <div class="progress-bar">
                                    <div class="filled-bar" :style="{ width: ratingStats.ratingPercentages[star] + '%' }"></div>
                                </div>
                                <span class="percentage">{{ ratingStats.ratingPercentages[star] }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "../../../stores/auth";
import { useTutorStore } from "../../../stores/tutor";

const user = useAuthStore().user;
const tutor = useTutorStore();

const students = ref([]);
const amount = ref(0);
const sessions = ref([]);

const scheduleData = ref([]);
const ratings = ref([]);
const overallRate = ref(0);

onMounted(async () => {
    try {
        await tutor.fetchTutorDashboard(user.id);
        const schedules = await tutor.fetchSchedule(user.id);
        await tutor.fetchRating(user.id);

        ratings.value = tutor.rating.map((rating) => rating.rate);
        overallRate.value = tutor.overallRate;

        students.value = tutor.students;
        amount.value = tutor.amount;
        sessions.value = tutor.tutorSession;

        scheduleData.value = schedules.map((schedule) => {
            return {
                student: schedule.user.name,
                time: schedule.month + " ( " + schedule.day + " ) " + schedule.time_slot,
                method: schedule.session.teaching_mode,
            };
        });
    } catch (error) {
        console.error(error);
    }
});

const calculateRatings = (ratings) => {
    const totalRatings = ratings.length || 0;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const ratingPercentages = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalRatings > 0) {
        ratings.forEach((rating) => {
            if (rating >= 1 && rating <= 5) {
                ratingCounts[rating] += 1;
            }
        });

        Object.keys(ratingCounts).forEach((star) => {
            ratingPercentages[star] = ((ratingCounts[star] / totalRatings) * 100).toFixed(1);
        });
    }

    return { totalRatings, ratingCounts, ratingPercentages };
};

const ratingStats = computed(() => calculateRatings(ratings.value));
</script>

<style scoped>
/* Main container */
.dboardcontent {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Profile Bar */
.profilebar {
    background-color: #111033;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 1.5rem;
    /* border-radius: 10px; */
}

/* Left - Tutor Avatar */
.profile-avatar .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}

/* Center - Tutor Info */
.profile-info {
    display: flex;
    flex-direction: column;
    text-align: left;
    flex-grow: 1;
    padding-left: 2rem;
}

.tutor-name {
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: bold;
}

.tutor-email {
    color: #ffffff;
    font-size: 1rem;
    font-weight: 300;
}

/* Right - Edit Profile Button */
.profile-action .edit-btn {
    background-color: #ff6636;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    /* border-radius: 5px; */
    cursor: pointer;
    transition: background-color 0.3s;
}

.profile-action .edit-btn:hover {
    background-color: #e05530;
}
/* `databar` - row layout */
.databar {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.5rem;
}

/* Data Box - */
.data-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background: #ffffff;
    /* border-radius: 10px; */
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    flex: 1;
}

/* icon */
.icon-div {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    width: 50px;
    height: 50px;
    /* border-radius: 50%; */
    margin-right: 1rem;
}

/* Icon  */
.icon {
    font-size: 1.5rem;
    color: #ff6636;
}

/* right info (data) */
.info-div {
    display: flex;
    flex-direction: column;
    text-align: left;
}

/* Data  */
.data {
    font-size: 1.4rem;
    font-weight: bold;
    color: #1d2026;
}

/* Label  */
.label {
    font-size: 1rem;
    font-weight: 300;
    color: #6e7485;
}
/* infobar - Row Layout */
.infobar {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
}

/* Schedule Section */
.schedule {
    display: flex;
    flex-direction: column;
    width: 50%;
    min-width: 40%;
    background: #ffffff;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Schedule Header */
.schedule-header {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e9eaf0;
    margin-bottom: 0.5rem;
}

.schedule-label {
    font-size: 1.3rem;
    font-weight: 600; /* SemiBold */
    color: #1d2026;
}

/* Schedule Content (Scrollable) */
.schedule-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 300px;
    overflow-y: auto;
    padding-right: 0.5rem; /* prevent scroll bar block content */
}

/* Scrollbar Styling */
.schedule-content::-webkit-scrollbar {
    width: 6px;
}

.schedule-content::-webkit-scrollbar-track {
    background: #f3f4f6;
}

.schedule-content::-webkit-scrollbar-thumb {
    background: #bdbdbd;
    border-radius: 6px;
}

/* Content Row - */
.content-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* Left: Content Icon */
.content-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.icon {
    font-size: 1.2rem;
    color: #ff6636;
}

/* Right: Content Information */
.content {
    display: flex;
    flex-direction: column;
    text-align: left;
}

/* Student Name */
.student-name {
    font-size: 1rem;
    font-weight: bold;
    color: #1d2026;
}

/* Session Time */
.student-session {
    font-size: 0.9rem;
    font-weight: 400;
    color: #6e7485;
}

/* Session Method */
.session-method {
    font-size: 0.85rem;
    font-weight: bold;
    border-radius: 5px;
    padding: 2px 8px;
    width: fit-content;
}

/* Online & Physical Style */
.online {
    background: #e3fcef;
    color: #28a745;
}

.physical {
    background: #ffebe6;
    color: #ff6636;
}
/* Right Section */
.right-section {
    display: flex;
    flex-direction: column;
    width: 45%;
}

/* Overall Rating  */
.overall-rating {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Header -  */
.rating-header {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e9eaf0;
    margin-bottom: 0.5rem;
}

.rating-label {
    font-size: 1.3rem;
    font-weight: 600;
    color: #1d2026;
}

/* Rating Content (Row Layout) */
.rating-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

/* left average rating */
.average-rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 30%;
}

.rating-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #1d2026;
}

.rating-text {
    font-size: 1rem;
    font-weight: 400;
    color: #6e7485;
}

/* right progress bar */
.rating-progress {
    display: flex;
    flex-direction: column;
    width: 65%;
    gap: 0.5rem;
}

/* single bar */
.progress-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* star */
.star-label {
    width: 70px;
    font-size: 1rem;
    font-weight: 400;
    color: #6e7485;
}

/* bar */
.progress-bar {
    width: 100%;
    height: 10px;
    background: #e9eaf0;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
}

/* filled bar */
.filled-bar {
    height: 100%;
    background: #fd8e1f;
    transition: width 0.5s ease-in-out;
}

/*percentage */
.percentage {
    font-size: 1rem;
    font-weight: 400;
    color: #6e7485;
}
</style>
