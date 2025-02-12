<template>
    <header_design />
    <div class="p-4" style="background-color: #f5f7fa">
        <form @submit.prevent="handleLogin">
            <div class="container bg-white p-5 my-0">
                <h4>Tutor Registration</h4>
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
                            <input type="number" class="form-control" id="phone_number" v-model="phone_number" placeholder="Your phone number" required min="0" />
                        </div>

                        <div class="row mb-0 align-items-end flex-wrap">
                            <div class="col-12 col-md-6">
                                <label for="password" class="form-label">Password</label>
                                <input :type="showPassword ? 'text' : 'password'" class="form-control" id="password" v-model="password" placeholder="Create password" required />
                                <font-awesome-icon @click="showPassword = !showPassword" class="hide-show-icon position-relative" :icon="showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'" size="lg" />
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="confirmPassword" class="form-label">Confirm Password</label>
                                <input :type="showPassword ? 'text' : 'password'" class="form-control" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm password" required />
                                <font-awesome-icon @click="showPassword = !showPassword" class="hide-show-icon position-relative" :icon="showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'" size="lg" />
                            </div>
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
                            <br />
                            <img v-if="imagePreview" :src="imagePreview" alt="Profile Picture Preview" class="img-fluid mt-2" style="max-width: 163px; height: auto" />
                            <input class="form-control" type="file" id="profile_picture" accept="image/*" @change="handleImageUpload" required />
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
            </div>

            <div class="container bg-white p-5 my-4">
                <h4>Social Profile</h4>

                <div class="row mb-3 flex-wrap">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="instagram" class="form-label">Instagram</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <font-awesome-icon icon="fa-brands fa-instagram" style="color: #ff6636" />
                            </span>
                            <input type="text" class="form-control" id="instagram" v-model="instagram" placeholder="Please put your Instagram link" required />
                        </div>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label for="linkedln" class="form-label">LinkedIn</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <font-awesome-icon icon="fa-brands fa-linkedin-in" style="color: #ff6636" />
                            </span>
                            <input type="text" class="form-control" id="linkedln" v-model="linkedln" placeholder="Please put your LinkedIn link" required />
                        </div>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label for="whatsapp" class="form-label">WhatsApp</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <font-awesome-icon icon="fa-brands fa-whatsapp" style="color: #ff6636" />
                            </span>
                            <input type="text" class="form-control" id="whatsapp" v-model="whatsapp" placeholder="Please put your WhatsApp number" required />
                        </div>
                    </div>
                </div>

                <div class="d-flex flex-row-reverse">
                    <button type="submit" class="ms-auto btn btn-orange" :disabled="tutorStore.loading">
                        Save & Send to Pending
                        <span v-if="tutorStore.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import header_design from "@/component/header.vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTutorStore } from "@/stores/tutor.js";

const router = useRouter();
const tutorStore = useTutorStore();

const fullname = ref("");
const country_code = ref("+60");
const phone_number = ref("");
const password = ref("");
const confirmPassword = ref("");
const email = ref("");
const education_background = ref("");
const profile_picture = ref("");
const teaching_experience = ref("");
const about_me = ref("");
const instagram = ref("");
const linkedln = ref("");
const whatsapp = ref("");

const showPassword = ref(false);

const imagePreview = ref("");

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

const handleLogin = async () => {
    await tutorStore.register(
        {
            fullname: fullname.value,
            phone_number: country_code.value + phone_number.value,
            password: password.value,
            password_confirmation: confirmPassword.value,
            email: email.value,
            education_background: education_background.value,
            profile_picture: profile_picture.value,
            teaching_experience: teaching_experience.value,
            about_me: about_me.value,
            instagram: instagram.value,
            linkedln: linkedln.value,
            whatsapp: whatsapp.value,
        },
        router
    );
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
