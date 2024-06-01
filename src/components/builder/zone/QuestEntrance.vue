<template>
  <div class="entrance-messages">
    <div class="enquire-entrance">
      <h3>ENQUIRE ENTRANCE COMMANDS</h3>

      <div v-if="entrance_cmds.length">
        <ul class='list'>
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
          Messages displayed when entering the room and the quest can be completed:
          <ul class='list'>
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

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { FormElement } from "@/core/forms";

const store = useStore();

const quest = computed(() => store.state.builder.zones.quest);
const entrance_cmds = computed(() => quest.value.entrance_cmds ? quest.value.entrance_cmds.split("\n") : []);

const editCompletionEntrance = () => {
  const completion_entrance_cmds: FormElement = {
    attr: "completion_entrance_cmds",
    label: "Completion Entrance Commands",
    widget: "textarea",
    help: `Enter the commands that the mob will execute when the player enters its room, one per line.
          <br/><br/>
          The commands should be exactly as a mob would execute them, so they should almost always start with either 'say' or 'emote'`
  };

  const repeat_completion_entrance_cmds_after: FormElement = {
    attr: "repeat_completion_entrance_cmds_after",
    label: "Wait before repeating completion entrance commands",
    widget: "text",
    help: `When a player enters the room, a mob will issue completion entrance commands as long as it has been longer than the specified number of seconds since the last time they've reacted to someone's entrance.`
  };

  const modal = {
    data: quest.value,
    schema: [completion_entrance_cmds, repeat_completion_entrance_cmds_after],
    action: "builder/zones/quest_save"
  };
  store.commit("ui/modal/open_form", modal);
};

  // Entrance
const completion_entrance_cmds = computed(() => quest.value.completion_entrance_cmds ? quest.value.completion_entrance_cmds.split("\n") : []);

const editEntranceCmds = () => {
  const entrance_cmds: FormElement = {
    attr: "entrance_cmds",
    label: "Entrance Commands",
    widget: "textarea",
    help: `Enter the commands that the mob will execute when the player enters its room, one per line.
          <br/><br/>
          The commands should be exactly as a mob would execute them, so they should almost always start with either 'say' or 'emote'`
  };

  const repeat_entrance_cmd_after: FormElement = {
    attr: "repeat_entrance_cmd_after",
    label: "Wait before repeating entrance commands",
    widget: "text",
    help: `When a player enters the room, a mob will issue entrance commands as long as it has been longer than the specified number of seconds since the last time they've reacted to someone's entrance.`
  };

  const modal = {
    data: quest.value,
    schema: [entrance_cmds, repeat_entrance_cmd_after],
    action: "builder/zones/quest_save"
  };
  store.commit("ui/modal/open_form", modal);
};
</script>