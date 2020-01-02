<template>
  <form class="single-form" @submit.prevent="signup">
    <h1>SIGN UP</h1>

    <div class="instructions">
      <div>Congratulations, you have completed the introduction!</div>

      <div>To continue your adventure, create a user account below.</div>
    </div>

    <div class="form-group">
      <label for="field-email">Email</label>
      <input
        id="field-email"
        type="email"
        class="form-control required"
        placeholder="Email Address"
        name="email"
        v-model="email"
        required="required"
      />
    </div>

    <div class="form-group">
      <label for="field-password">Password</label>
      <input
        id="field-password"
        name="password"
        type="password"
        class="form-control required"
        placeholder="Password"
        required="required"
        v-model="password"
      />
    </div>

    <div class="form-subsection">
      <div class="groups">
        <div class="form-group">
          <label for="field-first_name">First Name</label>
          <input
            id="field-first_name"
            name="first_name"
            class="form-control"
            placeholder="First Name"
            v-model="first_name"
          />
        </div>

        <div class="form-group">
          <label for="field-last_name">Last Name</label>
          <input
            id="field-last_name"
            name="last_name"
            class="form-control"
            placeholder="Last Name"
            v-model="last_name"
          />
        </div>
      </div>
    </div>

    <!-- <div class="form-group">
      <label for="field-username">
        Username
        <span>(optional)</span>
      </label>
      <input
        id="field-username"
        name="username"
        class="form-control"
        placeholder="Username"
        v-model="username"
      />
    </div>-->

    <div class="form-group send-newsletter checkbox">
      <label>
        <input
          name="send_newsletter"
          class="form-control"
          type="checkbox"
          v-model="send_newsletter"
        />
        Receive infrequent (less than monthly) updates about new game features.
      </label>
    </div>

    <button type="submit" class="btn-medium">SIGN UP</button>

    <p class="agree-tos-pos">
      By signing up, you agree to our
      <a href="/#tos">Terms of Service</a> and
      <a href="/#privacy">Privacy Policy</a>.
    </p>
  </form>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { AUTH_ACTIONS } from "@/constants";
import router, { LOBBY_WORLD_TRANSFER } from "@/router";

@Component
export default class SignUp extends Vue {
  email: string;
  password: string;
  send_newsletter: boolean;
  username: string;
  first_name: string;
  last_name: string;

  constructor() {
    super();
    this.email = "";
    this.password = "";
    this.send_newsletter = false;
    this.username = "";
    this.first_name = "";
    this.last_name = "";
  }

  created() {
    //console.log(this.$route.params.world_id);
    //console.log(this.$route.params.player_id);
  }

  async signup() {
    const {
      email,
      password,
      send_newsletter,
      username,
      first_name,
      last_name
    } = this;
    const payload = {
      email,
      password,
      send_newsletter,
      username,
      first_name,
      last_name
    };
    const params = {
      player_id: this.$route.params.player_id
    };
    try {
      const resp = await this.$store.dispatch("auth/save", payload);
      if (resp.status === 201)
        this.$router.push({ name: LOBBY_WORLD_TRANSFER, params: params });
    } catch (e) {}
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
.send-newsletter {
  color: $color-text-hex-50 !important;
}
</style>