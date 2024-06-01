<template>
  <div id="quest_log" v-if="fetched">
    <div class="close-button hover" aria-label="Close" @click="closeQuestLog">
      <span aria-hidden="true">&#10006;</span>
    </div>

    <div class="my-4">
      <h1 class='mb-4'>Quest Log</h1>

      <div class="tabs-view">
        <div class="tabs">
          <div
            class="tab-item"
            :class="{ activeTab: selectedTab == 'open'}"
            @click="clickTab('open')">Open Quests</div>
          <div
            class="tab-item"
            :class="{ activeTab: selectedTab == 'repeatable'}"
            @click="clickTab('repeatable')">Repeatable Quests</div>
          <div
            class="tab-item"
            :class="{ activeTab: selectedTab == 'completed'}"
            @click="clickTab('completed')">Completed Quests</div>
        </div>
      </div>

      <template v-if="log_entries.length">
        <div v-for="log_entry in log_entries" :key="log_entry.id" class="mt-4">
          <h2 @click="onClickName(log_entry)" class="mb-2">
            <span class="interactive">{{ log_entry.quest_name }}</span>
            <span class='ml-2 color-text-50' v-if="store.state.game.player.is_immortal">[ {{ log_entry.id }} ]</span>
          </h2>
          <template v-if="expanded == log_entry.id">
            <div
              v-if="log_entry.level > 1"
              class="color-text-50"
            >Suggested level: {{ log_entry.level }}</div>
            <div class="my-2 color-text-50">Quest given by {{ log_entry.quest_giver }}</div>

            <div v-if="log_entry.summary">
              <div v-for="(line, index) in log_entry.summary.split('\n')" :key="index">{{ line }}</div>
            </div>
            <div v-else v-for="(line, index) in log_entry.enquire_cmds" :key="index">{{ line }}</div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="mt-6" v-if="selectedTab == 'repeatable'">No repeatable quests.</div>
        <div class="mt-6" v-else-if="selectedTab == 'completed'">No completed quests.</div>
        <div class="mt-6" v-else>No enquired quests.</div>

      </template>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const store = useStore();

interface QuestLogEntry {
  id: number;
  quest: number;
  level: number;
  summary: string;
  enquire_cmds: string;
  quest_name: string;
  quest_giver: string;
}

const log_entries = ref<QuestLogEntry[]>([]);
const expanded = ref<number>(0);
const fetched = ref<boolean>(false);
const selectedTab = ref<string>("open"); // Could also be "completed" or "repeatable"


const get_quests = async () => {
  let endpoint = "/game/quests/open/";
  if (selectedTab.value == 'completed') {
    endpoint = "/game/quests/completed/";
  } else if (selectedTab.value == 'repeatable') {
    endpoint = "/game/quests/repeatable/";
  }

  const resp = await axios.get(endpoint, {
    headers: { "X-PLAYER-ID": store.state.game.player.id }
  });
  log_entries.value = resp.data;
  fetched.value = true;

  if (log_entries.value.length) {
    expanded.value = log_entries.value[0].id;
  }
};

const clickTab = async (tab: string) => {
  selectedTab.value = tab;
  await get_quests();
};

const onClickName = (log_entry: QuestLogEntry) => {
  expanded.value = log_entry.id;
};

const closeQuestLog = () => {
  store.commit("ui/modal/close");
};

onMounted(async () => {
  await get_quests();
});
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