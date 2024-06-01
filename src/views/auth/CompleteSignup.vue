<template>
  <form class="single-form" @submit.prevent="signup">
    <h1>SIGN UP</h1>

    <div class="instructions">
      <div>Congratulations, you have completed the introduction!</div>

      <div>To continue your adventure, create a user account below.</div>
    </div>

    <div class="form-group">
      <label for="field-email">Email</label>
      <input
        id="field-email"
        type="email"
        class="form-control required"
        placeholder="Email Address"
        name="email"
        v-model="email"
        :required="true"
      />
    </div>

    <div class="form-group">
      <label for="field-password">Password</label>
      <input
        id="field-password"
        name="password"
        type="password"
        class="form-control required"
        placeholder="Password"
        :required="true"
        v-model="password"
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
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { GoogleLogin } from 'vue3-google-login';

const store = useStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const send_newsletter = ref(false);
const username = ref('');

onMounted(() => {
  const emailEl = document.getElementById('field-email') as HTMLElement;
  emailEl.focus();
});

const googleLoginCallback = async (response: any) => {
  await store.dispatch('auth/google_save', response.credential);
  store.commit("ui/notification_set", "Account saved.");
  const player_id = route.params.player_id;
  router.push({ name: 'lobby_world_transfer', params: { player_id } });
};

const signup = async () => {
  const payload = {
    email: email.value,
    password: password.value,
    send_newsletter: send_newsletter.value,
    username: username.value
  };
  const resp = await store.dispatch('auth/save', payload);
  if (resp.success) {
    const player_id = route.params.player_id;
    router.push({ name: 'lobby_world_transfer', params: { player_id } });
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