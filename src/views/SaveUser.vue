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
        required="required"
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
        required="required"
      />
    </div>

    <div class="form-group">
      <label for="field-username">
        Username
        <span>(optional)</span>
      </label>
      <input
        id="field-username"
        name="username"
        class="form-control"
        placeholder="Username"
        v-model="username"
      />
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
      <a href="/#tos">Terms of Service</a> and
      <a href="/#privacy">Privacy Policy</a>.
    </p>
  </form>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { UI_MUTATIONS } from "@/constants";

@Component
export default class SignUp extends Vue {
  email: string = "";
  password: string = "";
  send_newsletter: boolean = false;
  username: string = "";

  async saveuser() {
    const { email, password, send_newsletter, username } = this;
    await this.$store.dispatch("auth/save", {
      email,
      password,
      send_newsletter,
      username
    });
    this.$store.commit(
      UI_MUTATIONS.SET_NOTIFICATION,
      "Account saved and confirmation e-mail sent."
    );
    this.$store.commit(UI_MUTATIONS.MODAL_CLOSE);
  }
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