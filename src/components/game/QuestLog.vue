<template>
  <div id="quest_log" v-if="log_entries.length">
    <h1>Quest Log</h1>

    <div v-for="log_entry in log_entries" :key="log_entry.id" class="mt-4">
      <h2 @click="onClickName(log_entry)" class="mb-2">
        <span class="interactable">{{ log_entry.quest_name }}</span>
      </h2>
      <template v-if="expanded == log_entry.id">
        <div>Quest given by {{ log_entry.quest_giver }}</div>
        <div v-for="(line, index) in log_entry.enquire_cmds" :key="index" class="mt-2">{{ line }}</div>
      </template>
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
  expanded: number = 0;

  async created() {
    const resp = await axios.get("/game/enquiredquests/");
    this.log_entries = resp.data;

    if (this.log_entries.length) {
      this.expanded = this.log_entries[0].id;
    }
  }

  onClickName(log_entry) {
    this.expanded = log_entry.id;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
#quest_log {
  padding: 15px;
}
</style>