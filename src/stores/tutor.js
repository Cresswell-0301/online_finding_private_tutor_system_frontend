import axios from "@/axios";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useTutorStore = defineStore("tutor", {
    state: () => ({
        tutors: [],
        recommendedTutors: [],
        pendingTutors: [],
        loading: false,
        error: null,
        tutorDetail: null,
        tutor: null,
        titleImage: null,
        tutorSession: [],
        students: [],
        amount: null,
        currentPage: 1,
        perPage: 12,
        totalPages: 1,
        overallRate: 0,
    }),
    actions: {
        async register(data, router) {
            try {
                this.loading = true;
                await axios.get("/sanctum/csrf-cookie");
                const response = await axios.post("api/tutors/register", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                alert("Application submitted successfully!");
                router.push("/");
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.message);
                } else if (error.request) {
                    alert("No response received from the server. Please check your network connection.");
                } else {
                    alert("An unexpected error occurred. Please try again");
                }
            } finally {
                this.loading = false;
            }
        },

        async fetchPendingTutors() {
            try {
                const response = await axios.get("api/tutors/pending");
                this.pendingTutors = response.data?.tutors;
            } catch (error) {
                console.error("Error fetching pending tutors: ", error);
            }
        },

        async fetchTutors(page = this.currentPage, sortBy = "", sortOrder = "") {
            try {
                const response = await axios.get("api/tutors", {
                    params: { page, perPage: this.perPage, sortBy, sortOrder },
                    headers: { "X-Referer": location.href },
                });

                const tutorsData = response.data?.tutors || [];
                const tutorSessions = response.data?.sessions || [];
                const ratings = response.data?.ratings || [];
                const enrolledStudents = response.data?.enrolledStudents || [];

                this.tutors = tutorsData.map((tutor) => {
                    const imageUrl = this.generateImage(tutor);

                    const tutorSession = tutorSessions.find((session) => session.tutor_id === tutor.id);
                    const tutorRatings = ratings.filter((rating) => rating.tutor_id === tutor.user_id);
                    const enrolledStudent = enrolledStudents.filter((student) => student.tutor_id === tutor.user_id);
                    const overallRate = tutorRatings.length > 0 ? tutorRatings.reduce((sum, r) => sum + r.rate, 0) / tutorRatings.length : 0;

                    return {
                        ...tutor,
                        title_image: imageUrl,
                        session: tutorSession,
                        overallRate: overallRate,
                        enrolledStudent: enrolledStudent.length,
                    };
                });

                this.currentPage = response.data.currentPage;
                this.totalPages = response.data.totalPages;

                this.recommendedTutors = this.tutors.slice(0, 4);
            } catch (error) {
                console.error("Error fetching pending tutors: ", error);
            }
        },

        async updateStatus(id, status, email, name) {
            try {
                this.loading = true;
                await axios.get("/sanctum/csrf-cookie");
                await axios.post(`api/tutors/${id}/status`, {
                    status: status,
                });
                alert("Tutor status updated successfully!");

                const title = "Tutor Registration Status Update"; // email title
                const mail_to = email; // email to
                const customTemplate = {
                    html: `
                    <p>Your registration status has been updated to <strong>${status.charAt(0).toUpperCase() + status.slice(1)}</strong>.</p>
                    <p>Thank you for your interest in becoming a tutor at our platform.</p>
                    `,
                };

                useAuthStore().sendEmail(title, name, mail_to, customTemplate, "admin/tutor");
            } catch (error) {
                console.error("Error update tutors status: ", error);
            }
        },

        async fetchTutorDetails(id) {
            try {
                const response = await axios.get(`api/tutors/${id}`);
                this.tutorDetail = response.data?.tutorDetail;
                this.tutor = response.data?.userDetail;

                this.titleImage = this.generateImage({
                    title_image: this.tutorDetail?.title_image,
                    user: { name: this.tutor?.name },
                });
            } catch (error) {
                console.error("Error fetching tutor details: ", error);
            }
        },

        async fetchEnrolledTutorDetails(id, search = "") {
            const response = await axios.get(`api/student/${id}/enrolled_tutors`, {
                params: { search: search },
            });

            const tutorsData = response.data?.tutorsData || [];
            const tutorSessions = response.data?.sessionsData || [];
            const ratings = response.data?.ratings || [];
            const enrolledStudents = response.data?.enrolledStudents || [];
            const enrolledSessions = response.data?.enrolledSessions || [];

            this.tutors = tutorsData.map((tutor) => {
                const tutorRatings = ratings.filter((rating) => rating.tutor_id === tutor.user_id);
                const overallRate = tutorRatings.length > 0 ? tutorRatings.reduce((sum, r) => sum + r.rate, 0) / tutorRatings.length : 0;
                const enrolledStudent = enrolledStudents.filter((student) => student.tutor_id === tutor.user_id);
                const enrolledSession = enrolledSessions.filter((session) => session.tutor_id === tutor.user_id);

                return {
                    ...tutor,
                    title_image: this.generateImage(tutor),
                    session: tutorSessions.find((session) => session.tutor_id === tutor.id),
                    overallRate: overallRate,
                    enrolledStudent: enrolledStudent.length,
                    enrolledSession: enrolledSession,
                };
            });
        },

        async editTutor(data, id, router) {
            try {
                this.loading = true;
                await axios.get("/sanctum/csrf-cookie");

                const response = await axios.post(`api/tutors/${id}/edit`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                alert("Tutor updated successfully!");
                router.go();
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.message);
                } else if (error.request) {
                    alert("No response received from the server. Please check your network connection.");
                } else {
                    alert("An unexpected error occurred. Please try again" + error);
                }
            } finally {
                this.loading = false;
            }
        },

        async addSession(data, id) {
            try {
                this.loading = true;

                await axios.get("/sanctum/csrf-cookie");

                const response = await axios.post(`api/tutors/${id}/add_session`, data);

                alert(response.data.message);

                location.href = `/tutor/sessions`;
            } catch (error) {
                alert(error.response.data.message);
            } finally {
                this.loading = false;
            }
        },

        async fetchSession(id) {
            try {
                await axios.get("/sanctum/csrf-cookie");
                const response = await axios.get(`api/tutors/${id}/sessions`);
                this.tutorSession = response.data?.sessions;
            } catch (error) {
                console.error("Error fetching tutor sessions: ", error);
            }
        },

        async fetchRating(id) {
            try {
                const response = await axios.get(`api/tutors/${id}/rating`);
                response.data?.rating.forEach((rating) => {
                    rating.user.image = this.generateImage({
                        title_image: rating.user.image,
                        user: { name: rating.user.name },
                    });
                });
                this.rating = response.data?.rating;
                this.overallRate = response.data?.overall_rating;
            } catch (error) {
                console.error("Error fetching tutor rating: ", error);
            }
        },

        async fetchEnrolledStudents(id) {
            try {
                const response = await axios.get(`api/tutors/${id}/enrolled_students`);
                return response.data?.enrolled_students;
            } catch (error) {
                console.error("Error fetching tutor enrolled students: ", error);
            }
        },

        async fetchTutorDashboard(id) {
            try {
                await axios.get("/sanctum/csrf-cookie");
                const response = await axios.get(`api/tutors/${id}/dashboard`);
                this.students = response.data?.students;
                this.amount = response.data?.amount;
                this.tutorSession = response.data?.tutorSessions;
            } catch (error) {
                console.error("Error fetching tutor students: ", error);
            }
        },

        async fetchSchedule(id) {
            const response = await axios.get(`api/tutors/${id}/schedule`);
            const schedules = response.data?.schedules;
            const sessions = response.data?.sessions;
            const users = response.data?.users;
            const students = response.data?.students;
            const tutors = response.data?.tutors;

            const combinedData = schedules.map((schedule) => {
                const session = sessions.find((session) => session.user_id === schedule.tutor_id);
                const student = students.find((student) => student.id === schedule.student_id);
                const user = users.find((user) => user.id === student.user_id);
                const tutor = tutors.find((tutor) => tutor.id === schedule.tutor_id);
                return { ...schedule, session, user, tutor };
            });

            return combinedData;
        },

        async ratingTutor(data) {
            try {
                await axios.post("api/rating", data);
                alert("Rating submitted successfully");
                location.reload();
            } catch (error) {
                console.error("Error rating tutor: ", error);
            }
        },

        // search
        async fetchSearch(search) {
            try {
                const response = await axios.get(`api/search`, {
                    params: {
                        search: search,
                    },
                });

                response.data.tutorsData.forEach((tutor) => {
                    tutor.title_image = this.generateImage({
                        title_image: tutor.title_image,
                        user: { name: response.data.usersData.find((user) => user.id == tutor.user_id).name },
                    });
                });

                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || "Search failed";
            }
        },

        generateImage(tutor) {
            if (tutor?.title_image == null) {
                const letters = tutor?.user?.name
                    .split(" ")
                    .slice(0, 3)
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("");
                return `https://placehold.co/144x144/FFEEE8/FF6636/?text=${letters}&font=roboto`;
            } else {
                return `http://127.0.0.1:8000${tutor.title_image}`;
            }
        },
    },
});
