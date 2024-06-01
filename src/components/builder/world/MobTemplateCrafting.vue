<template>
  <div id="mob-crafter">
    <div class="crafting-title">
      <h3>CRAFTING</h3>

      <div class="checkbox">
        <input
          type="checkbox"
          id="field-is_crafter"
          :checked="template.is_crafter"
          @change="onUpdateIsCrafter"
        />
        <label for="field-is_crafter">Is Crafter</label>
      </div>
    </div>

    <div class="random-drops">
      <div class="panel" v-if="template.is_crafter">
        <p>This mob exposes the 'craft' command to players, optionally taking in the argument of which slot they want crafted.</p>
        <p>This crafter will charge {{ template.craft_multiplier }}x what a merchant would, and will craft an enchanted item {{ template.craft_enchanted }}% of the time.</p>
        <div>
          <button class="btn-small" @click="editCraftingOptions">EDIT</button>
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

const onUpdateIsCrafter = (event: Event) => {
  store.dispatch("builder/worlds/mob_template_save", {
    is_crafter: (event.target as HTMLInputElement).checked
  });
};

const editCraftingOptions = () => {
  const cost_multiplier: FormElement = {
    attr: "craft_multiplier",
    label: "Cost Multiplier",
    help: `How much the crafter charges to make this item compared to what a merchant would charge.`
  };
  const craft_enchanted: FormElement = {
    attr: "craft_enchanted",
    label: "Chance to Craft an Enchanted Item"
  };
  const schema = [cost_multiplier, craft_enchanted];
  const modal = {
    title: `Crafting Config`,
    data: template.value,
    schema: schema,
    action: "builder/worlds/mob_template_save"
  };
  store.commit("ui/modal/open_form", modal);
};
</script>

<style lang='scss'>
#mob-crafter {
  .crafting-title {
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