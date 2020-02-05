<template>
  <div id="room_flags">
    <h2>ROOM FLAGS</h2>

    <div v-for="flag in flags" :key="flag.code">
      <label>
        <input type="checkbox" :checked="flag.value" @input="onChangeFlag(flag.code)" />
        {{ flag.label }}
        <Help :help="flagHelp[flag.code]" v-if="flagHelp[flag.code]"/>
      </label>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import RoomView from "@/components/builder/room/RoomView.ts";
import Help from "@/components/Help.vue";

interface RoomFlag {
  code: string;
  label: string;
  value: boolean;
}

@Component({
  components: {
    Help
  }
})
export default class RoomFlags extends Mixins(RoomView) {
  flags: RoomFlag[] = [];

  async mounted() {
    const world_id = this.$route.params.world_id;
    const room_id = this.$route.params.room_id;
    const resp = await axios.get(
      `/builder/worlds/${world_id}/rooms/${room_id}/flags/`
    );
    this.flags = resp.data;
  }

  async onChangeFlag(code) {
    const world_id = this.$route.params.world_id;
    const room_id = this.$route.params.room_id;
    for (let flag of this.flags) {
      if (flag.code == code) {
        const resp = await axios.post(
          `/builder/worlds/${world_id}/rooms/${room_id}/flags/${code}/`
        );
        flag = resp.data;
      }
    }
  }

  get flagHelp() {
    return {
      workshop:
        "The 'upgrade' command is available in Workshop rooms, which lets players attempt to upgrade an item's stats.",
      no_roam:
        "Rooms flagged as No Roam are excluded from the rooms that a wandering mob might load or move into.",
      peaceful: "Characters cannot engage in combat in peaceful rooms."
    };
  }
}
</script>

<style lang='scss' scoped>
h2 {
  margin-bottom: 20px;
}
</style>