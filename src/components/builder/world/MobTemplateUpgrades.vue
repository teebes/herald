<template>
  <div id="mob-upgrades">
    <div class="upgrades-title">
      <h3>UPGRADES</h3>

      <div class="checkbox">
        <input
          type="checkbox"
          id="field-is_upgrader"
          :checked="template.is_upgrader"
          @change="onUpdateIsUpgrader"
        />
        <label for="field-is_Upgrader">Is Upgrader</label>
      </div>
    </div>

    <div class="upgrader_config">
      <div class="panel" v-if="template.is_upgrader">
        <p>This mob exposes the 'upgrade' command to players, which allows them to attempt to upgrade their equipment.</p>
        <p>This crafter will charge {{ template.upgrade_cost_multiplier }}x the standard upgrade price, and will succeed {{ template.upgrade_success_chance }}% of the time.</p>
        <p v-if="template.upgrade_success_cmd">Upon successfully upgrading an item, this mob will run the command:  "{{ template.upgrade_success_cmd }}".</p>
        <p v-if="template.upgrade_failure_cmd">Upon failing to upgrade an item, this mob will run the command:  "{{ template.upgrade_failure_cmd }}".</p>
        <div>
          <button class="btn-small" @click="editUpgradeOptions">EDIT</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { FormElement } from "@/core/forms.ts";

const store = useStore();

const template = computed(() => store.state.builder.worlds.mob_template);

const onUpdateIsUpgrader = (event: Event) => {
  store.dispatch("builder/worlds/mob_template_save", {
    is_upgrader: (event.target as HTMLInputElement).checked
  });
};

const editUpgradeOptions = () => {
  const upgrade_cost_multiplier: FormElement = {
    attr: "upgrade_cost_multiplier",
    label: "Upgrade Cost Multiplier",
    help: `Multiplier on how much the upgrader charges for their services compared to the standard upgrade cost.`
  };
  const upgrade_success_chance: FormElement = {
    attr: "upgrade_success_chance",
    label: "Success Chance",
    help: `The percent chance that the upgrade will be successful.`
  };
  const upgrade_success_cmd: FormElement = {
    attr: "upgrade_success_cmd",
    label: "Success Command",
    help: "Command to run on successful upgrade by the upgrader."
  }
  const upgrade_failure_cmd: FormElement = {
    attr: "upgrade_failure_cmd",
    label: "Failure command",
    help: "Command to run on upgrade failure by the upgrader."
  }
  const schema = [upgrade_cost_multiplier, upgrade_success_chance, upgrade_success_cmd, upgrade_failure_cmd];
  const modal = {
    title: `Upgrade Config`,
    data: template.value,
    schema: schema,
    action: "builder/worlds/mob_template_save"
  };
  store.commit("ui/modal/open_form", modal);
};
</script>

<style lang='scss'>
#mob-upgrades {
  .upgrades-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .checkbox {
      display: inline-block;
      margin-left: 0px;
      margin-bottom: 8px;
      position: relative;
      top: -1px;
    }
  }
}
</style>