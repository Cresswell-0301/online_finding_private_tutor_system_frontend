<template>
    <!-- navbar -->
    <navbar_design />
    <!-- header -->
    <header_design />
    <div class="flex-fill">
        <router-view></router-view>
    </div>
    <!-- footer -->
    <footer_design />
</template>

<script setup>
import navbar_design from "@/component/navbar.vue";
import header_design from "@/component/header.vue";
import footer_design from "@/component/footer.vue";
</script>
