<template>
  <div id="quest_log" v-if="fetched">
    <div class="close-button hover" aria-label="Close" @click="closeQuestLog">
      <span aria-hidden="true">&#10006;</span>
    </div>

    <div class="my-4">
      <h1>Quest Log</h1>

      <template v-if="log_entries.length">
        <div v-for="log_entry in log_entries" :key="log_entry.id" class="mt-4">
          <h2 @click="onClickName(log_entry)" class="mb-2">
            <span class="interactable">{{ log_entry.quest_name }}</span>
          </h2>
          <template v-if="expanded == log_entry.id">
            <div
              v-if="log_entry.level > 1"
              class="color-text-50"
            >Suggested level: {{ log_entry.level }}</div>
            <div class="mt-2">Quest given by {{ log_entry.quest_giver }}</div>
            <div
              v-for="(line, index) in log_entry.enquire_cmds"
              :key="index"
              class="mt-2"
            >{{ line }}</div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="mt-6">No enquired quests.</div>
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
  fetched: boolean = false;

  async created() {
    const resp = await axios.get("/game/enquiredquests/", {
      headers: { "X-PLAYER-ID": this.$store.state.game.player.id }
    });
    this.log_entries = resp.data;
    this.fetched = true;

    if (this.log_entries.length) {
      this.expanded = this.log_entries[0].id;
    }
  }

  onClickName(log_entry) {
    this.expanded = log_entry.id;
  }

  closeQuestLog() {
    this.$store.commit("ui/modal_clear");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
#quest_log {
  padding: 15px;
  position: relative;

  .close-button {
    position: absolute;
    right: 0;
    top: -10px;
    padding: 20px;
  }

  h2 {
    margin: 0;
  }
}
</style>