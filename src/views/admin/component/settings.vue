<template>
    <div class="w-full m-3">
        <div class="row gap-3">
            <form class="col p-4 bg-white" @submit.prevent="handleChangePassword">
                <span class="fs-4 fw-bold">Change password</span>

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

            <form class="col p-4 bg-white" @submit.prevent="handleSocialMedia">
                <span class="fs-4 fw-bold">Social Media</span>

                <div class="mb-3">
                    <label for="instagram" class="form-label">Instagram</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <font-awesome-icon icon="fa-brands fa-instagram" style="color: #ff6636" />
                        </span>
                        <input type="text" class="form-control" id="instagram" v-model="instagram" placeholder="Please put your Instagram link" required />
                    </div>
                </div>

                <div class="mb-3">
                    <label for="linkedln" class="form-label">LinkedIn</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <font-awesome-icon icon="fa-brands fa-linkedin-in" style="color: #ff6636" />
                        </span>
                        <input type="text" class="form-control" id="linkedln" v-model="linkedln" placeholder="Please put your LinkedIn link" required />
                    </div>
                </div>

                <div class="mb-3">
                    <label for="facebook" class="form-label">Facebook</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <font-awesome-icon icon="fa-brands fa-facebook" style="color: #ff6636" />
                        </span>
                        <input type="text" class="form-control" id="facebook" v-model="facebook" placeholder="Please put your facebook number" required />
                    </div>
                </div>

                <div class="d-flex justify-content-start">
                    <button type="submit" class="btn btn-orange" :disabled="loadingSocial">
                        Save
                        <span v-if="loadingSocial" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../../../stores/auth";

const authStore = useAuthStore();

const currentPassword = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);

const instagram = ref("");
const linkedln = ref("");
const facebook = ref("");

const loadingSocial = ref(false);

onMounted(async () => {
    const response = await authStore.fetchSocialMedia();
    instagram.value = response.instagram;
    linkedln.value = response.linkedin;
    facebook.value = response.facebook;
});

const handleSocialMedia = async () => {
    loadingSocial.value = true;

    await authStore.updateAdminSocialMedia({
        instagram: instagram.value,
        linkedin: linkedln.value,
        facebook: facebook.value,
    });

    loadingSocial.value = false;
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
</script>

<style scoped></style>
