<template>
  <div id="room_flags">
    <h2>ROOM FLAGS</h2>

    <div v-for="flag in flags" :key="flag.code">
      <label>
        <input type="checkbox" :checked="flag.value" @input="onChangeFlag(flag.code)" />
        {{ flag.label }}
      </label>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
import RoomView from "@/components/builder/room/RoomView.ts";

interface RoomFlag {
  code: string;
  label: string;
  value: boolean;
}

@Component
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
}
</script>

<style lang='scss' scoped>
h2 {
  margin-bottom: 20px;
}
</style>