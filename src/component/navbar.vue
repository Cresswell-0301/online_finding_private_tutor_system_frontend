<template>
    <div style="background-color: #1d2026">
        <ul class="nav mx-3">
            <li class="nav-item">
                <RouterLink to="/home" class="nav-link text-secondary custom-nav-link">
                    <!-- :class="{ active: $route.path === '/home' }"  when route /home call custom-nav-link active effect-->
                Home
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/tutor_list" class="nav-link text-secondary custom-nav-link">Tutor</RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/about" class="nav-link text-secondary custom-nav-link">
                About
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/contact" class="nav-link text-secondary custom-nav-link">
                Contact
                </RouterLink>
            </li>
        </ul>
    </div>
</template>

<style scoped>
  .custom-nav-link:hover {
    color: #ffffff !important;
    font-size: 1.1rem;
    transition: color 0.3s, font-size 0.3s;
  }

 
  .custom-nav-link.active {
    border-top: 3px solid #FF6636;
    color: #ffffff !important;
  }
</style>