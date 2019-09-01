<template>
  <div class="entrance-messages">
    <div class="enquire-entrance">
      <h3>ENQUIRE ENTRANCE COMMANDS</h3>

      <div v-if="entrance_cmds.length">
        <ul>
          <li
            v-for="entrance_cmd in entrance_cmds"
            :key="entrance_cmd"
            class="entrance-cmd"
          >{{ entrance_cmd }}</li>
        </ul>

        <div>Wait {{ quest.repeat_entrance_cmd_after }} seconds before repeating entrance commands.</div>
      </div>

      <div v-else class="help-text">
        Entrance commands are executed by the mob when a player eligible for the
        quest enters the room.
      </div>
      <button class="btn-thin" @click="editEntranceCmds">EDIT</button>
    </div>

    <div class="completion-entrance">
      <h3>COMPLETION ENTRANCE COMMANDS</h3>

      <div v-if="completion_entrance_cmds.length">
        <div>
          Messages displayed when entering the room and the :
          <ul>
            <li
              v-for="completion_entrance_cmd in completion_entrance_cmds"
              :key="completion_entrance_cmd"
            >{{ completion_entrance_cmd }}</li>
          </ul>
        </div>
        <div>Completion entrance commands will wait {{ quest.repeat_completion_entrance_cmds_after }} seconds before triggering again.</div>
      </div>
      <div
        v-else
        class="help-text"
      >Completion entrance commands are executed by the quest mob when a player who has completed the required objectives enters the room.</div>

      <button class="btn-thin" @click="editCompletionEntrance">EDIT</button>
    </div>
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

  get completion_entrance_cmds() {
    return this.quest.completion_entrance_cmds
      ? this.quest.completion_entrance_cmds.split("\n")
      : [];
  }

  editCompletionEntrance() {
    const completion_entrance_cmds: FormElement = {
      attr: "completion_entrance_cmds",
      label: "Completion Entrance Commands",
      widget: "textarea"
    };

    const repeat_completion_entrance_cmds_after: FormElement = {
      attr: "repeat_completion_entrance_cmds_after",
      label: "Wait before repeating completion entrance commands",
      widget: "text"
    };

    const modal = {
      data: this.quest,
      schema: [completion_entrance_cmds, repeat_completion_entrance_cmds_after],
      action: "builder/zones/quest_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  // Entrance

  get entrance_cmds() {
    return this.quest.entrance_cmds ? this.quest.entrance_cmds.split("\n") : [];
  }

  editEntranceCmds() {
    const entrance_cmds_schema: FormElement = {
      attr: "entrance_cmds",
      label: "Entrance Commands",
      widget: "textarea"
    };

    const repeat_entrance_cmd_after_schema: FormElement = {
      attr: "repeat_entrance_cmd_after",
      label: "Repeat entrance command after",
      widget: "text"
    };

    const modal = {
      //title: `Entrance Commands`,
      data: this.quest,
      schema: [entrance_cmds_schema, repeat_entrance_cmd_after_schema],
      action: "builder/zones/quest_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>