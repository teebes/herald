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
        :required="true"
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

<script lang='ts' setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import axios from "axios";

const store = useStore();
const route = useRoute();

const name = ref("");
const gender = ref<"male" | "female">("female");

const transfer = async () => {
  const resp = await axios.post(`/lobby/worlds/${route.params.player_id}/transfer/`, {
    player: route.params.player_id,
    name: name.value,
    gender: gender.value
  });
  store.dispatch('game/request_enter_world', {
    player_id: route.params.player_id,
    world_id: resp.data.world_id,
  });
};
</script>