<template>
    <div class="schedule-card">
        <table>
            <thead>
                <tr>
                    <th><b>Name</b></th>
                    <th><b>Month</b></th>
                    <th><b>Day</b></th>
                    <th><b>Time</b></th>
                    <th><b>Teaching Mode</b></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="schedules.length > 0" v-for="(schedule, index) in schedules" :key="index">
                    <td>{{ schedule.user.name }}</td>
                    <td>{{ schedule.month }}</td>
                    <td>{{ schedule.day }}</td>
                    <td>{{ schedule.time_slot }}</td>
                    <td>{{ schedule.session.teaching_mode }}</td>
                    <td>
                        <div class="btn btn-orange ms-auto me-3" @click="notifyStudent(schedule)">
                            Notify
                            <font-awesome-icon icon="fa-solid fa-arrow-right" />
                        </div>
                    </td>
                </tr>
                <tr v-else>
                    <td colspan="6" style="text-align: center">Currently, there are no scheduled sessions booked.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useTutorStore } from "../../../stores/tutor";
import { useAuthStore } from "../../../stores/auth";

const authStore = useAuthStore();
const tutorStore = useTutorStore();

const schedules = ref([]);

onMounted(async () => {
    schedules.value = await tutorStore.fetchSchedule(authStore.user.id);
});

const notifyStudent = async (schedule) => {
    const url = generateCalendarUrl(schedule);

    const title = "Tutor Session Notification"; // email title
    const name = schedule.user.name; // email receive person
    const mail_to = schedule.user.email; // email to
    const customTemplate = {
        html: `
        <p>This is a notification regarding your scheduled session.</p>

        <p><strong>Date:</strong> ${schedule.month} every ${schedule.day}</p>
        <p><strong>Time:</strong> ${schedule.time_slot}</p>
        <p><strong>Teaching Mode:</strong> ${schedule.session.teaching_mode}</p>

        <div class="btn btn-primary ms-auto me-3">
            <a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                Add to Google Calendar
            </a>
        </div>
        `,
    };

    await authStore.sendEmail(title, name, mail_to, customTemplate, "refresh");
};

const pad = (num) => num.toString().padStart(2, "0");

const formatDateTime = (date, timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    return date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) + "T" + pad(hours) + pad(minutes) + "00";
};

const getFirstOccurrence = (year, monthName, weekdayName) => {
    const monthIndex = new Date(Date.parse(`${monthName} 1, ${year}`)).getMonth();
    let date = new Date(year, monthIndex, 1);
    while (date.toLocaleDateString("en-US", { weekday: "long" }) !== weekdayName) {
        date.setDate(date.getDate() + 1);
    }
    return date;
};

const generateCalendarUrl = (schedule) => {
    const year = new Date(schedule.created_at).getFullYear();

    const eventDate = getFirstOccurrence(year, schedule.month, schedule.day);

    const [startTime, endTime] = schedule.time_slot.split("-");

    const startDateTime = formatDateTime(eventDate, startTime);
    const endDateTime = formatDateTime(eventDate, endTime);

    const monthIndex = new Date(Date.parse(`${schedule.month} 1, ${year}`)).getMonth();
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
    const untilDate = lastDayOfMonth.getFullYear() + pad(lastDayOfMonth.getMonth() + 1) + pad(lastDayOfMonth.getDate()) + "T235959Z";

    const rrule = `RRULE:FREQ=WEEKLY;UNTIL=${untilDate}`;

    const customMeetLink = "https://meet.google.com/ocq-ihgs-kuv";

    const baseUrl = "https://calendar.google.com/calendar/u/0/r/eventedit";

    const params = new URLSearchParams({
        text: "Tutor Session",
        details: `Teaching Mode: ${schedule.session.teaching_mode}${schedule.session.teaching_mode !== "Online" ? "" : `\n\nJoin the meeting: <a href="${customMeetLink}">${customMeetLink}</a>`}`,
        dates: `${startDateTime}/${endDateTime}`,
        ctz: "Asia/Kuala_Lumpur",
        add: schedule.user.email,
        recur: rrule,
    });

    params.append("add", schedule.tutor.email);
    params.append("add", schedule.user.email);

    return `${baseUrl}?${params.toString()}`;
};
</script>

<style scoped>
.schedule-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background-color: #f2f2f2;
    padding: 10px;
}

td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

tr:nth-child(even) {
    background-color: #f9f9f9;
}
</style>
