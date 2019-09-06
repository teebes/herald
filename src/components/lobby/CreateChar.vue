<template>
  <div class="new-character">
    <div class="new-char-signup" v-if="showSignup">
      <SignUp :redirect="$route.fullPath" />
    </div>

    <div class="wrapper" v-else>
      <form class @submit.prevent="createCharacter">
        <h1 class="form-title">CREATE NEW CHARACTER</h1>
        <div class="flex">
          <div class="form-group flex-1">
            <label for="field-name">Name</label>
            <input
              id="field-name"
              type="name"
              class="form-control"
              placeholder="Name"
              v-model="charname"
              required="required"
            />
          </div>
          <div class="form-group flex-1">
            <label for="field-gender">Gender</label>
            <select id="field-gender" v-model="gender">
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div class="form-group flex-1" v-if="$route.params.world_id != INTRO_WORLD_ID">
            <label for="field-archetype">Class</label>
            <select id="field-archetype" v-model="archetype">
              <option value="warrior">Warrior</option>
              <option value="mage">Mage</option>
              <option value="cleric">Cleric</option>
            </select>
          </div>
        </div>
        <button class="btn-large">CREATE CHARACTER</button>
      </form>
    </div>
    <div class="cancel-action" @click="$emit('cancelcreate')">cancel</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import axios from "axios";
import { INTRO_WORLD_ID } from "@/config.ts";
import SignUp from "@/views/SignUp.vue";

@Component({
  components: {
    SignUp
  }
})
export default class extends Vue {
  INTRO_WORLD_ID = INTRO_WORLD_ID;

  charname: string = "";
  gender: string = "female";
  archetype: string = "warrior";

  get showSignup() {
    console.log(this.$store.state.auth);
    return !this.$store.state.auth.token;
  }

  async createCharacter() {
    const resp = await axios.post(
      `lobby/worlds/${this.$route.params.world_id}/chars/`,
      {
        name: this.charname,
        gender: this.gender,
        archetype: this.archetype
      }
    );
    if (resp.status === 201) {
      // this.chars.push(resp.data);
      this.$emit("charcreated", resp.data);
      this.charname = "";
      this.gender = "female";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.new-character {
  margin-bottom: 50px;
}
</style>