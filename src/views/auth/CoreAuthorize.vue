<template>
  <div class="single-form">
    <h1>WRITTEN REALMS CORE</h1>
    <p v-if="!error">Signing you in to Core...</p>
    <template v-else>
      <p role="alert">{{ error }}</p>
      <router-link to="/lobby">Return to the Alpha lobby</router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { authorizeCore } from "@/core/coreSignIn";

const route = useRoute();
const router = useRouter();
const error = ref("");

onMounted(async () => {
  try {
    const target = await authorizeCore(route.query, (url, data) => axios.post(url, data));
    window.location.replace(target);
  } catch (failure: any) {
    if (failure.response?.status === 401) {
      await router.replace({ path: "/login", query: { redirect: route.fullPath } });
      return;
    }
    error.value = failure.response?.data?.detail || failure.message
      || "Core sign-in is unavailable. Please try again later.";
  }
});
</script>
