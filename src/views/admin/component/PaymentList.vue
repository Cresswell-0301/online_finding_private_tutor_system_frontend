<template>
    <div class="container bg-white p-3">
        <div class="row w-75 m-3">
            <span class="col text-secondary" style="width: 35%">
                <font-awesome-icon icon="fa-solid fa-user" />
                Pay To
            </span>
            <span class="col text-secondary" style="width: 35%">
                <font-awesome-icon icon="fa-solid fa-user" />
                Paid By
            </span>
            <span class="col text-secondary text-center" style="width: 10%">
                <font-awesome-icon icon="fa-solid fa-credit-card" />
                Amount
            </span>
            <span class="col text-secondary text-center" style="width: 10%">
                <font-awesome-icon icon="fa-solid fa-circle-check" />
                Status
            </span>
        </div>
        <div class="d-flex flex-column gap-1 p-1" style="background-color: #f5f7fa">
            <div v-if="paymentRecords?.length === 0" class="text-center text-secondary">No payments found.</div>
            <div v-for="payment in paymentRecords" :key="payment.id" class="bg-white d-flex align-items-center">
                <div class="row w-75 m-3">
                    <span class="col" style="width: 35%">{{ payment.payTo }}</span>
                    <span class="col" style="width: 35%">{{ payment.paidBy }}</span>
                    <span class="col text-center" style="width: 10%">MYR {{ payment.amount }}</span>
                    <span class="col text-center" style="width: 10%">
                        <font-awesome-icon :icon="payment.status === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'" :style="{ color: payment.status === 'success' ? 'green' : 'red' }" />
                    </span>
                </div>
                <div class="btn btn-orange ms-auto me-3" @click="goToDetails(payment)">
                    Details
                    <font-awesome-icon icon="fa-solid fa-arrow-right" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../../stores/auth";
import router from "../../../router";

const authStore = useAuthStore();
const paymentRecords = ref([]);

onMounted(async () => {
    const data = await authStore.fetchPayments();

    const paymentHistory = data.paymentHistory;
    const bookedTime = data.bookSessions;
    const tutors = data.tutors;
    const parents = data.parents;
    const students = data.students;

    const uniquePayments = new Map();

    paymentHistory.forEach((payment) => {
        const relatedBookedTime = bookedTime.find((bookedTime) => bookedTime.id === payment.booked_time_id);
        const relatedTutor = tutors.find((tutor) => tutor.id === relatedBookedTime.tutor_id);
        const relatedParent = parents.find((parent) => parent.id === payment.parent_user_id);
        const relatedStudent = students.find((student) => student.id === payment.student_user_id);

        const key = `${relatedBookedTime.tutor_id}-${relatedBookedTime.paid_by === "parent" ? relatedParent.name : relatedStudent.name}`;

        if (!uniquePayments.has(key)) {
            uniquePayments.set(key, {
                id: payment.id,
                payTo: relatedTutor.name,
                paidBy: payment.paid_by === "Parent" ? relatedParent.name : relatedStudent.name,
                amount: parseFloat(payment.amount).toFixed(2), // Ensure amount is formatted to 2 decimal places
                status: payment.status,

                bookedTime: relatedBookedTime,
                tutor: relatedTutor,
                parent: relatedParent,
                student: relatedStudent,
                sessions: [], // Initialize sessions array
            });
        } else {
            // If the payment already exists, update the amount without duplicating
            const existingPayment = uniquePayments.get(key);
            existingPayment.amount = (parseFloat(existingPayment.amount) + parseFloat(payment.amount)).toFixed(2); // Sum up the amount and format to 2 decimal places
        }

        // Add all related sessions to the existing payment only if they are not already added
        const existingPayment = uniquePayments.get(key);
        const relatedSessions = bookedTime.filter((booked) => booked.tutor_id === relatedBookedTime.tutor_id && booked.paid_by === relatedBookedTime.paid_by);
        relatedSessions.forEach((session) => {
            if (!existingPayment.sessions.some((s) => s.sessionId === session.id)) {
                // Check if session is already added
                existingPayment.sessions.push({
                    sessionId: session.id,
                    ...session,
                });
            }
        });
    });

    paymentRecords.value = Array.from(uniquePayments.values());
});

const goToDetails = (payment) => {
    router.push({
        name: "Payment_Details",
        query: {
            data: encodeURIComponent(JSON.stringify(payment)),
        },
    });
};
</script>
