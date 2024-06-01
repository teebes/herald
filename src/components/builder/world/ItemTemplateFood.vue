<template>
  <div>
    <h3>FOOD CONFIGURATION</h3>

    <div
      class="food-info"
    >Item restores {{ item_template.food_value }} {{ item_template.food_type }}.</div>

    <div>
      <button class="btn-thin" @click="editFood">EDIT FOOD</button>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { FormElement } from "@/core/forms";

const store = useStore();

const item_template = computed(() => store.state.builder.worlds.item_template);

const editFood = () => {
  const food_type: FormElement = {
    attr: "food_type",
    label: "Food Type",
    widget: "select",
    options: [
      {
        value: "health",
        label: "Health"
      },
      {
        value: "stamina",
        label: "Stamina"
      },
      {
        value: "mana",
        label: "Mana"
      }
    ]
  };
  const food_value: FormElement = {
    attr: "food_value",
    label: "Food Value"
  };
  const modal = {
    title: `Edit Food Configuration`,
    data: item_template.value,
    schema: [food_type, food_value],
    action: "builder/worlds/item_template_save"
  };
  store.commit("ui/modal/open_form", modal);
};
</script>