<template>
  <div id="notification-box">
    <div class="ui-notification" :class="notificationType">
      <div class="notification-background"></div>
      <div class="message" v-html="formattedNotification"></div>
      <div class="close-button" aria-label="Close" @click="closeNotification">
        <span aria-hidden="true">&#10006;</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUpdated } from "vue";
import { useStore } from "vuex";

const store = useStore();
let timeout: ReturnType<typeof setTimeout> | null = null;

const notificationType = computed(() => store.state.ui.notificationType);
const formattedNotification = computed(() => store.state.ui.notification.replace(/\n/g, '<br />'));

onMounted(() => {
  if (store.state.ui.notification_expires) {
    timeout = setTimeout(() => {
      store.commit("ui/notification_clear");
    }, store.state.ui.notification_expires);
  }
});

onUpdated(() => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  if (store.state.ui.notification_expires) {
    timeout = setTimeout(() => {
      store.commit("ui/notification_clear");
    }, store.state.ui.notification_expires);
  }
});

const closeNotification = () => {
  store.commit("ui/clearNotification");
};
</script>

<style lang='scss' scoped>
#notification-box {
  z-index: 30000;
}
</style>
