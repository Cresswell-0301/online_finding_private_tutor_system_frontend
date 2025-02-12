<template>
    <!-- Page background wrapper -->
    <div class="min-h-screen bg-gray-100">
        <!-- Top-level container -->
        <div class="mx-auto max-w-7xl py-8 px-4">
            <!-- Page heading -->
            <h1 class="text-2xl font-semibold text-gray-800 mb-6">Sessions</h1>

            <!-- Form Container -->
            <div class="session-form-container bg-white rounded-md shadow">
                <!-- Header -->
                <div class="session-header">
                    <div class="sessions_select">
                        <font-awesome-icon icon="fa-solid fa-bars-progress" class="icon" />
                        <h2>Session</h2>
                    </div>
                </div>

                <form @submit.prevent="saveSession" class="session-form">
                    <!-- Title -->
                    <div class="form-group">
                        <label for="title">Title</label>
                        <input v-model="title" id="title" placeholder="Your course title" maxlength="80" required />
                    </div>

                    <!-- Subtitle -->
                    <div class="form-group">
                        <label for="description">Subtitle</label>
                        <textarea v-model="description" id="description" placeholder="Course subtitle" required></textarea>
                    </div>

                    <!-- Course Language -->
                    <div class="form-group">
                        <label for="courseLanguage">Course Language</label>
                        <select v-model="courseLanguage" id="courseLanguage" required>
                            <option value="" disabled>Select...</option>
                            <option value="English" default>English</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Malay">Malay</option>
                        </select>
                    </div>

                    <!-- Price -->
                    <div class="form-group">
                        <label for="price">Price</label>
                        <div class="price-input">
                            <span>MYR</span>
                            <input v-model="price" id="price" placeholder="Price" required min="0" step="0.01" type="number" />
                            <span>/ MONTH</span>
                        </div>
                    </div>

                    <!-- Session Month -->
                    <div class="form-group">
                        <label for="sessionMonth">Session Month</label>
                        <select v-model="sessionMonth" id="sessionMonth" required>
                            <option value="" disabled>Select month</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </div>

                    <!-- ✅ Working Days -->
                    <div class="form-group">
                        <label>Working Day</label>
                        <div class="checkbox-group">
                            <label v-for="(day, key) in workingDays" :key="key" class="custom-checkbox">
                                <input type="checkbox" v-model="workingDays[key]" />
                                <span>{{ key.charAt(0).toUpperCase() + key.slice(1) }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Session Time -->
                    <div class="form-group">
                        <label for="sessionTime">Session Time (2 hours)</label>
                        <select v-model="sessionTime" id="sessionTime" required>
                            <option value="" disabled>Select your 2-hour slot...</option>
                            <option value="08:00-10:00">08:00 - 10:00</option>
                            <option value="10:00-12:00">10:00 - 12:00</option>
                            <option value="13:00-15:00">13:00 - 15:00</option>
                            <option value="15:00-17:00">15:00 - 17:00</option>
                            <option value="18:00-20:00">18:00 - 20:00</option>
                            <option value="20:00-22:00">20:00 - 22:00</option>
                        </select>
                    </div>

                    <!-- ✅ Teaching Mode -->
                    <div class="form-group">
                        <label>Teaching Mode</label>
                        <div class="radio-group">
                            <label class="custom-radio">
                                <input type="radio" v-model="teachingMode" value="Online" required />
                                <span>Online</span>
                            </label>
                            <label class="custom-radio">
                                <input type="radio" v-model="teachingMode" value="Physical" required />
                                <span>Physical</span>
                            </label>
                            <label class="custom-radio">
                                <input type="radio" v-model="teachingMode" value="Online & Physical" required />
                                <span>Both</span>
                            </label>
                        </div>
                    </div>

                    <!-- Teaching Location -->
                    <div v-if="teachingMode === 'Physical' || teachingMode === 'Online & Physical'" class="form-group">
                        <label for="teachingLocation">Teaching Location</label>
                        <input v-model="teachingLocation" id="teachingLocation" placeholder="Teaching Location" required />
                    </div>

                    <!-- Save button -->
                    <div class="buttonarea">
                        <button type="submit" class="btn-orange">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useAuthStore } from "../../../stores/auth";
import { useTutorStore } from "../../../stores/tutor";

const authStore = useAuthStore();
const tutorStore = useTutorStore();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentMonth = months[new Date().getMonth()];

