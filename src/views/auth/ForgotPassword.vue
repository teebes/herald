<template>
  <form class="single-form" @submit.prevent="forgotpassword">
    <h1>FORGOT YOUR PASSWORD?</h1>

    <template v-if="sent">If this account can receive email, a reset link has been requested. Check your inbox. If you recently requested a link, allow time for it to arrive before trying again.</template>

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
          :required="true"
        />
      </div>

      <button class="btn-medium" :disabled="sending">GET RESET LINK</button>
    </template>
  </form>
</template>

<script lang='ts' setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const email = ref("");
const sent = ref(false);
const sending = ref(false);

const forgotpassword = async () => {
  if (sending.value) return;
  sending.value = true;
  try {
    sent.value = await store.dispatch("auth/forgotpassword", { email: email.value });
  } finally {
    sending.value = false;
  }
};

onMounted(() => {
  const emailEl = document.getElementById("field-email") as HTMLElement;
  emailEl.focus();
});
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
</style>
