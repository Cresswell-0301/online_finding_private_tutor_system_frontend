<template>
    <div class="d-flex">
        <div class="flex-fill d-flex justify-content-center" style="background-color: #f0f2f5">
            <span class="fs-5 fw-bold m-4">Contact</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 1200px; margin: 0 auto; padding: 20px 20px 0px 20px; flex-wrap: wrap">
        <div class="text-content">
            <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #333">Connect with us</h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem; color: #666">Want to chat? We'd love to hear from you! Get in touch with our Customer Success Team to inquire about speaking events, advertising rates, or just say hello.</p>
            <button type="button" @click="redirectToWhatsapp" class="connect-button" style="padding: 10px 20px; font-size: 1rem; color: white; background-color: #25d366; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease">
                <font-awesome-icon icon="fa-brands fa-whatsapp" />
                Whatsapp
            </button>
        </div>

        <div class="image-content">
            <img src="@/assets/png/fit.png" alt="Connect Image" class="connect-image" style="max-width: 100%; height: auto; border-radius: 10px" />
        </div>
    </div>

    <div style="background-color: #f9f9f9">
        <h2 class="contact-heading" style="font-size: 2rem; padding-top: 3rem; color: #333; text-align: center">Contact Us</h2>

        <!-- Contact Details and Form -->
        <div class="contact-section" style="display: flex; justify-content: space-between; width: 100%; max-width: 1200px; margin: 0 auto; padding: 20px 40px 40px 40px; background-color: #f9f9f9">
            <!-- Left Side: Contact Details -->
            <div class="contact-details" style="flex: 1; max-width: 45%">
                <p style="font-size: 1.2rem; margin-bottom: 2rem; color: #666">Will you be in Cyberjaya or any other area any time soon? Stop by the office! We'd love to meet you.</p>

                <div style="display: flex; flex-direction: column; gap: 20px">
                    <!-- Address -->
                    <div class="contact-method">
                        <span class="contact-label">ADDRESS</span>
                        <a href="https://maps.app.goo.gl/rPkRZJDWVRLsiGFM9" style="text-decoration: none"><span class="contact-value">Multimedia University, Cyberjaya Campus</span></a>
                    </div>

                    <!-- Phone Numbers -->
                    <div class="contact-method d-flex flex-column">
                        <span class="contact-label">PHONE NUMBER</span>
                        <div class="phone-row">
                            <a href="tel:+601139303135" style="text-decoration: none"> <span class="contact-value">(60) 011-3930-3135 </span></a>
                            <span class="contact-value">(English/Mandarin)</span>
                        </div>
                        <div class="phone-row">
                            <a href="tel:+601139303135" style="text-decoration: none"> <span class="contact-value">(60) 012-345-6789 </span></a>
                            <span class="contact-value">(English/Malay)</span>
                        </div>
                    </div>
                    <!-- Email Addresses -->
                    <div class="contact-method">
                        <span class="contact-label">EMAIL ADDRESS</span>
                        <a href="mailto:admin@gmail.com" style="text-decoration: none"><span class="contact-value">admin@gmail.com</span></a>
                        <a href="mailto:admin2@gmail.com" style="text-decoration: none"><span class="contact-value">admin2@amazing.com</span></a>
                    </div>
                </div>
            </div>

            <!-- Right Side: Contact Form -->
            <div class="contact-form" style="flex: 1; max-width: 50%; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)">
                <p style="font-size: 1.5rem; margin-bottom: 1rem; color: #333">Get in touch</p>
                <p style="font-size: 1rem; margin-bottom: 2rem; color: #666">Feel free to contact us, or report any issues. We love to make new partners & friends.</p>
                <form @submit.prevent="submitForm">
                    <div class="row mb-3 align-items-end">
                        <div class="col">
                            <label class="form-label">Full Name </label>
                            <input type="text" class="form-control" id="first_name" placeholder="First name" v-model="first_name" />
                        </div>
                        <div class="col">
                            <input type="text" class="form-control" id="last_name" placeholder="Last name" v-model="last_name" />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp" placeholder="Email address" required />
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
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" placeholder="Enter your message" v-model="message"></textarea>
                    </div>
                    <button type="submit" class="ms-auto btn btn-orange">Send Message &nbsp;<font-awesome-icon icon="play" /></button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../../stores/auth";

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const country_code = ref("+60");
const phone_number = ref("");
const message = ref("");

const authStore = useAuthStore();

const redirectToWhatsapp = () => {
    window.open("https://wa.me/601111379833?text=Hello+I+have+a+question+.", "_blank");
};

const submitForm = async () => {
    const $form = {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        phone_number: country_code.value + phone_number.value,
        message: message.value,
    };

    const title = "Thank you for contacting us!";
    const name = last_name.value + " " + first_name.value;
    const mail_to = email.value;
    const customTemplate = {
        html: `
            <div>
                <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
                <p>Here are the details of your message:</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${mail_to}</li>
                    <li><strong>Phone Number:</strong> ${$form.phone_number}</li>
                    <li><strong>Message:</strong> ${$form.message}</li>
                </ul>
            </div>
        `,
    };

    try {
        await authStore.sendEmail(title, name, mail_to, customTemplate, "refresh");
    } catch (error) {
        console.error(error);
        alert("Failed to send message. Please try again later.");
    }
};
</script>

<style scoped>
.phone-row {
    display: flex;
    justify-content: space-between;
    text-decoration: none;
}
.connect-button:hover {
    background-color: #e64a19;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    font-size: 1rem;
    color: #333;
    margin-bottom: 0.5rem;
    display: block;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

.submit-button {
    padding: 10px 20px;
    font-size: 1rem;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #0056b3;
}

.contact-method {
    display: flex;
    flex-direction: column;
    align-items: left;
}

.contact-label {
    font-size: 1.125rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
}

.contact-value {
    font-size: 1rem;
    color: #666;
    margin-bottom: 0.25rem;
}

.contact-value:hover {
    color: #333;
}
.text-content {
    flex: 1 1 45%;
    max-width: 100%;
    padding-right: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}
.image-content {
    flex: 1 1 55%;
    max-width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    height: 100%;
}

@media (max-width: 800px) {
    .text-content,
    .image-content {
        flex: 1 1 100%;
        max-width: 100%;
        padding-right: 0;
    }
    .image-content {
        justify-content: center;
        margin-top: 20px;
    }
}

@media (max-width: 1000px) {
    .contact-section {
        flex-direction: column;
    }

    .contact-details,
    .contact-form {
        max-width: 100%;
        padding-right: 0;
    }

    .contact-form {
        margin-top: 20px;
    }

    .contact-label {
        font-size: 1rem;
    }

    .contact-value {
        font-size: 0.875rem;
    }
}
</style>
