<template>
    <form @submit.prevent="handleEdit">
        <div class="container bg-white p-5 my-0">
            <h4>Tutor Detail</h4>
            <div class="row mb-3">
                <div class="col-sm-6 col-md-8">
                    <div class="mb-3">
                        <label for="fullname" class="form-label">Full Name </label>
                        <input type="text" class="form-control" id="fullname" v-model="fullname" placeholder="Enter your full name" required />
                    </div>
                    <label for="phone_number" class="form-label">Phone Number</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <select class="form-select rounded-0" id="country_code" v-model="country_code" aria-label="Default select">
                                <option value="+60">+60</option>
                                <option value="+65">+65</option>
                            </select>
                        </div>
                        <input type="text" class="form-control" id="phone_number" v-model="phone_number" placeholder="Your phone number" required />
                    </div>

                    <div class="row mb-0 align-items-end flex-wrap">
                        <div class="col-12 col-md-6 mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp" placeholder="Email address" required />
                        </div>

                        <div class="col-12 col-md-6 mb-3">
                            <label for="education_background" class="form-label">Education Background</label>
                            <input type="text" class="form-control" id="education_background" v-model="education_background" placeholder="Education Background" />
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-md-4">
                    <div class="mb-3">
                        <label for="profile_picture" class="form-label">Profile Picture</label>
                        <div class="d-flex flex-column align-items-center">
                            <img v-if="imagePreview" :src="imagePreview" alt="Profile Picture Preview" class="img-fluid mt-2" style="max-width: 163px; height: auto" />
                        </div>

                        <input class="form-control" type="file" id="profile_picture" accept="image/*" @change="handleImageUpload" required/>
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <label for="teaching_experience" class="form-label">Teaching Experience</label>
                <textarea class="form-control" id="teaching_experience" v-model="teaching_experience" rows="3" placeholder="Your teaching experience"></textarea>
            </div>
            <div>
                <label for="about_me" class="form-label">About Me</label>
                <textarea class="form-control" id="about_me" v-model="about_me" rows="4" placeholder="Introduct yourself"></textarea>
            </div>

            <div class="d-flex justify-content-start mt-3">
                <button type="submit" class="btn btn-orange" :disabled="loadingDetails">
                    Save
                    <span v-if="loadingDetails" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    </form>

    <form @submit.prevent="handleSocialMedia" class="container bg-white p-5 my-4">
        <h4>Social Profile</h4>

        <div class="row mb-3 flex-wrap">
            <div class="col-12 col-md-4 mb-3">
                <label for="instagram" class="form-label">Instagram</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <font-awesome-icon icon="fa-brands fa-instagram" style="color: #ff6636" />
                    </span>
                    <input type="text" class="form-control" id="instagram" v-model="instagram" placeholder="Please put your Instagram link" />
                </div>
            </div>
            <div class="col-12 col-md-4 mb-3">
                <label for="linkedln" class="form-label">LinkedIn</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <font-awesome-icon icon="fa-brands fa-linkedin-in" style="color: #ff6636" />
                    </span>
                    <input type="text" class="form-control" id="linkedln" v-model="linkedln" placeholder="Please put your LinkedIn link" />
                </div>
            </div>
            <div class="col-12 col-md-4 mb-3">
                <label for="whatsapp" class="form-label">WhatsApp</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <font-awesome-icon icon="fa-brands fa-whatsapp" style="color: #ff6636" />
                    </span>
                    <input type="text" class="form-control" id="whatsapp" v-model="whatsapp" placeholder="Please put your WhatsApp number" />
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-start">
            <button type="submit" class="btn btn-orange" :disabled="loadingSocial">
                Save
                <span v-if="loadingSocial" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </button>
        </div>
    </form>

    <div class="container bg-white p-5 my-4">
        <div class="row gap-5">
            <form class="col" @submit.prevent="handleChangePassword">
                <h4>Change password</h4>

                <div class="mb-3">
                    <label for="current-password" class="form-label">Current Password</label>
                    <input type="password" class="form-control" id="current-password" v-model="currentPassword" placeholder="Current Password" required />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">New Password</label>
                    <input :type="showPassword ? 'text' : 'password'" class="form-control" id="password" v-model="password" placeholder="New password" required />
                    <font-awesome-icon @click="showPassword = !showPassword" class="hide-show-icon position-relative" :icon="showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'" size="lg" />
                </div>

                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <input :type="showPassword ? 'text' : 'password'" class="form-control" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm password" required />
                    <font-awesome-icon @click="showPassword = !showPassword" class="hide-show-icon position-relative" :icon="showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'" size="lg" />
                </div>

                <button class="btn btn-orange" type="submit">Change Password</button>
            </form>

            <form @submit.prevent="handleTitleImage" class="col">
                <label for="title_image" class="form-label">Cover Image</label>
                <div class="d-flex flex-column align-items-center mb-3">
                    <img v-if="titleImagePreview" :src="titleImagePreview" alt="Title Picture Preview" class="img-fluid mt-2" style="max-width: 163px; height: auto" />
                </div>

                <input class="form-control" type="file" id="title_image" accept="image/*" @change="handleTitleImageUpload" required />

                <button class="btn btn-orange mt-3" type="submit">Save</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useTutorStore } from "@/stores/tutor.js";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const tutorStore = useTutorStore();
