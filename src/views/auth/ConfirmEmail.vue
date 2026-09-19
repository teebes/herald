<template>
  <div class="single-form">
    <h1>CONFIRM EMAIL</h1>
    <p v-if="!failed">Confirming your email...</p>
    <template v-else>
      <p role="alert">This confirmation link is invalid or expired. Sign in and request a new confirmation from your account menu.</p>
      <router-link to="/login">Sign in</router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();
const failed = ref(false);

onMounted(async () => {
  failed.value = !await store.dispatch("auth/confirmemail", { code: route.params.code });
});
</script>
