<template>
  <form class="single-form" @submit.prevent="transfer">
    <div class="instructions">
      <div>Congratulations, you have completed the introduction!</div>

      <div>To continue your adventure in the multiplayer world, pick a unique character name.</div>
    </div>

    <div class="form-group">
      <label for="field-name">Character Name</label>
      <input
        id="field-name"
        name="name"
        class="form-control"
        placeholder="Name"
        required="required"
        v-model="name"
      />
    </div>

    <div class="form-group">
      <label for="field-gender">Gender</label>
      <select id="field-gender" name="gender" class="form-control tracked" v-model="gender">
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
    </div>

    <button type="submit" class="btn-medium">TRANSFER</button>
  </form>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import axios from "axios";

@Component
export default class LobbyTransfer extends Vue {
  name: string = "";
  gender: "male" | "female" = "female";

  async transfer() {
    const resp = await axios.post(
      `/lobby/worlds/${this.$route.params.player_id}/transfer/`,
      {
        player: this.$route.params.player_id,
        name: this.name,
        gender: this.gender
      }
    );
    this.$store.dispatch("game/world_enter", {
      player_id: this.$route.params.player_id
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>