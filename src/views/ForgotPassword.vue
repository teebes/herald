<template>
  <form class="single-form" @submit.prevent="forgotpassword">
    <h1>FORGOT YOUR PASSWORD?</h1>

    <template v-if="sent">Request sent. Check your email inbox and click the reset link.</template>

    <template v-else>
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

      <button class="btn-medium">GET RESET LINK</button>
    </template>
  </form>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ForgotPassword extends Vue {
  email: string = "";
  sent: boolean = false;

  async forgotpassword() {
    this.sent = await this.$store.dispatch("auth/forgotpassword", {
      email: this.email
    });
    /*
    const { email, password, send_newsletter } = this;
    await this.$store.dispatch("auth/signup", {
      email,
      password,
      send_newsletter
    });
    this.$router.push("/lobby");
    return;
    */
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
</style>