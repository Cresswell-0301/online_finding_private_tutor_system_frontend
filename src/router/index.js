import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth";

// authentication views
import Auth_layout from "../views/auth/AuthLayout.vue";
import Sign_up from "../views/auth/component/SignUp.vue";
import Sign_in from "../views/auth/component/SignIn.vue";
import Tutor_registration from "../views/auth/TutorRegistration.vue";
import ForgotPassword from "../views/auth/component/ForgotPassword.vue";

// admin views
import Admin_layout from "../views/admin/AdminLayout.vue";
import Dashboard from "../views/admin/component/dashboard.vue";
import Tutor_registration_list from "../views/admin/component/TutorRegistrationList.vue";
import Report_list from "../views/admin/component/ReportList.vue";
import Tutor_management from "../views/admin/component/TutorManagement.vue";
import Settings from "../views/admin/component/settings.vue";
import TutorDetails from "../views/admin/component/TutorDetails.vue";
import Report_Details from "../views/admin/component/ReportDetails.vue";
import Payment_List from "../views/admin/component/PaymentList.vue";
import Payment_Details from "../views/admin/component/PaymentDetails.vue";

// tutor view
import Tutor_Layout from "../views/tutor/TutorLayout.vue";
import Tutor_Dashboard from "../views/tutor/component/dashboard.vue";
import Schedule from "../views/tutor/component/schedule.vue";
import Tutor_Profile from "../views/tutor/component/profile.vue";
import Sessions from "../views/tutor/component/sessions.vue";
import Tutor_Payment_List from "../views/tutor/component/PaymentList.vue";
import Tutor_Payment_Details from "../views/tutor/component/PaymentDetails.vue";

// all user view
import Default_layout from "../views/content/DefaultLayout.vue";
import Home from "../views/content/component/Home.vue";
import TutorList from "../views/content/component/TutorList.vue";
import About from "../views/content/component/About.vue";
import Contact from "../views/content/component/Contact.vue";
import TutorDetail from "../views/content/TutorDetail.vue";

// user view
import profile_layout from "../views/user/student&parent/ProfileLayout.vue";
import EnrollTutorList from "../views/user/student&parent/component/EnrollTutorList.vue";
import SettingAndPrivacy from "../views/user/student&parent/component/SettingAndPrivacy.vue";
import Status from "../views/Status.vue";
import PurchaseHistory from "../views/user/student&parent/component/Paymenthistory.vue";
import Payment from "../views/payment/payment.vue";
import { f } from "html2pdf.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: Default_layout,
            redirect: "/home",
            children: [
                {
                    path: "home",
                    name: "Home",
                    component: Home,
                },
                {
                    path: "tutor_list",
                    name: "Tutor_List",
                    component: TutorList,
                },
                {
                    path: "about",
                    name: "About",
                    component: About,
                },
                {
                    path: "contact",
                    name: "Contact",
                    component: Contact,
                },
                {
                    path: "/tutor_details/:id",
                    name: "tutordetail",
                    component: TutorDetail,
                },
            ],
        },
        {
            path: "/auth",
            component: Auth_layout,
            redirect: "/auth/sign_in",
            children: [
                {
                    path: "sign_in",
                    name: "Sign_in",
                    component: Sign_in,
                },
                {
                    path: "sign_up",
                    name: "Sign_up",
                    component: Sign_up,
                },
                {
                    path: "forgot_password",
                    name: "ForgotPassword",
                    component: ForgotPassword,
                },
            ],
            meta: { requiresGuest: true },
        },
        {
            path: "/tutor_registration",
            name: "Tutor_registration",
            component: Tutor_registration,
        },
        {
            path: "/admin",
            component: Admin_layout,
            redirect: "/admin/dashboard",
            children: [
                {
                    path: "dashboard",
                    name: "Dashboard",
                    component: Dashboard,
                },
                {
                    path: "tutor_registration_list",
                    name: "Tutor_Registration_List",
                    component: Tutor_registration_list,
                },
                {
                    path: "tutor_details/:id",
                    name: "Tutor_Details",
                    component: TutorDetails,
                },
                {
                    path: "report_list",
                    name: "Report_List",
                    component: Report_list,
                },
                {
                    path: "report/:id",
                    name: "Report_Details",
                    component: Report_Details,
                },
                {
                    path: "tutor_management",
                    name: "Tutor_Management",
                    component: Tutor_management,
                },
                {
                    path: "payment_list",
                    name: "Payment_List",
                    component: Payment_List,
                },
                {
                    path: "payment_details",
                    name: "Payment_Details",
                    component: Payment_Details,
                },
                {
                    path: "settings",
                    name: "Settings",
                    component: Settings,
                },
            ],
            meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
            path: "/tutor",
            component: Tutor_Layout,
            redirect: "/tutor/dashboard",
            children: [
                {
                    path: "dashboard",
                    name: "Tutor_Dashboard",
                    component: Tutor_Dashboard,
                },
                {
                    path: "sessions",
                    name: "Sessions",
                    component: Sessions,
                },
                {
                    path: "schedule",
                    name: "Schedule",
                    component: Schedule,
                },
                {
                    path: "payment_list",
                    name: "Tutor_Payment_List",
                    component: Tutor_Payment_List,
                },
                {
                    path: "payment_details",
                    name: "Tutor_Payment_Details",
                    component: Tutor_Payment_Details,
                },
                {
                    path: "profile",
                    name: "Profile",
                    component: Tutor_Profile,
                },
            ],
            meta: { requiresAuth: true, requiresTutor: true },
        },
        {
            path: "/user",
            component: profile_layout,
            redirect: "/user/setting",
            children: [
                {
                    path: "tutor_list",
                    name: "EnrollTutorList",
                    component: EnrollTutorList,
                },
                {
                    path: "setting",
                    name: "Setting_and_Privacy",
                    component: SettingAndPrivacy,
                },
                {
                    path: "purchase_history",
                    name: "PurchaseHistory",
                    component: PurchaseHistory,
                },
            ],
            meta: { requiresAuth: true },
        },
        {
            path: "/linkAccount/:id/status",
            name: "Status",
            component: Status,
        },
        {
            path: "/:status(success|failed)",
            name: "Payment_Status",
            component: Payment,
        },
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: () => import("../views/NotFound.vue"),
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // first time auth check
    if (!authStore.tryAuth) {
        await authStore.fetchUser();
        if (!authStore.user) {
            // No user is logged in, so send them to Home.
            next();
            return; // Important: exit early.
        } else {
            // Use switch-case based on the user's role.
            switch (authStore.user.role) {
                case "admin":
                    if(!to.matched.some((record) => record.meta.requiresAdmin)){
                        next({ path: "/admin" });
                        return;
                    }
                    break;
                case "tutor":
                    if(!to.matched.some((record) => record.meta.requiresTutor)){
                        next({ path: "/tutor" });
                        return;
                    }
                    break;
                default:
                    if(to.matched.some((record) => record.meta.requiresAdmin || to.matched.some((record) => record.meta.requiresTutor))){
                        next({ name: "Home" });
                        return;
                    }
                    break;
            }
        }
    }

    if (to.matched.some((record) => record.meta.requiresGuest)) {
        if (authStore.user == null) {
            next();
        } else {
            next(from.fullPath);
        }
    } else if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (authStore.user == null) {
            next({ name: "Sign_up" });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
