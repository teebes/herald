<template>
  <form class="single-form" @submit.prevent="login">
    <h1>LOG IN</h1>

    <div class="form-group">
      <label for="field-email">Email</label>
      <input
        id="field-email"
        type="email"
        class="form-control"
        placeholder="Email Address"
        v-model="email"
        name="email"
        :required="true"
        />
    </div>

    <div class="form-group">
      <label for="field-password">Password</label>
      <input
        id="field-password"
        name="password"
        type="password"
        v-model="password"
        class="form-control required"
        placeholder="Password"
        :required="true" />
    </div>

    <button class="btn-medium">LOG IN</button>

    <p><router-link :to="{ name: 'forgot-password' }" class="forgot-password">Forgot your password?</router-link></p>

    <!-- 'or' separator -->
    <div class="or-separator">
      <span class="separator-line"></span>
      <span class="separator-text">OR</span>
      <span class="separator-line"></span>
    </div>

    <GoogleLogin :callback="googleLoginCallback" />
  </form>
</template>

<script lang='ts' setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GoogleLogin } from 'vue3-google-login';

const email = ref("");
const password = ref("");

const store = useStore();
const router = useRouter();

onMounted(() => {
  const emailInput = document.getElementById("field-email") as HTMLElement;
  emailInput.focus();
});

const login = async () => {
  await store.dispatch('auth/login', {
    email: email.value,
    password: password.value
  });
  router.push("/lobby");
}

const googleLoginCallback = async (response) => {
  await store.dispatch('auth/google_login', response.credential);
  router.push("/lobby");
}
</script>
