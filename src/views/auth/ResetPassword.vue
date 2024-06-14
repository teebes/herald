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

<script lang='ts' setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const password = ref("");
const confirm = ref("");

const resetpassword = () => {
  if (password.value != confirm.value) {
    store.commit("ui/notification_set_error", "Passwords don't match.");
    return;
  }

  store.dispatch("auth/resetpassword", {
    code: route.params.code,
    password: password.value
  });
};

onMounted(() => {
  const passwordEl = document.getElementById("field-password") as HTMLInputElement;
  passwordEl.focus();
});
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
</style>