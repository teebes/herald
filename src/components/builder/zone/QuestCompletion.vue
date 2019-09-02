<template>
  <div class="completion">
    <h3>COMPLETION</h3>

    <div v-if="completion_cmds.length">
      <div>
        Commands executed on completion:
        <ul>
          <li v-for="completion_cmd in completion_cmds" :key="completion_cmd">{{ completion_cmd }}</li>
        </ul>
      </div>
    </div>
    <div
      v-else
      class="help-text"
    >Completion commands are executed by the quest mob when the player completes the quest.</div>

    <div
      v-if="!quest.completion_cmd_available && !quest.completion_keywords && !quest.completion_action"
    >Warning: quest has no way to be completed. Make the completion command available, define completion triggers or a completion action.</div>
    <div v-else>
      <div v-if="quest.completion_cmd_available">
        Quest can be completed with the
        <strong>complete</strong> command.
      </div>

      <div v-if="quest.completion_keywords">
        Quest can be completed by saying keywords:
        <strong>{{ quest.completion_keywords }}</strong>.
      </div>

      <div v-if="quest.completion_action">
        Quest can be completed with the
        <strong>{{ quest.completion_action }}</strong> command.
      </div>

      <div v-if="quest.complete_silently">Quest completes silently.</div>

      <div
        v-if="quest.completion_despawn"
      >When quest completes, mob will despawn for {{ quest.completion_despawn }} seconds.</div>
    </div>

    <button class="btn-thin" @click="editCompletion">EDIT</button>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { BUILDER_ACTIONS, UI_MUTATIONS } from "@/constants";
import { FormElement } from "@/core/forms";

@Component
export default class extends Vue {
  get quest() {
    return this.$store.state.builder.zones.quest;
  }

  // Completion

  get completion_cmds() {
    return this.quest.completion_cmds
      ? this.quest.completion_cmds.split("\n")
      : [];
  }

  editCompletion() {
    const completion_cmds: FormElement = {
      attr: "completion_cmds",
      label: "Completion Commands",
      widget: "textarea"
    };

    const completion_cmd_available: FormElement = {
      attr: "completion_cmd_available",
      label: "Completion Command is Available",
      widget: "checkbox"
    };

    const completion_keywords: FormElement = {
      attr: "completion_keywords",
      label: "Completion Triggers",
      widget: "text"
    };

    const completion_despawn: FormElement = {
      attr: "completion_despawn",
      label: "Despawn on Completion for",
      widget: "text"
    };

    const complete_silently: FormElement = {
      attr: "complete_silently",
      label: "Complete Silently",
      widget: "checkbox"
    };

    const completion_action: FormElement = {
      attr: "completion_action",
      label: "Completion Action"
    };

    const modal = {
      data: this.quest,
      schema: [
        completion_cmds,
        completion_cmd_available,
        completion_keywords,
        completion_despawn,
        complete_silently,
        completion_action
      ],
      action: "builder/zones/quest_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>