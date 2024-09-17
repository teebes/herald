<template>
  <div class="lookup-desktop lookup-char">
    <CharInfo :char="char" />

    <div class="actions" v-if="!isSelf">
      <div
        class="action primary"
        v-if="actionsData.primaryAction"
        @click="doAction(char, actionsData.primaryAction.action)"
      >{{ actionsData.primaryAction.label }}</div>
      <div
        class="action"
        v-for="(action, index) in actionsData.actions"
        :key="index"
        @click="doAction(char, action.action)"
      >{{ action.label}}</div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import CharInfo from "@/components/game/CharInfo.vue";
import { getTargetInGroup } from "@/core/utils.ts";

const store = useStore();

const props = defineProps<{ entity: any }>();

const char = computed(() => props.entity);

const doAction = (char: any, action: string) => {
  if (action === 'craft' || action === 'upgrade') {
    store.dispatch('game/cmd', `${action}`);
  } else {
    const target = getTargetInGroup(char, store.state.game.room.chars);
    store.dispatch("game/cmd", `${action} ${target}`);
  }
  store.commit("game/lookup_clear");
  store.commit("ui/modal/close");
};

const actionsData = computed(() => {
  if (!char.value.actions) {
    return {};
  }

  let actions: any[] = [],
    ACTIONS_COUNT = 3,
    actionsPriority = [
      // higher the better
      { action: "complete", label: "COMPLETE" },
      { action: "craft", label: "CRAFT" },
      { action: "upgrade", label: "UPGRADE"},
      { action: "follow", label: "FOLLOW" },
      { action: "unfollow", label: "UNFOLLOW" },
      { action: "group", label: "GROUP" },
      { action: "list", label: "LIST" },
      { action: "offer", label: "OFFER" },
      { action: "enquire", label: "ENQUIRE" },
      { action: "kill", label: "KILL" }
    ];

  for (let action of actionsPriority) {
    if (char.value.actions[action.action]) {
      // If a completion action is provided, replace the complete
      // entry with it.
      if (
        action.action == "complete" &&
        char.value.actions.completion_action
      ) {
        var completion_action = char.value.actions.completion_action;
        action = {
          action: completion_action.toLowerCase(),
          label: completion_action.toUpperCase()
        };
      }
      actions.push(action);
    }
    if (actions.length >= ACTIONS_COUNT) {
      break;
    }
  }

  var primaryAction;
  if (actions.length > 0) {
    primaryAction = actions.shift();
  }

  return {
    primaryAction: primaryAction,
    actions: actions,
    displayActions: true
  };

});

const isSelf = computed(() => {
  if (char.value.key === store.state.game.player.key) return true;
  return false;
});

</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>