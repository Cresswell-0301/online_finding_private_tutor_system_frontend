<template>
    <div class="d-flex">
        <div class="flex-fill d-flex justify-content-center" style="background-color: #f0f2f5">
            <span class="fs-5 fw-bold m-4">About</span>
        </div>
    </div>
    <div class="responsive-container px-5 py-5 mx-5 gap-5">
        <div class="text-content px-5">
            <h1 class="font-bold leading-none" style="color: #e9eaf0; font-size: 88px">2025</h1>
            <h2 class="text-3xl font-bold text-black mt-2" style="font-size: 2.5rem">We share knowledge with the world</h2>
            <p class="text-lg mt-4" style="font-size: 1.3rem; color: #6e7485">Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent fermentum quam mauris. Fusce tempor et augue a aliquet. Donec non ipsum non risus egestas tincidunt at vitae nulla.</p>
        </div>
        <div class="image-content">
            <img src="@/assets/png/about_us_1.png" alt="About Us" class="img-fluid rounded" style="width: 100%; object-fit: cover" />
        </div>
    </div>

    <div class="d-flex justify-content-center align-items-center py-4" style="background-color: #ffffff">
        <div class="text-center mx-5">
            <h3 class="fw-bold">
                <font-awesome-icon icon="user-group" style="color: #ff6636" />
                {{ students }}
            </h3>
            <p class="text-muted">Students</p>
        </div>
        <div class="text-center mx-5">
            <h3 class="fw-bold">
                <font-awesome-icon icon="book" style="color: #564ffd" />
                {{ tutors }}
            </h3>
            <p class="text-muted">Tutors</p>
        </div>
    </div>
    <div class="d-flex flex-column flex-md-row align-items-start" style="background-color: #ffeedd">
        <!-- Image Container -->
        <div class="w-100 w-md-55 d-flex order-1 order-md-1 mission-image-container">
            <img src="@/assets/png/mission_image.png" alt="Mission Image" class="img-fluid mission-image" />
        </div>
        <!-- Text Content -->
        <div class="w-100 w-md-45 order-2 order-md-2 mt-auto mb-auto px-5">
            <h1 class="fw-light text-center text-md-start" style="font-size: 1.5rem; color: #ff6636">OUR ONE BILLION MISSION</h1>

            <p class="fw-semibold text-center text-md-start" style="font-size: 2.5rem; color: #1d2026">Our one billion mission sounds bold, We agree.</p>

            <blockquote class="text-center text-md-start" style="font-style: italic; color: #1d2026; font-size: 1rem">
                <p class="mb-0" style="font-size: 1.4rem">"We cannot solve our problems with the same thinking we used when we created them."</p>
                <footer class="" style="color: #6e7485; font-size: 1.3rem">Albert Einstein</footer>
            </blockquote>

            <p class="text-muted text-center text-md-start" style="font-size: 1.1rem; color: #6e7485">Institutions are slow to change. Committees are where good ideas and innovative thinking go to die. Choose agility over dogma. Embrace and drive change. We need to wipe the slate clean and begin with bold, radical thinking.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "@/axios";

const students = ref(null);
const tutors = ref(null);

onMounted(async () => {
    try {
        const response = await axios.get("/api/get-number-of-user");
        tutors.value = response.data.tutors;
        students.value = response.data.students;
    } catch (error) {
        console.error(error);
    }
});
</script>

<style>
.responsive-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.text-content {
    width: 50%;
}

.image-content {
    width: 50%;
}

@media (max-width: 1000px) {
    .responsive-container {
        flex-direction: column;
        align-items: flex-start;
        padding-left: 0;
        padding-right: 0;
    }

    .text-content,
    .image-content {
        width: 100%;
        padding-left: 0;
        padding-right: 0;
    }

    .image-content img {
        max-height: none;
        object-fit: contain;
    }
}

.mission-image-container {
    display: flex;
    align-items: flex-end;
    overflow: hidden;
    padding: 0 !important;
    margin: 0 !important;
    /* position: relative; */
}

.mission-image {
    width: 100%;
    height: auto;
    object-fit: cover;
}

@media (max-width: 733px) {
    .responsive-container {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }

    .text-content {
        width: 100%;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    .mission-image-container {
        max-height: 250px;
    }

    .mission-image {
        width: 100%;
        height: auto;
    }

    .d-flex {
        flex-direction: column;
    }

    .w-md-55,
    .w-md-45 {
        width: 100% !important;
    }

    .p-md-4 {
        padding: 1rem !important;
    }
}
</style>
