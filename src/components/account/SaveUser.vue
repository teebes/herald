<template>
  <form class="single-form" @submit.prevent="saveuser">
    <h1>SAVE CHARACTER</h1>

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
        :required="true"
      />
    </div>

    <div class="form-group">
      <label for="field-username">Username</label>
      <input
        type="text"
        id="field-username"
        class="form-control"
        placeholder="Username"
        v-model="username">
    </div>

    <div class="form-group send-newsletter checkbox">
      <label>
        <input
          name="send_newsletter"
          class="form-control"
          type="checkbox"
          v-model="send_newsletter"
        />
        Receive infrequent (less than monthly) updates about new game features.
      </label>
    </div>

    <button class="btn-medium">SIGN UP</button>

    <p class="agree-tos-pos color-text-50">
      By signing up, you agree to our
      <a href="/terms">Terms of Service</a>,
      <a href="/privacy">Privacy Policy</a> and
      <a href="/conduct">Code of Conduct</a>.
    </p>

    <div class="or-separator">
      <span class="separator-line"></span>
      <span class="separator-text">OR</span>
      <span class="separator-line"></span>
    </div>

    <GoogleLogin :callback="googleLoginCallback" />
  </form>
</template>

<script lang='ts' setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { GoogleLogin } from 'vue3-google-login';

const store = useStore();

const email = ref("");
const password = ref("");
const send_newsletter = ref(false);
const username = ref("");

const saveuser = async () => {
  const payload = {
    email: email.value,
    password: password.value,
    send_newsletter: send_newsletter.value,
    username: username.value
  };
  const resp = await store.dispatch("auth/save", payload);
  if (resp.success) {
    store.commit("ui/modal/close");
  }
};

onMounted(() => {
  const email = document.getElementById("field-email") as HTMLElement;
  email.focus();
});

const googleLoginCallback = async (response: any) => {
  const resp = await store.dispatch('auth/google_save', response.credential);
  if (resp.success) {
    store.commit("ui/notification_set", "Account saved.");
    store.commit('ui/modal/close');
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
.send-newsletter {
  color: $color-text-hex-50 !important;
}
</style>