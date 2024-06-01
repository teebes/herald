<template>
  <div class="enquiring">
    <h3>ENQUIRING</h3>

    <div v-if="enquire_cmds.length">
      <div>
        Messages displayed on enquire:
        <ul class='list'>
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

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { FormElement } from "@/core/forms";

const store = useStore();

const quest = computed(() => store.state.builder.zones.quest);
const enquire_cmds = computed(() => quest.value.enquire_cmds ? quest.value.enquire_cmds.split("\n") : []);

const editEnquiring = () => {
  const enquire_cmds: FormElement = {
    attr: "enquire_cmds",
    label: "Enquire Commands",
    widget: "textarea",
    help: `Enter the commands that the mob will execute when the player enquire, one per line.
          <br/><br/>
          The commands should be exactly as a mob would execute them, so they should almost always start with either 'say' or 'emote'`
  };

  const enquire_cmd_available: FormElement = {
    attr: "enquire_cmd_available",
    label: "Enquire Command is Available",
    widget: "checkbox"
  };

  const enquire_keywords: FormElement = {
    attr: "enquire_keywords",
    label: "Enquire Triggers",
    help: `Keywords that can be said in a room by a player wanting to complete this quest.`,
  };

  const modal = {
    data: quest.value,
    schema: [enquire_cmds, enquire_cmd_available, enquire_keywords],
    action: "builder/zones/quest_save"
  };

  store.commit("ui/modal/open_form", modal);
};
</script>
