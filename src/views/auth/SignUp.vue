<template>
  <form class="single-form" @submit.prevent="signup">
    <h1>SIGN UP</h1>

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
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { GoogleLogin } from 'vue3-google-login';

const store = useStore();
const router = useRouter();

const props = defineProps<{
  redirect?: string;
}>();

const email = ref('');
const password = ref('');
const send_newsletter = ref(false);
const username = ref('');

onMounted(() => {
  const emailInput = document.getElementById('field-email') as HTMLElement;
  emailInput.focus();
});

const signup = async () => {
  try {
    await store.dispatch('auth/signup', {
      email: email.value,
      password: password.value,
      send_newsletter: send_newsletter.value,
      username: username.value
    });
    if (props.redirect) {
      router.push({
        path: props.redirect,
        query: {
          create: 'true'
        }
      });
    } else {
      router.push({ name: 'lobby' });
    }
  } catch (e) {
    // Stay on the page
  }
}

const googleLoginCallback = async (response) => {
  await store.dispatch('auth/google_login', response.credential);
  router.push("/lobby");
}
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
.send-newsletter {
  color: $color-text-hex-50 !important;
}
</style>