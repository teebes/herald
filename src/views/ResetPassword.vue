<template>
  <form class="single-form" @submit.prevent="resetpassword">
    <h1>RESET YOUR PASSWORD</h1>

    <div class="form-group">
      <label for="field-password">New Password</label>
      <input
        id="field-password"
        name="password"
        type="password"
        class="form-control"
        placeholder="Password"
        required="required"
        v-model="password"
      />
    </div>

    <div class="form-group">
      <label for="field-confirm">Repeat Password</label>
      <input
        id="field-confirm"
        name="confirm"
        type="password"
        class="form-control"
        placeholder="Repeat Password"
        v-model="confirm"
      />
    </div>

    <button type="submit" class="btn-medium">RESET PASSWORD</button>
  </form>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ResetPassword extends Vue {
  password: string = "";
  confirm: string = "";

  async resetpassword() {
    if (this.password != this.confirm) {
      this.$store.commit("ui/notification_set_error", "Passwords don't match.");
      return;
    }

    await this.$store.dispatch("auth/resetpassword", {
      code: this.$route.params.code,
      password: this.password
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
</style>