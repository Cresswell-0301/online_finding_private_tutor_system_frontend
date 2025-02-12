<template>
    <div class="purchase-history-container w-75">
        <!-- Header -->
        <div class="title">
            <h2>Purchase History</h2>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- ✅ if record empty show this msg -->
            <div v-if="isEmpty" class="no-record">
                <p>No any purchase record, let's go to book a session!</p>
            </div>

            <!-- ✅ show record -->
            <div v-else>
                <div class="recordbar" v-for="(record, index) in purchaseRecords" :key="index">
                    <!-- Session Record -->
                    <div class="sessionrecord">
                        <div class="session-box" v-for="(session, idx) in record.sessions" :key="idx">
                            <!-- Image -->
                            <div class="imagediv">
                                <img :src="session.image" alt="Tutor Image" />
                            </div>

                            <!-- Details -->
                            <div class="detail">
                                <div class="tutor-name">{{ session.tutorName }}</div>
                                <div class="sessions-count">Sessions: {{ session.sessionsCount }}</div>
                            </div>

                            <!-- Price -->
                            <div class="price">MYR {{ session.price }}</div>
                        </div>
                    </div>

                    <!-- Purchase Record -->
                    <div class="purchaserecord">
                        <!-- Purchase Date -->
                        <div class="purchase-date">{{ record.date }}</div>

                        <!-- Purchase Record Detail -->
                        <div class="purchase-record-detail">
                            <div class="purchase-item">
                                <font-awesome-icon icon="fa-solid fa-book-open" />
                                <span>{{ record.totalSessions }} Sessions</span>
                            </div>
                            <div class="purchase-item">
                                <font-awesome-icon icon="fa-solid fa-dollar-sign" />
                                <span>MYR {{ record.totalAmount }}</span>
                            </div>
                            <div class="purchase-item">
                                <font-awesome-icon icon="fa-solid fa-credit-card" />
                                <span>Credit Card</span>
                            </div>
                        </div>

                        <!-- Payment Detail -->
                        <div class="payment-detail">
                            <div class="card-holder">
                                <span>{{ record.cardHolder }}</span>
                            </div>
                            <div class="card-number">
                                <span>{{ maskCardNumber(record.cardNumber) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p v-if="!isEmpty">Yay! You have seen all your purchase history.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../../../../stores/auth";

const authStore = useAuthStore();

const purchaseRecords = ref([]);
const isEmpty = ref(true);

onMounted(async () => {
    const data = await authStore.fetchPurchaseHistory(authStore.user.id);

    const paymentHistory = data.paymentHistory;
    const bookedTime = data.bookedTime;
    const tutorSession = data.tutorSessions;
    const grpSession = data.grpSession;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const cardHolder = authStore.user.name;
    const cardNumber = "4242424242424242";

    purchaseRecords.value = grpSession.map((sessionGroup) => {
        const relatedPayments = paymentHistory.filter((payment) => sessionGroup.grouped_ids.includes(payment.booked_time_id));

        const totalAmount = relatedPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2);

        return {
            date: formatDate(relatedPayments.length > 0 ? relatedPayments[0].created_at : new Date()), // Use first payment date
            totalSessions: sessionGroup.grouped_ids.length,
            totalAmount: totalAmount,
            cardHolder: cardHolder,
            cardNumber: cardNumber,
            sessions: [
                {
                    image: sessionGroup.title_image ? `http://127.0.0.1:8000${sessionGroup.title_image}` : "https://demofree.sirv.com/nope-not-here.jpg",
                    tutorName: sessionGroup.title,
                    sessionsCount: sessionGroup.grouped_ids.length,
                    price: totalAmount,
                },
            ],
        };
    });

    if (paymentHistory.length != 0 && bookedTime.length != 0 && tutorSession.length != 0) {
        isEmpty.value = false;
    }
});

// card no mask
const maskCardNumber = (cardNumber) => {
    return cardNumber.slice(0, 4) + "-****-****-" + cardNumber.slice(-4);
};
</script>

<style scoped>
/* ✅ main container*/
.purchase-history-container {
    display: flex;
    flex-direction: column;
    /* width: 100%;
    max-width: 900px; */
    margin: auto;
}

/* ✅title*/
.title {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: left;
    padding: 1rem 0;
    border-bottom: 1px solid #e9eaf0;
}
/* ✅no record*/
.no-record {
    text-align: center;
    font-size: 1.2rem;
    color: #6e7485;
    font-weight: bold;
    padding: 2rem;
}

/* ✅ content */
.content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0;
}

/* ✅ Record Bar */
.recordbar {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    padding: 1rem;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
}

/* ✅ Session Record */
.sessionrecord {
    display: flex;
    flex-direction: column;
    flex: 6;
    gap: 1rem;
}

/* ✅ Session Box */
.session-box {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
}

/* ✅ image */
.imagediv img {
    width: 100px;
    height: 80px;
    /* border-radius: 6px; */
}

/* ✅ Detail */
.detail {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
}

.tutor-name {
    font-size: 1.1rem;
    font-weight: normal;
}

.sessions-count {
    font-size: 0.9rem;
    color: #6e7485;
}

/* ✅ Price */
.price {
    font-size: 1.2rem;
    font-weight: bold;
    color: #ff6636;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;
}

/* ✅ Purchase Record */
.purchaserecord {
    display: flex;
    flex-direction: column;
    flex: 4;
    gap: 1rem;
    border-left: 3px solid #e9eaf0;
    padding-left: 1.5rem;
    justify-content: center;
}

/* ✅ Purchase Date */
.purchase-date {
    font-size: 1.1rem;
    font-weight: bold;
    color: #1d2026;
}

/* ✅ Purchase Detail */
.purchase-record-detail {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
}

.purchase-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #6e7485;
}

/* ✅ Payment Detail */
.payment-detail {
    display: flex;
    flex-direction: row;
    gap: 3rem;
}

.card-holder,
.card-number {
    font-size: 0.9rem;
    color: #1d2026;
}

/* ✅ Footer */
.footer {
    text-align: center;
    font-size: 0.9rem;
    color: #6e7485;
    padding: 1rem 0;
}
</style>
