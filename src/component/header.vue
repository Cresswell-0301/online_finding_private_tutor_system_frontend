<template>
    <header class="py-3 border-bottom bg-white">
        <div class="px-4 d-flex flex-wrap align-items-center gap-3" style="margin-left: auto; margin-right: auto; max-width: 65%">
            <RouterLink to="/" class="d-flex align-items-center text-dark text-decoration-none">
                <img src="@/assets/png/logo.png" height="40" />
                <span class="fs-4 fw-bold">Amazing Tutor Finder</span>
            </RouterLink>

            <form v-if="!isSignIn && !isSignUp" class="d-flex me-auto position-relative">
                <input class="form-control mx-2" type="search" placeholder="Find a tutor" aria-label="Search" v-model="searchQuery" @focus="showDropdown = true" @blur="hideDropdown" />

                <!-- Search Dropdown Menu -->
                <div v-if="showDropdown && searchResults.length" class="search-dropdown mx-2">
                    <ul>
                        <li v-for="(result, index) in searchResults" :key="index" @mousedown.prevent="selectResult(result)">
                            <div class="d-flex flex-row align-items-center">
                                <img :src="result.title_image" width="40" height="40" alt="user picture" class="rounded-circle" />
                                <div class="ms-2">
                                    <p class="mb-0" style="font-weight: 700">
                                        {{ result.title }}
                                    </p>
                                    <p class="mb-0" style="font-weight: 500; font-size: 14px; color: #808080">
                                        {{ result.name }}
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </form>

            <div v-if="isSignUp" class="flex-shrink-0 ms-auto d-flex align-items-center">
                <p class="text-secondary mb-0 me-2">Have account?</p>
                <RouterLink to="/auth/sign_in" class="btn btn-orange" type="button"> Login</RouterLink>
            </div>
            <div v-else-if="isSignIn" class="flex-shrink-0 ms-auto d-flex align-items-center">
                <p class="text-secondary mb-0 me-2">Don't have account?</p>
                <RouterLink to="/auth/sign_up" class="btn btn-orange" type="button"> Create Account</RouterLink>
            </div>

            <RouterLink to="/user" v-else-if="authStore.user"> <img :src="authStore.image" width="40" height="40" alt="user picture" class="rounded-circle" /></RouterLink>

            <div v-else class="d-flex gap-2">
                <RouterLink to="/auth/sign_up" class="btn btn-orange" type="button"> Create Account</RouterLink>
                <RouterLink to="/auth/sign_in" class="btn btn-orange" type="button"> Login</RouterLink>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useTutorStore } from "../stores/tutor";

const route = useRoute();
const router = useRouter();
const isSignUp = computed(() => route.name == "Sign_up");
const isSignIn = computed(() => route.name == "Sign_in");

const authStore = useAuthStore();
const tutorStore = useTutorStore();

const searchQuery = ref("");
const showDropdown = ref(false);
const searchResults = ref([]);

const selectResult = (result) => {
    location.href = `/tutor_details/${result.user_id}`;
    searchQuery.value = result.name;
    showDropdown.value = false;
};

const hideDropdown = () => {
    setTimeout(() => {
        showDropdown.value = false;
    }, 200);
};

watch(searchQuery, async () => {
    try {
        const data = await tutorStore.fetchSearch(searchQuery.value);
        const tempTutors = data.tutorsData;
        const tempUsers = data.usersData;
        const tempSessions = data.sessionsData;

        searchResults.value = tempTutors.map((tutor) => ({
            ...tutor,
            name: tempUsers.find((user) => user.id == tutor.user_id).name || null,
            title: tempSessions.find((session) => session.user_id == tutor.user_id).title || null,
        }));
    } catch (error) {
        console.error("Error fetching tutors:", error);
    }
});
</script>

<style scoped>
.text-secondary {
    font-size: 0.88rem !important;
}
/* ✅ Search Dropdown */
.search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 93%;
    max-height: 270px; /* Limit height */
    overflow-y: auto; /* Enable vertical scroll */
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

/* ✅ Dropdown  */
.search-dropdown ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

/* ✅ dropdown selection */
.search-dropdown li {
    padding: 10px;
    cursor: pointer;
    transition: background 0.2s ease;
}

/* ✅ Hover & Active */
.search-dropdown li:hover {
    background: #ff6636;
    color: white;
}
</style>
