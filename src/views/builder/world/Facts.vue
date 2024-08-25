<template>
  <div class='w-screen'>
  <h2>{{ store.state.builder.world.name.toUpperCase() }} FACTS</h2>

  <CurrentFacts :world_id="world.id" v-if="world.is_multiplayer"/>
  <div v-else>Facts values for single player worlds are displayed in the player details page.</div>

  <EditableCollection
    class='mt-8'
    title="Fact Schedule"
    registration_name="fact_schedule"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
    :page_size="50"
  />

  </div>
</template>


<script lang='ts' setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import CurrentFacts from "@/components/builder/world/CurrentFacts.vue";
import FactSchedule from "@/components/builder/world/FactSchedule.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";


const store = useStore();
const route = useRoute();

const world = computed(() => store.state.builder.world);
const endpoint = `/builder/worlds/${route.params.world_id}/factschedules/`;
const display_component = FactSchedule;
const schema = computed(() => {
  const name: FormElement = {
    ...BUILDER_FORMS.NAME,
    default: "Unnamed Schedule",
  };

  const fact: FormElement = {
    attr: "fact",
    label: "Fact",
    help: "Name of the fact.",
  };

  const value: FormElement = {
    attr: "value",
    label: "Value",
    help:
      "Value to set the fact to. For cycle and random value selections, values should be seperated by whitespace.",
  };
  const selection: FormElement = {
    attr: "selection",
    label: "Value Selection",
    default: "default",
    options: [
      {
        value: "default",
        label: "Default",
      },
      {
        value: "cycle",
        label: "Cycle",
      },
      {
        value: "random",
        label: "Random",
      },
    ],
    help: `Which value to select for the fact if multiple are provided:<br/><br/>
        - default: select the first value<br/>
        - cycle: select the next value in the cycle<br/>
        - random: select a random value`,
  };
  const schedule: FormElement = {
    attr: "schedule",
    label: "Schedule",
    help: `When to update the fact. Either an interval of seconds or a cron entry, depending on the value of 'schedule_type'.`,
  };
  const schedule_type: FormElement = {
    attr: "schedule_type",
    label: "Schedule Type",
    default: "interval",
    options: [
      {
        value: "interval",
        label: "Interval",
      },
      {
        value: "cron",
        label: "Cron",
      },
    ],
    help: `How to interpret the 'schedule' value.<br/><br/>
      - If 'interval' is selected, fact will be updated regularly every X seconds as specified in 'schedule'.
      - If 'cron' is selected, fact will be updated based on the cron entry in 'schedule'.`,
  };

  const change_msg: FormElement = {
    attr: "change_msg",
    label: "Change Message",
    help: `Message to display when the fact is changed. Accepts the special variables {{ fact }}, {{ old_value }} and {{ new_value }} which will be substituted with the appropriate values.`,
  };

  const schema = [
    name,
    fact,
    value,
    selection,
    schedule,
    schedule_type,
    change_msg,
  ];

  return schema;
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
table.facts-table {
  border: 1px solid $color-form-border;
  td,
  th {
    padding: 5px 10px;
    border: 1px solid $color-form-border;
  }
  th {
    background: $color-background-light-border;
  }
}
</style>
