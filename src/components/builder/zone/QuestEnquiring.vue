<template>
  <div class="enquiring">
    <h3>ENQUIRING</h3>

    <div v-if="enquire_cmds.length">
      <div>
        Messages displayed on enquire:
        <ul>
          <li v-for="enquire_cmd in enquire_cmds" :key="enquire_cmd">{{ enquire_cmd }}</li>
        </ul>
      </div>

      <div
        v-if="enquire_cmds.length && !quest.enquire_cmd_available && !quest.enquire_keywords"
      >This configuration is invalid. The enquire command is not available, and there are no enquire triggers.</div>
      <div v-else>
        <div v-if="quest.enquire_cmd_available">Enquire command is available.</div>
        <div
          v-if="quest.enquire_keywords"
        >Enquire is triggered by saying keywords: {{ quest.enquire_keywords }}</div>
      </div>
    </div>

    <div v-else class="help-text">
      The enquiring commands instruct a player what they need to do to complete the quest.
      In order to use this feature, define enquire commands.
    </div>

    <button class="btn-thin" @click="editEnquiring">EDIT</button>
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

  // Enquire

  get enquire_cmds() {
    return this.quest.enquire_cmds ? this.quest.enquire_cmds.split("\n") : [];
  }

  editEnquiring() {
    const enquire_cmds: FormElement = {
      attr: "enquire_cmds",
      label: "Enquire Commands",
      widget: "textarea"
    };

    const enquire_cmd_available: FormElement = {
      attr: "enquire_cmd_available",
      label: "Enquire Command is Available",
      widget: "checkbox"
    };

    const enquire_keywords: FormElement = {
      attr: "enquire_keywords",
      label: "Enquire Triggers"
    };

    const modal = {
      data: this.quest,
      schema: [enquire_cmds, enquire_cmd_available, enquire_keywords],
      action: "builder/zones/quest_save"
    };

    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>
