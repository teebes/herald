<template>
  <div class='email-confirmation my-4' v-if="!user.is_confirmed">
    <div class='mt-2' v-if="!user.is_confirmed">Your e-mail address is not confirmed. Certain features will be unavailable until you confirm it.</div>

    <div class='my-3'>
      <button @click.prevent='onClickResend' class='btn-small'>RESEND CONFIRMATION E-MAIL</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class extends Vue {
  get user() {
    console.log(this.$store.state.auth.user);
    return this.$store.state.auth.user;
  }

  async onClickResend() {
    const resp = await this.$store.dispatch("auth/resendemailconfirmation");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.email-confirmation {
  border-top: 1px solid $color-text-half;
  border-bottom: 1px solid $color-text-half;
}
</style>