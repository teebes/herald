<template>
  <div class="completion">
    <h3>COMPLETION</h3>

    <div v-if="completion_cmds.length">
      <div>
        Commands executed on completion:
        <ul class="list">
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
      class="mt-4"
    >Warning: quest has no way to be completed. Make the completion command available, define completion triggers or a completion action.</div>
    <div v-else class="mt-4">
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
        <strong class='color-secondary'>{{ quest.completion_action }}</strong> command.
      </div>

      <div v-if="quest.complete_silently">Quest completes silently.</div>

      <div
        v-if="quest.completion_despawn"
      >When quest completes, mob will despawn for {{ quest.completion_despawn }} seconds.</div>
    </div>

    <button class="btn-thin" @click="editCompletion">EDIT</button>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { FormElement, CONDITIONS } from "@/core/forms";

const store = useStore();

const quest = computed(() => store.state.builder.zones.quest);
const completion_cmds = computed(() => quest.value.completion_cmds ? quest.value.completion_cmds.split("\n") : []);

const editCompletion = () => {
  const completion_cmds: FormElement = {
    attr: "completion_cmds",
    label: "Completion Commands",
    widget: "textarea",
    help: `Enter the commands that the mob will execute when the quest completes, one per line.
          <br/><br/>
          The commands should be exactly as a mob would execute them, so they should almost always start with either 'say' or 'emote'`
  };

  const completion_cmd_available: FormElement = {
    attr: "completion_cmd_available",
    label: "Completion Command is Available",
    widget: "checkbox"
  };

  const completion_keywords: FormElement = {
    attr: "completion_keywords",
    label: "Completion Triggers",
    widget: "text",
    help: `Keywords that can be said in a room by a player wanting to complete this quest.`
  };

  const completion_despawn: FormElement = {
    attr: "completion_despawn",
    label: "Despawn on Completion for",
    widget: "text",
    help: `If set to a positive integer, the quest mob will disappear for the specified amount of time on completion of this quest.`
  };

  const complete_silently: FormElement = {
    attr: "complete_silently",
    label: "Complete Silently",
    widget: "checkbox",
    help: `If checked, the user will not receiving a message saying they completed a quest.`
  };

  const completion_action: FormElement = {
    attr: "completion_action",
    label: "Completion Action",
    help: `Enter one or more commands (separated by 'or') that a player can execute to complete this quest, in addition to complete.`
  };

  const completion_conditions: FormElement = {
    ...CONDITIONS,
    attr: "completion_conditions",
    label: "Completion Conditions",
  };

  const modal = {
    data: quest.value,
    schema: [
      completion_cmds,
      completion_cmd_available,
      completion_keywords,
      completion_despawn,
      complete_silently,
      completion_action,
      completion_conditions
    ],
    action: "builder/zones/quest_save"
  };
  store.commit("ui/modal/open_form", modal);
};
</script>