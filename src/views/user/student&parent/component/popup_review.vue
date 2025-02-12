<template>
    <div class="modal-overlay">
        <div class="review">
            <!-- Header -->
            <div class="header">
                <span class="header-title">Write a Review</span>
                <button class="close-btn" @click="$emit('close')">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </button>
            </div>

            <!-- Star Rating -->
            <div class="starlabel">
                <div class="rating-text">
                    <span class="rating-score">{{ selectedRating }}/5</span>
                    <span class="rating-label">{{ ratingLabels[selectedRating] }}</span>
                </div>
                <div class="stars">
                    <font-awesome-icon v-for="index in 5" :key="index" :icon="index <= selectedRating ? 'fa-solid fa-star' : 'fa-regular fa-star'" class="star" @mouseover="hoverRating = index" @mouseleave="hoverRating = selectedRating" @click="selectRating(index)" />
                </div>
            </div>

            <!-- Feedback -->
            <div class="feedback">
                <label for="feedback">Feedback</label>
                <textarea id="feedback" v-model="feedbackText" placeholder="Write down your feedback here..."></textarea>
            </div>

            <!-- Button Area -->
            <div class="buttonarea">
                <button class="submit-btn" @click="submitReview">Submit Review</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useTutorStore } from "../../../../stores/tutor";

const selectedRating = ref(5);
const hoverRating = ref(0);
const feedbackText = ref("");

const props = defineProps({
    rateBy: {
        type: Number,
        required: true,
    },
    tutorId: {
        type: String,
        required: true,
    },
});

const ratingLabels = {
    1: "(Very Bad)",
    2: "(Bad)",
    3: "(Neutral)",
    4: "(Good)",
    5: "(Excellent)",
};

const selectRating = (rating) => {
    selectedRating.value = rating;
};

const submitReview = async () => {
    try {
        await useTutorStore().ratingTutor({
            rateBy: props.rateBy,
            tutorId: props.tutorId,
            rating: selectedRating.value,
            feedback: feedbackText.value,
        });
    } catch (error) {
        console.error("Error rating tutor: ", error);
    }
};
</script>

<style scoped>
/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.review {
    background: #ffffff;
    padding: 2rem;

    /* adjust size for review form */
    width: 550px;

    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border-radius: 8px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
}

.header-title {
    font-size: 1.2rem;
    font-weight: bold;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #8c94a3;
}

/* Stars */
.starlabel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.rating-text {
    font-size: 1.2rem;
    color: #8c94a3;
    font-weight: 300;
}

.stars {
    display: flex;
    gap: 0.5rem;
}

.star {
    font-size: 2rem;
    color: #ff6636;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}

.star:hover {
    transform: scale(1.2);
}

/* Feedback */
.feedback {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.feedback label {
    font-size: 1rem;
    font-weight: 500;
}

.feedback textarea {
    width: 100%;
    height: 100px;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    resize: none;
    font-size: 1rem;
    color: #333;
}

.feedback textarea::placeholder {
    color: #8c94a3;
}

/* Button */
.buttonarea {
    display: flex;
    justify-content: flex-end;
    padding-right: 1rem;
}

.submit-btn {
    background: #ff6636;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
}

.submit-btn:hover {
    background: #e05530;
}
</style>