const title = ref("");
const description = ref("");
const courseLanguage = ref("");
const price = ref("");
const sessionMonth = ref(currentMonth);
const workingDays = reactive({
    monday: false,
    tuesday: false,

    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
});
const sessionTime = ref("");
const teachingMode = ref("");
const teachingLocation = ref("");

onMounted(async () => {
    try {
        await tutorStore.fetchSession(authStore.user.id);
        const data = tutorStore.tutorSession;

        if (data) {
            let sessionDayObj = {};

            try {
                sessionDayObj = JSON.parse(data.session_day);
            } catch (err) {
                console.warn("Failed to parse session_day JSON:", err);
                sessionDayObj = {};
            }

            title.value = data.title;
            description.value = data.description;
            courseLanguage.value = data.course_language;
            price.value = data.price;
            sessionMonth.value = data.session_month || currentMonth;

            workingDays.monday = !!sessionDayObj.monday;
            workingDays.tuesday = !!sessionDayObj.tuesday;
            workingDays.wednesday = !!sessionDayObj.wednesday;
            workingDays.thursday = !!sessionDayObj.thursday;
            workingDays.friday = !!sessionDayObj.friday;
            workingDays.saturday = !!sessionDayObj.saturday;
            workingDays.sunday = !!sessionDayObj.sunday;

            sessionTime.value = data.session_time;
            teachingMode.value = data.teaching_mode;
            teachingLocation.value = data.teaching_location;
        }
    } catch (error) {
        console.log(error);
    }
});

const saveSession = async () => {
    await tutorStore.addSession(
        {
            title: title.value,
            description: description.value,
            course_language: courseLanguage.value,
            price: price.value,
            session_month: sessionMonth.value,
            session_day: {
                monday: workingDays.monday,
                tuesday: workingDays.tuesday,
                wednesday: workingDays.wednesday,
                thursday: workingDays.thursday,
                friday: workingDays.friday,
                saturday: workingDays.saturday,
                sunday: workingDays.sunday,
            },
            session_time: sessionTime.value,
            teaching_mode: teachingMode.value,
            teaching_location: teachingLocation.value,
        },
        authStore.user.id
    );
};
</script>

<style scoped>
.session-form-container {
    display: flex;
    flex-direction: column;
    padding: 2rem;
}

/* Session Header */
.session-header {
    display: flex;
    /* flex-direction: row; */
    /* align-items: center; */
    /* border-bottom: 1px solid #e0e0df; */
}
.sessions_select {
    padding: 0 1rem;
    display: flex;
    flex-direction: row;
    border-bottom: 2px solid #ff6636;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    /* align-items: center; */
}

.session-header .icon {
    font-size: 1.5rem;
    color: #ff6636;
    margin-right: 0.5rem;
}

.session-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1d2026;
}

.session-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}
.form-group select {
    width: 250px;
}

.form-group label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #6e7485;
    margin-bottom: 0.3rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 0.5rem;
    font-size: 1rem;
}

.price-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.price-input span {
    font-size: 1rem;
    color: #6e7485;
}

.checkbox-group,
.radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.custom-checkbox,
.custom-radio {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: color 0.3s ease-in-out;
}

/* ✅ custom */
.custom-checkbox input,
.custom-radio input {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    background-color: white;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    display: inline-block;
    position: relative;
}

/* ✅ Checkbox clicked */
.custom-checkbox input:checked {
    background-color: #ff6636;
    border-color: #ff6636;
}

/* ✅ checkbox effect*/
.custom-checkbox input:checked::after {
    /* content: "✔"; */
    color: white;
    font-size: 14px;
    font-weight: bold;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

/* ✅ radio box */
.custom-radio input {
    border-radius: 50%;
}

.custom-radio input:checked {
    background-color: #ff6636;
    border-color: #ff6636;
}

/* ✅ change radio effect */
.custom-radio input:checked::after {
    /* content: ""; */
    width: 8px;
    height: 8px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

/* ✅ when checkbox/radio clicked , text color change */
.custom-checkbox input:checked + span,
.custom-radio input:checked + span {
    color: #ff6636;
    font-weight: bold;
    transition: color 0.3s ease-in-out;
}

.buttonarea {
    display: flex;
    justify-content: center;
}

.btn-orange {
    background-color: #ff6636;
    color: white;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-orange:hover {
    background-color: #e05530;
}
</style>
