<template>
  <form class="single-form" @submit.prevent="login">
    <h1>LOG IN</h1>

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

    <button class="btn-medium">LOG IN</button>

    <p>
      <router-link to="/forgot-password" class="forgot-password">Forgot your password?</router-link>
      <!-- <a class="forgot-password" href="#forgot-password">Forgot your password?</a> -->
    </p>
  </form>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { AUTH_ACTIONS } from "@/constants";

@Component
export default class Login extends Vue {
  email: string;
  password: string;

  constructor() {
    super();
    this.email = "";
    this.password = "";
  }

  async login() {
    const { email, password } = this;
    await this.$store.dispatch("auth/login", { email, password });
    this.$router.push("/lobby");
    return;
    this.$store.dispatch(AUTH_ACTIONS.LOGIN, { email, password }).then(() => {
      this.$router.push("/lobby");
    });
  }
}
</script>