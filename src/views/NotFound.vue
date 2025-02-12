<template>
    <div>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <button @click="goBack">Go Back</button>
    </div>
</template>

<script>
export default {
    methods: {
        goBack() {
            this.$router.go(-1);
        },
    },
};
</script>
