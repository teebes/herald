<template>
  <div>
    <h1>Quest Log</h1>

    <div v-for="log_entry in log_entries" :key="log_entry.id" class="mt-4">
      <h2>{{ log_entry.quest_name }}</h2>
      <div>Quest given by {{ log_entry.quest_giver }}</div>
      <div v-for="(line, index) in log_entry.enquire_cmds" :key="index" class="mt-2">{{ line }}</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import axios from "axios";

interface QuestLogEntry {
  id: number;
  quest: number;
  enquire_cmds: string;
  quest_name: string;
  quest_giver: string;
}

@Component
export default class QuestLog extends Vue {
  log_entries: QuestLogEntry[] = [];

  async created() {
    const resp = await axios.get("/game/enquiredquests/");
    this.log_entries = resp.data;
    //console.log(this.log_entries);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>