const authStore = useAuthStore();

const fullname = ref(authStore.user.name || "");
const country_code = ref("+60");
const phone_number = ref(authStore.user.phone || "");
const currentPassword = ref("");
const password = ref("");
const confirmPassword = ref("");
const email = ref(authStore.user.email || "");
const education_background = ref("");
const profile_picture = ref("");
const teaching_experience = ref("");
const about_me = ref("");
const instagram = ref("");
const linkedln = ref("");
const whatsapp = ref("");
const title_image = ref("");

const showPassword = ref(false);

const imagePreview = ref(authStore.image || "");
const titleImagePreview = ref("");

const loadingDetails = ref(false);
const loadingSocial = ref(false);

onMounted(async () => {
    try {
        await tutorStore.fetchTutorDetails(authStore.user.id);
        const data = tutorStore.tutorDetail;

        if (data) {
            fullname.value = authStore.user.name;
            phone_number.value = authStore.user.phone;
            email.value = authStore.user.email;
            education_background.value = data.education_background || "";
            teaching_experience.value = data.teaching_experience || "";
            about_me.value = data.about_me || "";
            instagram.value = data.instagram || "";
            linkedln.value = data.linkedln || "";
            whatsapp.value = data.whatsapp || "";
            title_image.value = data.title_image || "";
            titleImagePreview.value = tutorStore.titleImage || "";
        }
    } catch (error) {
        console.error("Error fetching tutor details:", error);
    }
});

const handleImageUpload = (event) => {
    profile_picture.value = event.target.files[0];
    if (profile_picture.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(profile_picture.value);
    }
};

const handleTitleImageUpload = (event) => {
    title_image.value = event.target.files[0];
    if (title_image.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            titleImagePreview.value = e.target.result;
        };
        reader.readAsDataURL(title_image.value);
    }
};

const handleEdit = async () => {
    await tutorStore.editTutor(
        {
            // User
            name: fullname.value,
            email: email.value,
            phone_number: phone_number.value,
            profile_picture: imagePreview.value,

            // Tutor
            education_background: education_background.value,
            teaching_experience: teaching_experience.value,
            about_me: about_me.value,
        },
        authStore.user.id,
        router
    );
};

const handleSocialMedia = async () => {
    await tutorStore.editTutor(
        {
            instagram: instagram.value,
            linkedln: linkedln.value,
            whatsapp: whatsapp.value,
        },
        authStore.user.id,
        router
    );
};

const handleChangePassword = async () => {
    if (password.value !== confirmPassword.value) {
        alert("New Passwords do not match with Confirm Password");
        return;
    }

    await authStore.changePassword({
        current_password: currentPassword.value,
        new_password: password.value,
        confirm_password: confirmPassword.value,
    });
};

const handleTitleImage = async () => {
    const formData = new FormData();
    formData.append("title_picture", title_image.value);

    try {
        await tutorStore.editTutor(formData, authStore.user.id, router);
    } catch (error) {
        console.error("Error uploading title image:", error);
    }
};
</script>

<style>
.btn-orange {
    background-color: #ff6636;
    color: #ffffff;
    border-radius: 2px;
}
.hide-show-icon {
    float: right;
    top: -30px;
    right: 10px;
    cursor: pointer;
}
</style>
