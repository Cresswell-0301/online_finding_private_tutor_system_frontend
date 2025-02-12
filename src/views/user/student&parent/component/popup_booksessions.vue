<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <!-- Header -->
            <div class="modal-header">
                <span class="modal-title">Book Session - {{ title }}</span>
                <button class="close-btn" @click="$emit('close')">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </button>
            </div>

            <!-- Child Selection (Parent Only) -->
            <div v-if="authStore.user.role === 'parent'" class="ordersummary">
                <span class="order-title">Book For</span>
                <select v-model="selectedChild" class="form-select">
                    <option value="" disabled>Select child</option>
                    <option v-for="child in authStore.linkAccount" :key="child.id" :value="child.id">
                        {{ child.email }}
                    </option>
                </select>
            </div>

            <div class="ordersummary">
                <span class="order-title">Month</span>
                <div class="order-item">
                    <span>{{ month }}</span>
                </div>
            </div>

            <!-- Session Selection -->
            <div class="sessionarea">
                <span class="section-title">Sessions</span>
                <div class="checkboxarea">
                    <label v-for="(session, index) in availabilityList" :key="index" class="checkbox-label">
                        <input type="checkbox" v-model="selectedSessions" :value="session" />
                        <span>{{ session }}</span>
                    </label>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="ordersummary">
                <span class="order-title">Order Summary</span>
                <div class="order-details">
                    <div class="order-item">
                        <span>Subtotal</span>
                        <span>MYR {{ subtotal.toFixed(2) }}</span>
                    </div>
                    <div class="order-item">
                        <span class="service-charge">Platform Service Charge</span>
                        <span>6%</span>
                    </div>
                </div>
                <div class="order-total">
                    <span>Total:</span>
                    <span class="total-price">MYR {{ totalPrice.toFixed(2) }}</span>
                </div>
            </div>

            <!-- Button Area -->
            <div class="buttonarea">
                <button class="payment-btn" @click="makePayment">
                    Make Payment
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../../../../stores/auth";

const authStore = useAuthStore();

const props = defineProps({
    month: {
        type: String,
        required: true,
        default: () => "",
    },
    availabilityList: {
        type: Array,
        required: true,
        default: () => [],
    },
    price: {
        type: [String, Number],
        required: true,
        default: () => 0,
    },
    title: {
        type: String,
        required: true,
        default: () => "",
    },
    tutorId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

const selectedSessions = ref([]);
const selectedChild = ref("");
const serviceChargeRate = 0.06;

const subtotal = computed(() => selectedSessions.value.length * Number(props.price));
const totalPrice = computed(() => subtotal.value * (1 + serviceChargeRate));

const loading = ref(false);

const makePayment = async () => {
    loading.value = true;

    if (selectedSessions.value.length === 0) {
        alert("Please select at least one session before proceeding to payment");
        loading.value = false;
        return;
    }

    if (authStore.user.role === "parent" && !selectedChild.value) {
        alert("Please select a child before proceeding to payment");
        loading.value = false;
        return;
    }

    try {
        await authStore.makePayment({
            month: props.month,
            sessions: selectedSessions.value,
            price: props.price,
            service_charge: serviceChargeRate,
            subtotal: subtotal.value,
            total_price: totalPrice.value,
            title: props.title,
            tutor_id: props.tutorId,
            parent_user_id: authStore.user.role === "parent" ? authStore.user.id : null,
            child_user_id: authStore.user.role === "parent" ? selectedChild.value : authStore.user.id,
        });
    } catch (error) {
        console.log(error);
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: #ffffff;
    width: 550px;
    padding: 1.5rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5rem;
    /* border-bottom: 2px solid #ff6636; */
}

.modal-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #1d2026;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #6e7485;
}

/* Sessions select area */
.sessionarea {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1d2026;
}

.checkboxarea {
    border: 1px solid #e9eaf0;
    border-radius: 6px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
}

/* Checkbox custom */
.checkbox-label input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #6e7485;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"]:hover {
    border-color: #ff6636;
}

.checkbox-label input[type="checkbox"]:checked {
    background-color: #ff6636;
    border-color: #ff6636;
}

.checkbox-label input[type="checkbox"]:checked::after {
    /* content: "✔"; */
    font-size: 14px;
    color: white;
    display: block;
    text-align: center;
}

.checkbox-label input[type="checkbox"]:checked ~ span {
    color: #ff6636;
    font-weight: 600;
}

/* Order Summary */
.ordersummary {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.order-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1d2026;
}

.order-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-bottom: 1px solid #e9eaf0;
    padding-bottom: 0.5rem;
}

.order-item {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
}

.service-charge {
    color: #6e7485;
}

.order-total {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: bold;
}

.total-price {
    font-size: 1.2rem;
    font-weight: bold;
    color: #1d2026;
}

/* Button Area */
.buttonarea {
    display: flex;
    justify-content: flex-end;
}

.payment-btn {
    background-color: #ff6636;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 4px;
}

.payment-btn:hover {
    background-color: #e05530;
}

/* Form Select */
.form-select {
    padding: 0.5rem;
    border: 1px solid #e9eaf0;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
}

.form-select:focus {
    outline: none;
    border-color: #ff6636;
}
</style>
