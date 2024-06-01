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

<script lang='ts' setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Help from "@/components/Help.vue";

const route = useRoute();

interface RoomFlag {
  code: string;
  label: string;
  value: boolean;
}

const flags = ref<RoomFlag[]>([]);

onMounted(async () => {
  const world_id = route.params.world_id;
  const room_id = route.params.room_id;
  const resp = await axios.get(`/builder/worlds/${world_id}/rooms/${room_id}/flags/`);
  flags.value = resp.data;
});

const onChangeFlag = async (code: string) => {
  const world_id = route.params.world_id;
  const room_id = route.params.room_id;
  for (let flag of flags.value) {
    if (flag.code == code) {
      const resp = await axios.post(`/builder/worlds/${world_id}/rooms/${room_id}/flags/${code}/`);
      flag = resp.data;
    }
  }
};

const flagHelp = {
  workshop: "The 'upgrade' command is available in Workshop rooms, which lets players attempt to upgrade an item's stats.",
  no_roam: "Rooms flagged as No Roam are excluded from the rooms that a wandering mob might load or move into.",
  peaceful: "Characters cannot engage in combat in peaceful rooms."
};
</script>

<style lang='scss' scoped>
h2 {
  margin-bottom: 20px;
}
</style>