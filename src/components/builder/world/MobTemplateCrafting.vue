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
        <p>This crafter will charge {{ template.craft_multiplier }}x what a merchant would, and will craft an enchanted item {{ template.craft_enchanted }}% of the time.
        <div>
          <button class="btn-small" @click="editCraftingOptions">EDIT</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import InColumnList from "@/components/incolumnlist/List.vue";
import Element from "@/components/incolumnlist/Element.vue";
import { FormElement } from "@/core/forms.ts";

@Component({
  components: {
    InColumnList
  }
})
export default class extends Vue {
  get template() {
    return this.$store.state.builder.worlds.mob_template;
  }

  onUpdateIsCrafter(event) {
    this.$store.dispatch("builder/worlds/mob_template_save", {
      is_crafter: event.target.checked
    });
  }

  editCraftingOptions() {
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
      data: this.template,
      schema: schema,
      action: "builder/worlds/mob_template_save"
    };
    this.$store.commit("ui/modal_set", modal);
  }
}
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

  // .random-drops {
  //   .checkbox {
  //     margin-bottom: 10px;
  //   }
  //   button {
  //     margin-top: 10px;
  //   }
  //   .panel {
  //     margin-bottom: 10px;
  //   }
  // }
}
</style>