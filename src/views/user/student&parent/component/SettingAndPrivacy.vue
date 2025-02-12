<template>
    <div class="w-75 m-3">
        <span class="fs-4 fw-bold">Account Setting</span>
        <form @submit.prevent="handleEditProfile">
            <div class="d-flex gap-5 flex-wrap">
                <div class="p-4 border d-flex flex-column align-items-center" style="width: fit-content">
                    <div class="position-relative" style="display: inline-block">
                        <img :src="imagePreview" class="img-fluid" width="200px" alt="user picture" />
                        <div class="w-100 text-center text-white bg-black position-absolute bottom-0 start-50 translate-middle-x p-2" style="opacity: 0.5">
                            <div class="user-select-none" type="button" @click="$refs.fileInput.click()">
                                <font-awesome-icon icon="fa-solid fa-arrow-up-from-bracket" />
                                Update Photo
                            </div>
                        </div>
                        <input type="file" ref="fileInput" class="d-none" @change="updateImage" accept="image/*" />
                    </div>
                    <p class="fw-light text-secondary text-center" style="max-width: 200px">Image size should be under 1MB and image ration needs to be 1:1</p>
                </div>
                <div class="flex-fill">
                    <div class="row mb-3 align-items-end">
                        <div class="col">
                            <label class="form-label"> Full Name </label>
                            <input type="text" class="form-control" id="first-name" placeholder="First name" :readonly="!isEditing" :disabled="!isEditing" v-model="first_name" required/>
                        </div>
                        <div class="col">
                            <input type="text" class="form-control" id="last-name" placeholder="Last name" :readonly="!isEditing" :disabled="!isEditing" v-model="last_name" required/>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="name" class="form-label">Username</label>
                        <input type="text" class="form-control" id="name" v-model="name" placeholder="Username" :readonly="!isEditing" :disabled="!isEditing" required />
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp" placeholder="Email address" :readonly="!isEditing" :disabled="!isEditing" required />
                    </div>
                    <div class="d-flex gap-3">
                        <button v-if="isEditing" class="btn btn-orange" type="submit">Save change</button>
                        <div type="button" class="btn btn-orange" @click="() => ((isEditing = !isEditing), !isEditing && cancelEditing())">
                            {{ isEditing ? "Cancel" : "Edit" }}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <hr class="w-100" />
    <div class="w-75 m-3">
        <div class="row gap-3">
            <form class="col p-4" @submit.prevent="handleChangePassword">
                <span class="fs-4 fw-bold">Change password</span>

                <div class="mb-3">
                    <label for="current-password" class="form-label">Current Password</label>
                    <input type="password" class="form-control" id="current-password" v-model="currentPassword" placeholder="Current Password" required />
                </div>

                <div class="mb-3">
                    <label for="new-password" class="form-label">New Password</label>
                    <input type="password" class="form-control" id="new-password" v-model="newPassword" placeholder="New Password" required />
                </div>

                <div class="mb-3">
                    <label for="confirm-password" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="confirm-password" v-model="confirmPassword" placeholder="Confirm Password" required />
                </div>

                <button class="btn btn-orange" type="submit">Change Password</button>
            </form>

            <div class="col p-4">
                <form class="mb-3" @submit.prevent="handleLinkEmail(null)">
                    <span class="fs-4 fw-bold" v-text="authStore.user.role == 'parent' ? 'Link Child Email' : 'Link Parent Email'"></span>

                    <div class="mb-3">
                        <label for="linkEmail" class="form-label">Email Address</label>
                        <input type="linkEmail" class="form-control" id="linkEmail" v-model="linkEmail" aria-describedby="emailHelp" placeholder="Email address" :disabled="authStore.user.role === 'student' && linkAccount" required />
                    </div>
                    <button class="btn btn-orange" type="submit" v-if="!linkAccount || authStore.user.role === 'parent'">Link</button>
                </form>

                <div v-if="authStore.user.role === 'parent'">
                    <ul class="list-group">
                        <li v-for="(data, index) in showChildEmail" :key="index" class="d-flex justify-content-between align-items-center">
                            <input type="email" v-model="data.email" class="form-control me-2" :readonly="!isEditing" :disabled="!isEditing" placeholder="Email address" />
                            <button type="button" class="btn btn-orange" @click="handleLinkEmail(data.id)">Remove</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useImageStore } from "@/stores/image";

const authStore = useAuthStore();
const imageStore = useImageStore();

const originalData = {
    name: authStore.user.name || "",
    email: authStore.user.email || "",
    first_name: authStore.user.first_name || "",
    last_name: authStore.user.last_name || "",
};

const name = ref(originalData.name);
const email = ref(originalData.email);
const first_name = ref(originalData.first_name);
const last_name = ref(originalData.last_name);
const profile_picture = ref(authStore.user.image || "");
const imagePreview = ref(authStore.image);
const isEditing = ref(false);

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const linkEmail = ref("");
const linkAccount = ref(false);
const showChildEmail = ref([]);

const cancelEditing = () => {
    name.value = originalData.name;
    email.value = originalData.email;
    first_name.value = originalData.first_name;
    last_name.value = originalData.last_name;
    isEditing.value = false;
};

const handleEditProfile = async () => {
    await authStore.editUser({
        name: name.value,
        email: email.value,
        first_name: first_name.value,
        last_name: last_name.value,
    });
};

const updateImage = async (event) => {
    profile_picture.value = event.target.files[0];

    if (profile_picture.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(profile_picture.value);

        await imageStore.uploadImage(profile_picture.value, authStore.user.id);
    }
};

const handleChangePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        alert("New Passwords do not match with Confirm Password");
        return;
    }

    await authStore.changePassword({
        current_password: currentPassword.value,
        new_password: newPassword.value,
        confirm_password: confirmPassword.value,
    });
};

const handleLinkEmail = async (id) => {
    if (authStore.user.role === "parent" && id != null) {
        await authStore.unlinkEmail(id);
    }

    if (authStore.user.role === "student" || id == null) {
        await authStore.linkEmail({ email: linkEmail.value });
    }
};

onMounted(async () => {
    await authStore.fetchLinkAccount(authStore.user.id);

    if (authStore.linkAccount) {
        linkAccount.value = true;
    }

    if (authStore.user.role === "student") {
        linkEmail.value = authStore.linkAccount?.email || "";
    }

    if (authStore.user.role === "parent") {
        showChildEmail.value = authStore.linkAccount || [];
    }
});
</script>
