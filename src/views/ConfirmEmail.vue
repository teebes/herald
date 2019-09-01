<template>
  <div></div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { AUTH_ACTIONS } from "@/constants";

@Component
export default class ConfirmEmail extends Vue {
  mounted() {
    this.$store.dispatch("auth/confirmemail", {
      code: this.$route.params.code
    });
  }
}
</script>