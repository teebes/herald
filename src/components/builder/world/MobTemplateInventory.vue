<template>
  <div id="mob-inventory">
    <div class="inventory-title">
      <h3>LOAD ITEMS</h3>

      <div class="checkbox">
        <input
          type="checkbox"
          id="field-drops_random_items"
          :checked="template.drops_random_items"
          @change="onUpdateDropsRandomItems"
        />
        <label for="field-drops_random_items">Loads Random Items</label>
      </div>
    </div>

    <div class="random-drops">
      <div class="panel" v-if="template.drops_random_items">
        <div>Load {{ template.num_items }} items {{ template.load_specification }}</div>

        <div>{{ template.chance_imbued }} % chance to drop, with a {{ template.chance_enchanted }} % chance to be enchanted</div>

        <div v-if="template.load_specification">{{ template.load_specification}}</div>

        <div>
          <button class="btn-small" @click="editRandomDrops">EDIT</button>
        </div>
      </div>
    </div>

    <InColumnList
      class="persistent-inventory"
      :endpoint="mob_inventory_endpoint"
      :schema="mob_inventory_schema"
      title="Inventory Item"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import InColumnList from "@/components/incolumnlist/List.vue";
import Element from "@/components/incolumnlist/Element.vue";
import { BUILDER_FORMS } from "@/core/forms.ts";
import {
  BUILDER_ACTIONS,
  BUILDER_MUTATIONS,
  UI_MUTATIONS,
  UI_MODALS
} from "@/constants";

@Component({
  components: {
    InColumnList
  }
})
export default class extends Vue {
  get template() {
    return this.$store.state.builder.worlds.mob_template;
  }

  get mob_inventory_endpoint() {
    const world_id = this.$route.params.world_id;
    const mob_template_id = this.$route.params.mob_template_id;
    return `builder/worlds/${world_id}/mobtemplates/${mob_template_id}/inventory/`;
  }

  get mob_inventory_schema() {
    return BUILDER_FORMS.MOB_TEMPLATE_INVENTORY;
  }

  onUpdateDropsRandomItems(event) {
    this.$store.dispatch("builder/worlds/mob_template_save", {
      drops_random_items: event.target.checked
    });
  }

  editRandomDrops() {
    const modal = {
      title: `random drops`,
      data: this.template,
      schema: BUILDER_FORMS.MOB_TEMPLATE_RANDOM_DROPS,
      action: "builder/worlds/mob_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>

<style lang='scss'>
#mob-inventory {
  .inventory-title {
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

  .random-drops {
    .checkbox {
      margin-bottom: 10px;
    }
    button {
      margin-top: 10px;
    }
    .panel {
      margin-bottom: 10px;
    }
  }
}
</style>