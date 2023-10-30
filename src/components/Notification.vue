<template>
  <div id="notification-box">
    <div class="ui-notification" :class="$store.state.ui.notificationType">
      <div class="notification-background"></div>
      <div class="message" v-html="formattedNotification"></div>
      <div class="close-button" aria-label="Close" @click="closeNotification">
        <span aria-hidden="true">&#10006;</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Notification extends Vue {
  timeout: number | null = null;

  get formattedNotification() {
    return this.$store.state.ui.notification.replace(/\n/g, '<br />');
  }

  mounted() {
    if (this.$store.state.ui.notification_expires) {
      this.timeout = setTimeout(() => {
        this.$store.commit("ui/clearNotification");
      }, this.$store.state.ui.notification_expires);
    }
  }

  updated() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (this.$store.state.ui.notification_expires) {
      setTimeout(() => {
        this.$store.commit("ui/clearNotification");
      }, this.$store.state.ui.notification_expires);
    }
  }

  closeNotification() {
    this.$store.commit("ui/clearNotification");
  }
}
</script>

<style lang='scss' scoped>
#notification-box {
  z-index: 30000;
}
</style>
