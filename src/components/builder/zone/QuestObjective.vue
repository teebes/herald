<template>
  <div v-if="!edit_mode" class="display-mode">
    <div v-if="objective.type == 'item'">
      Turn in {{ objective.qty }} copies of
      <router-link
        :to="get_item_link(objective.template.id)"
        class="reference-link"
      >{{ objective.template.name }}</router-link>.
    </div>

    <div v-if="objective.type == 'mob'">
      Kill {{ objective.qty }}
      <router-link
        :to="get_mob_link(objective.template.id)"
        class="reference-link"
      >{{ objective.template.name }}</router-link>.
    </div>
    <div v-if="objective.type == 'gold'">Receive {{ objective.qty }} gold.</div>
    <div v-if="objective.type == 'glory'">Receive {{ objective.qty }} glory.</div>

    <div class="actions">
      <button class="btn-thin" @click="edit">EDIT</button>
      <button class="btn-thin" @click="remove">DELETE</button>
    </div>
  </div>
  <div v-else class="edit-mode">
    <div class="objective-selection">
      <div class="objective-type-selection">
        <FormField
          :elementSchema="objective_type_selection_schema"
          v-model="objective_type"
          :formErrors="formErrors"
        />
      </div>

      <div class="objective-target">
        <FormField
          v-if="objective_type == 'item'"
          class="template"
          :elementSchema="item_template_schema"
          v-model="objective_data"
          :formErrors="formErrors"
        />

        <FormField
          v-else-if="objective_type == 'mob'"
          class="template"
          :elementSchema="mob_template_schema"
          v-model="objective_data"
          :formErrors="formErrors"
        />

        <FormField
          class="quantity"
          :elementSchema="quantity_schema"
          v-model="quantity"
          :formErrors="formErrors"
        />
      </div>
    </div>

    <div class="actions">
      <button class="btn-medium" @click="save">SAVE</button>
      <button class="btn-thin" @click="cancel">CANCEL</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import ZoneView from "@/components/builder/zone/ZoneView";
import FormField from "@/components/forms/FormField.vue";
import { Entity } from "@/core/interfaces.ts";
import { FormElement, BUILDER_FORMS } from "@/core/forms";
import {
  BUILDER_ITEM_TEMPLATE_DETAILS,
  BUILDER_MOB_TEMPLATE_DETAILS
} from "@/router";
import { BUILDER_ACTIONS } from "@/constants";

@Component({
  components: {
    FormField
  }
})
export default class extends Mixins(ZoneView) {
  /*
        Objective types:
            OBJECTIVE_TYPE_ITEM = 'item'
            OBJECTIVE_TYPE_MOB = 'mob'
            OBJECTIVE_TYPE_GOLD = 'gold'
    */

  edit_mode: boolean = false;
  objective_type: string = "gold";
  objective_data: Entity | null = null;
  formErrors: {} = {};
  quantity: number = 1;

  @Prop() new_objective!: boolean;
  @Prop() objective!: any;

  constructor() {
    super();

    if (this.objective !== undefined) {
      this.objective_type = this.objective.type;
      this.quantity = this.objective.qty;
      this.objective_data = this.objective.template;
    } else if (this.new_objective) {
      this.edit_mode = true;
    }
  }

  get_item_link(item_template_id) {
    return {
      name: BUILDER_ITEM_TEMPLATE_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        item_template_id: item_template_id
      }
    };
  }

  get_mob_link(mob_template_id) {
    return {
      name: BUILDER_MOB_TEMPLATE_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        mob_template_id: mob_template_id
      }
    };
  }

  get quantity_schema() {
    const quantity_schema: FormElement = {
      attr: "qty",
      label: "Quantity"
    };
    return quantity_schema;
  }

  get item_template_schema() {
    return BUILDER_FORMS.ITEM_TEMPLATE;
  }

  get mob_template_schema() {
    return BUILDER_FORMS.MOB_TEMPLATE;
  }

  get objective_type_selection_schema() {
    const objective_type_selection_schema: FormElement = {
      attr: "type",
      label: "Objective Type",
      widget: "select",
      options: [
        {
          value: "item",
          label: "Item Received"
        },
        {
          value: "mob",
          label: "Mob Killed"
        },
        {
          value: "gold",
          label: "Gold Received"
        },
        {
          value: "glory",
          label: "Glory Received"
        }
      ]
    };
    return objective_type_selection_schema;
  }

  edit() {
    this.edit_mode = true;
  }

  cancel() {
    if (!this.new_objective) this.edit_mode = false;
    this.$emit("cancel");
  }

  async save() {
    const save_data = {
      qty: this.quantity,
      template: this.objective_data,
      type: this.objective_type
    };
    if (this.new_objective) {
      const objective = await this.$store.dispatch(
        "builder/zones/quest_objective_create",
        save_data
      );
      this.$emit("added");
    } else {
      const objective = await this.$store.dispatch(
        "builder/zones/quest_objective_save",
        {
          objective_id: this.objective.id,
          data: save_data
        }
      );
      this.edit_mode = false;
    }
  }

  remove() {
    this.$store.dispatch(
      "builder/zones/quest_objective_delete",
      this.objective.id
    );
  }
}
</script>

<style lang='scss' scoped>
.objective-selection {
  display: flex;
  > div {
    flex: 1;
    &.quantity {
      flex: 0.2;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
}
</style>