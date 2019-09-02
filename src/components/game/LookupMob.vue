<template>
  <div class="lookup-desktop lookup-char">
    <CharInfo :char="char" />

    <div class="actions">
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

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { capfirst } from "@/helpers/utils.ts";
import CharInfo from "./CharInfo.vue";

interface Payload {
  type: string;
  data: {};
  text: string;
}

@Component({
  components: {
    CharInfo
  }
})
export default class GameLookupChar extends Vue {
  @Prop() entity!: any;

  doAction(char, code) {
    // Another band-aid, until we can include 'keywords' as
    // a player resource attribute
    let char_keyword;
    if (char.key.split(".")[0] === "player") {
      char_keyword = char.name;
    } else {
      char_keyword = char.keywords.split(" ")[0];
    }

    // Temporary band-aid until we normalize on the backend
    // target: string vs target: { key: string }
    const data = {};
    if (code === "enquire" || code === "complete") {
      data["target"] = char.key;
    } else {
      data["target"] = { key: char.key };
    }

    let payload: Payload = {
      type: `cmd.${code}`,
      data: data,
      text: `${code} ${char_keyword}`
    };
    this.$store.dispatch("game/cmd_structured", payload);
    this.$store.commit("game/lookup_clear");
    this.$store.commit("ui/modal_clear");
  }

  get char() {
    return this.entity;
  }

  get actionsData() {
    if (!this.entity.actions) {
      return {};
    }

    let actions: {}[] = [],
      ACTIONS_COUNT = 3,
      actionsPriority = [
        // higher the better
        { action: "complete", label: "COMPLETE" },
        { action: "follow", label: "FOLLOW" },
        { action: "group", label: "GROUP" },
        { action: "list", label: "LIST" },
        { action: "offer", label: "OFFER" },
        { action: "enquire", label: "ENQUIRE" },
        { action: "kill", label: "KILL" }
      ];

    for (let action of actionsPriority) {
      if (this.entity.actions[action.action]) {
        // If a completion action is provided, replace the complete
        // entry with it.
        if (
          action.action == "complete" &&
          this.entity.actions.completion_action
        ) {
          var completion_action = this.entity.actions.completion_action;
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
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>