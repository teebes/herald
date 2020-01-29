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

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { FormElement } from "@/core/forms";
import { STAFF_SIGNUPS } from "../../../router";

@Component
export default class ItemTemplateFood extends Vue {
  get item_template() {
    return this.$store.state.builder.worlds.item_template;
  }

  editFood() {
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
      data: this.item_template,
      schema: [food_type, food_value],
      action: "builder/worlds/item_template_save"
    };
    this.$store.commit("ui/modal_set", modal);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>