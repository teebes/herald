<template>
  <div class='email-confirmation my-4' v-if="!user.is_confirmed">
    <div class='mt-2' v-if="user.is_invalid">Email delivery is disabled for this account. Please contact support for help.</div>
    <div class='mt-2' v-else>Your e-mail address is not confirmed. Certain features will be unavailable until you confirm it.</div>

    <div class='my-3'>
      <button @click.prevent='onClickResend' class='btn-small' :disabled='sending || remaining > 0 || user.is_invalid'>RESEND CONFIRMATION E-MAIL</button>
      <div v-if='remaining > 0' class='mt-2'>You can request another email in {{ retryMinutes }} {{ retryMinutes === 1 ? 'minute' : 'minutes' }}.</div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useStore } from 'vuex';
import { computed, ref, onUnmounted } from 'vue';

const store = useStore();
const user = computed(() => store.state.auth.user);
const sending = ref(false);
const remaining = ref(0);
const retryMinutes = computed(() => Math.ceil(remaining.value / 60));
let timer: ReturnType<typeof setInterval> | undefined;
let disposed = false;
onUnmounted(() => {
  disposed = true;
  clearInterval(timer);
});

const onClickResend = async () => {
  if (sending.value || remaining.value > 0 || user.value.is_invalid) return;
  sending.value = true;
  try {
    const result = await store.dispatch("auth/resendemailconfirmation");
    if (disposed) return;
    remaining.value = result.retryAfter;
    clearInterval(timer);
    if (remaining.value > 0) {
      const retryAt = Date.now() + remaining.value * 1000;
      timer = setInterval(() => {
        remaining.value = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
        if (!remaining.value) clearInterval(timer);
      }, 1000);
    }
  } finally {
    sending.value = false;
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
