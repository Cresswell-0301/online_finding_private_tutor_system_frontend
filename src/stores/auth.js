import axios from "@/axios";
import { defineStore } from "pinia";
import emailjs from "@emailjs/browser";
import { useTutorStore } from "./tutor";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        loading: false,
        error: null,
        image: null,
        tryAuth: false,
        linkAccount: null,
        otp: null,
        otpVerified: false,
    }),

    actions: {
        async register(data, router) {
            this.loading = true;
            this.error = null;

            try {
                await axios.get("/sanctum/csrf-cookie");
                await axios.post("/register", data);
                await this.fetchUser();
                alert("Registration successful!");
                router.push("/");
            } catch (err) {
                this.error = err.response?.data?.message || "Registration failed.";
                alert("Registration failed! Pls try again");
            }
            this.loading = false;
        },

        async login(data, router) {
            this.loading = true;
            this.error = null;

            try {
                await axios.get("/sanctum/csrf-cookie");
                await axios.post("/login", data);
                await this.fetchUser();
                alert("Login successful!");
                if (this.user.role === "admin") {
                    router.push("/admin");
                } else if (this.user.role === "tutor") {
                    await useTutorStore().fetchTutorDetails(this.user.id);
                    router.push("/tutor");
                } else {
                    router.push("/");
                }
            } catch (err) {
                this.error = err.response?.data?.message || "Login failed.";
                alert("Login failed! Pls try again");
            } finally {
                this.loading = false;
            }
        },

        async checkEmail(data) {
            try {
                const response = await axios.post("api/getUser", data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                console.log(response.data);
                // ramdom otp
                this.otp = Math.floor(100000 + Math.random() * 900000);

                const title = "Reset Password OTP"; // email title
                const name = response.data.user.name; // email receive person
                const mail_to = response.data.user.email; // email to
                const customTemplate = {
                    html: 
                    // otp template for user receive otp
                    `
                    <p>OTP: <b>${this.otp}</b></p>
                    <p>Use this OTP to reset your password</p>
                    `,
                };

                await this.sendEmail(title, name, mail_to, customTemplate, null);
            }
            catch (error) {
                this.error = error.response?.data?.message || "Password reset email failed";
                alert(this.error);
            }
        },

        async resetPassword(data, router) {
            try {
                await axios.post(`api/resetPassword`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                alert("Password reset successful!");
                router.push("/");
            }
            catch (error) {
                this.error = error.response?.data?.message || "Password reset failed";
                alert(this.error);
            }
        },

        async logout(router) {
            try {
                await axios.get("/sanctum/csrf-cookie");
                await axios.post("/logout");
                router.push("/");
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                this.user = null;
            }
        },

        async fetchUser() {
            try {
                this.tryAuth = true;
                await axios.get("/sanctum/csrf-cookie");
                const response = await axios.get("api/user");
                this.user = response.data;
                await this.generateImage();
            } catch (error) {
                this.user = null;
            }
        },

        async generateImage() {
            if (this.user.image == null) {
                const letters = this.user.name
                    .split(" ")
                    .slice(0, 3)
                    .map((name) => name.charAt(0).toUpperCase())
                    .join("");
                this.image = `https://placehold.co/144x144/FFEEE8/FF6636/?text=${letters}&font=roboto`;
            } else {
                this.image = `http://127.0.0.1:8000${this.user.image}`;
            }
        },

        async editUser(data) {
            try {
                const response = await axios.put("api/user", data);
                this.user = response.data;
                alert("Edit successful!");
                location.reload();
            } catch (err) {
                this.error = err.response?.data?.message || "Edit failed.";
                alert("Edit failed! Pls try again");
            }
        },

        async changePassword(data) {
            try {
                await axios.post(`api/user/changePassword`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                alert("Password change successful!");
                location.reload();
            } catch (error) {
                this.error = error.response?.data?.message || "Password change failed";
                alert(this.error);
            }
        },

        async linkEmail(data) {
            try {
                const response = await axios.post(`api/user/linkEmail`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                alert("Successfully requested to link email. Please wait for the response.");

                const title = "Link Account Request"; // email title
                const name = response.data.linked_user.name; // email receive person
                const mail_to = response.data.linked_user.email; // email to
                const customTemplate = {
                    html: `
                    <p>Request from: ${response.data.user.name} (${response.data.user.email})</p>
                    <p>Link email: ${response.data.linked_user.name} (${response.data.linked_user.email})</p>                     

                    <div style="text-align: center">
                        <a href='${import.meta.env.VITE_FRONTEND_URL}/linkAccount/${btoa(response.data.linked_account.id)}/status?status=${btoa("approved")}' style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                          Approve Request
                        </a>

                        <a href='${import.meta.env.VITE_FRONTEND_URL}/linkAccount/${btoa(response.data.linked_account.id)}/status?status=${btoa("rejected")}' style="margin-left: 5%; background-color: red ; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                            Reject Request
                        </a>
                    </div>
                    `,
                };

                await this.sendEmail(title, name, mail_to, customTemplate, "refresh");
            } catch (error) {
                this.error = error.response?.data?.message || "Email link failed";
                alert(this.error);
            }
        },

        async updateLinkAccountStatus(id, status) {
            try {
                const response = await axios.post(`api/linkAccount/${id}/status?status=${status}`);

                console.log(response.data.student, response.data.parent, response.data.status);

                const title = "Status Link Account : " + (response.data.status.charAt(0).toUpperCase() + response.data.status.slice(1)); // email title
                const name = response.data.student.name; // email receive person
                const mail_to = response.data.student.email; // email to
                const customTemplate = {
                    html: `
                    <p>Link email: ${response.data.parent.name} (${response.data.parent.email})</p>
                    <p>Status: <b>${response.data.status.charAt(0).toUpperCase() + response.data.status.slice(1)}</b></p>
                   `,
                };

                await this.sendEmail(title, name, mail_to, customTemplate, "close");
                alert("Successfully updated status");
            } catch (error) {
                this.error = error.response?.data?.message || "Status update failed";
                alert(this.error);
            }
        },

        async fetchLinkAccount(id) {
            try {
                const response = await axios.get(`api/users/${id}/linkAccount`);
                this.linkAccount = response.data.linkedEmail;
            } catch (error) {
                this.linkAccount = null;
                this.error = error.response?.data?.message || "Link account fetch failed";
                console.log(this.error);
            }
        },

        async unlinkEmail(id) {
            try {
                await axios.post(`api/users/${this.user.id}/unlinkAccount`, {
                    unlinkAccount: id,
                });
                alert("Successfully unlinked account");
                location.reload();
            } catch (error) {
                this.error = error.response?.data?.message || "Email unlink failed";
                alert(this.error);
            }
        },

        // payment
        async makePayment(data) {
            try {
                await axios
                    .post("api/payment", data)
                    .then((response) => {
                        window.location.href = response.data.url;
                    })
                    .catch((error) => console.error(error));
            } catch (error) {
                this.error = error.response?.data?.message || "Payment failed";
                alert(this.error);
            }
        },

        async fetchTutorPayments(id) {
            try {
                const response = await axios.get(`api/tutor/${id}/payments`);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || "Payments fetch failed";
            }
        },

        // Admin
        async fetchAdminDashboard() {
            try {
                const response = await axios.get("api/admin/dashboard");
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || "Dashboard fetch failed";
            }
        },

        async fetchSocialMedia() {
            try {
                const response = await axios.get("api/social_media");
                return response.data?.social_media;
            } catch (error) {
                this.error = error.response?.data?.message || "Social media fetch failed";
            }
        },

        async updateAdminSocialMedia(data) {
            try {
                const response = await axios.post("api/admin/social_media", data);
                alert("Social media updated successfully");
                location.reload();
            } catch (error) {
                this.error = error.response?.data?.message || "Social media update failed";
                alert(this.error);
            }
        },

        async fetchPurchaseHistory(id) {
            try {
                const response = await axios.get(`api/parent/${id}/purchaseHistory`);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || "Purchase history fetch failed";
            }
        },

        async fetchPayments() {
            try {
                const response = await axios.get(`api/admin/payments`);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || "Payments fetch failed";
            }
        },

        async reportTutor(data) {
            try {
                await axios.post(`api/report/tutor`, data);
                alert("Report tutor successful");
                location.reload();
            } catch (error) {
                this.error = error.response?.data?.message || "Report tutor failed";
                alert(this.error);
            }
        },

        async fetchReportedTutors() {
            try {
                const response = await axios.get(`api/report/tutor`);
                return response.data?.reports;
            } catch (error) {
                this.error = error.response?.data?.message || "Reported tutors fetch failed";
            }
        },

        async fetchReportedTutor(id) {
            try {
                const response = await axios.get(`api/report/tutor/${id}`);
                return response.data?.report;
            } catch (error) {
                this.error = error.response?.data?.message || "Reported tutor fetch failed";
            }
        },

        async submitReport(data) {
            try {
                await axios.post(`api/report/${data.report_id}/submit`, data);

                const title = "Your Report Has Been Reviewed"; // email title
                const name = data.report_by; // email receive person
                const mail_to = data.email; // email to
                const customTemplate = {
                    html: `
                    <p><strong>Description</strong><br>${data.description}</p>
                    <p>You have received feedback from our admin:</p>
                    <p><strong>Feedback</strong><br>${data.feedback}</p>
                    `,
                };

                await this.sendEmail(title, name, mail_to, customTemplate, "refresh");
            } catch (error) {
                this.error = error.response?.data?.message || "Report submission failed";
                alert(this.error);
            }
        },

        // send email
        async sendEmail(title, name, mail_to, customTemplate, type) {
            const templateParams = {
                title: title,
                name: name, // email receive person
                mail_to: mail_to, // email to
                my_html: customTemplate.html,
            };

            emailjs
                .send(import.meta.env.VITE_EMAIL_JS_SERVICE_ID, import.meta.env.VITE_EMAIL_JS_TEMPLATE_CUSTOM_ID, templateParams, {
                    publicKey: import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY,
                })
                .then(
                    () => {
                        alert("Email sent successfully");

                        setTimeout(() => {
                            if (type === "refresh") {
                                location.reload();
                            }

                            if (type === "close") {
                                window.close();
                            }

                            if (type === "admin/tutor") {
                                location.href = "/admin/tutor_registration_list";
                            }
                        }, 1000);
                    },
                    (error) => {
                        alert("Unable to send email");
                    }
                );
        },
    },
});
