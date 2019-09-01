<template>
  <div class="loader-rule loader-rule-display" v-if="!edit_mode">
    <div class="rule-order"># {{ order }}</div>
    <div class="load-into">
      <div class="load-template">
        <div class="load">
          <span v-if="target_type == 'rule'">Apply</span>
          <span v-else>Load {{ num_copies }}x</span>
        </div>
        <div class="template">
          <router-link class="template" :to="template_link">{{ rule.template.name }}</router-link>
        </div>
      </div>
      <div class="into-target">
        <div class="into">
          <span v-if="target_type == 'rule'">To</span>
          <span v-else>Into</span>
        </div>
        <div class="target">
          <div
            v-if="target_type == 'rule' && target_rule"
          >{{ target_rule.template.name }} - from rule # {{ target_rule.order }}</div>
          <router-link
            v-else-if="rule.target"
            class="target"
            :to="target_link"
          >{{ rule.target.name }}</router-link>
        </div>
      </div>
    </div>
    <div class="actions">
      <div>
        <button class="btn-thin" @click="edit">EDIT</button>
      </div>
      <div>
        <button class="btn-thin" @click="remove">DELETE</button>
      </div>
    </div>
  </div>

  <div class="loader-rule loader-rule-edit" v-else>
    <div class="num-copies">
      <FormField :elementSchema="num_copies_schema" v-model="num_copies" :formErrors="formErrors" />
    </div>

    <div class="template-and-target-selections">
      <div class="template_type">
        <FormField
          :elementSchema="template_type_choice_schema"
          v-model="template_type"
          :formErrors="formErrors"
        />
      </div>

      <div class="target_type">
        <FormField
          :elementSchema="target_type_choice_schema"
          v-model="target_type"
          :formErrors="formErrors"
          :readonly="template_type == 'transformationtemplate'"
        />
      </div>
    </div>

    <div class="template-and-target-references">
      <div class="template">
        <FormField
          :elementSchema="template_schema"
          v-model="template_data"
          :formErrors="formErrors"
        />
      </div>

      <div class="target">
        <div v-if="target_type == 'zone'">Into a random room in {{ $store.state.builder.zone.name }}</div>
        <FormField
          v-else
          :elementSchema="target_schema"
          v-model="target_data"
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ReferenceField from "@/components/forms/ReferenceField.vue";
import FormField from "@/components/forms/FormField.vue";
import {
  BUILDER_MOB_TEMPLATE_DETAILS,
  BUILDER_ROOM_INDEX,
  BUILDER_ITEM_TEMPLATE_DETAILS,
  BUILDER_TRANSFORMATION_DETAIL,
  BUILDER_ZONE_PATH_DETAILS
} from "@/router";
import { Entity, Rule } from "@/core/interfaces.ts";
import { FormElement, BUILDER_FORMS } from "@/core/forms.ts";
import { BUILDER_ACTIONS } from "@/constants";
import axios from "axios";

@Component({
  components: {
    ReferenceField,
    FormField
  }
})
export default class LoaderRule extends Vue {
  @Prop() rule!: any;
  // Passing the collection as well so we can do reference lookings
  // when rules target other rules
  @Prop() rules!: Rule[];
  @Prop({ default: false }) new_rule!: boolean;

  // Edit data
  edit_mode: boolean = false;
  order: number = 1;
  num_copies: number = 1;
  template_type: string = "mobtemplate";
  template_data: Entity | null = null;
  target_type: string = "zone";
  target_data: Entity | null = null;
  formErrors: {} = {};

  constructor() {
    super();
    if (this.new_rule) {
      this.edit_mode = true;
      if (this.rules.length === 0) this.order = 1;
      else this.order = this.rules[this.rules.length - 1].order + 1;
      this.num_copies = 1;
      // Since we know the default is a zone, set target_data to the zone
      this.target_data = this.$store.state.builder.zone;
    } else if (this.rule) {
      this.num_copies = this.rule.num_copies;
      this.order = this.rule.order;
      if (this.rule.template) {
        this.template_data = this.rule.template;
        if (this.template_data && this.template_data.model_type)
          this.template_type = this.template_data.model_type;
      }
      if (this.rule.target) {
        this.target_data = this.rule.target;
        if (this.target_data && this.target_data.model_type)
          this.target_type = this.target_data.model_type;
      }
    }
  }

  @Watch("template_type")
  changeTemplateType(new_template_type) {
    if (this.rule && new_template_type == this.rule.template.model_type) {
      this.template_data = this.rule.template;
    } else {
      this.template_data = null;
    }

    if (new_template_type == "transformationtemplate") {
      this.target_type = "rule";
    }
  }

  @Watch("target_type")
  changeTargetType(new_target_type) {
    if (
      this.rule &&
      this.rule.target &&
      new_target_type == this.rule.target.model_type
    ) {
      this.target_data = this.rule.target;
    } else {
      // If it's a room and the target is null, auto-fill in the contextual
      // room
      if (new_target_type === "room") {
        this.target_data = this.$store.state.builder.room;
      } else {
        this.target_data = null;
      }
    }
  }

  async save() {
    const save_data = {
      num_copies: this.num_copies,
      template: this.template_data,
      target: this.target_data
    };

    if (!this.target_data) {
      save_data.target = this.$store.state.builder.zone;
    }

    const world_id = this.$route.params.world_id;
    const loader_id = this.$route.params.loader_id;
    if (this.new_rule) {
      const resp = await axios.post(
        `builder/worlds/${world_id}/loaders/${loader_id}/rules/`,
        save_data
      );
      this.$emit("added", resp.data);
    } else {
      const rule_id = this.rule.id;
      const resp = await axios.put(
        `builder/worlds/${world_id}/loaders/${loader_id}/rules/${rule_id}/`,
        save_data
      );
      this.edit_mode = false;
      this.$emit("input", resp.data);
    }
  }

  BUILDER_MOB_TEMPLATE_DETAILS = BUILDER_MOB_TEMPLATE_DETAILS;

  get num_copies_schema() {
    return {
      attr: "num_copies",
      label: "Number of Copies"
    };
  }

  get template_link() {
    if (!this.rule) return null;
    const world_id = this.$route.params.world_id;
    if (this.rule.template.model_type == "mobtemplate") {
      return {
        name: BUILDER_MOB_TEMPLATE_DETAILS,
        params: {
          world_id: world_id,
          mob_template_id: this.rule.template.id
        }
      };
    } else if (this.rule.template.model_type == "itemtemplate") {
      return {
        name: BUILDER_ITEM_TEMPLATE_DETAILS,
        params: {
          world_id: world_id,
          item_template_id: this.rule.template.id
        }
      };
    } else if (this.rule.template.model_type == "transformationtemplate") {
      return {
        name: BUILDER_TRANSFORMATION_DETAIL,
        params: {
          world_id: world_id,
          transformation_id: this.rule.template.id
        }
      };
    }
  }

  get template_schema() {
    let template_schema: FormElement =
      BUILDER_FORMS.LOADER_RULE.TEMPLATE_SCHEMAS[this.template_type];
    return template_schema;
  }

  get target_schema() {
    let target_schema: FormElement =
      BUILDER_FORMS.LOADER_RULE.TARGET_SCHEMAS[this.target_type];
    return target_schema;
  }

  get template_type_choice_schema() {
    const template_type_schema = BUILDER_FORMS.LOADER_RULE.TEMPLATE_TYPE_SCHEMA;
    return template_type_schema;
  }

  get target_link() {
    if (!this.rule || !this.rule.target) return null;
    const world_id = this.$route.params.world_id;
    if (this.rule.target.model_type == "room") {
      return {
        name: BUILDER_ROOM_INDEX,
        params: {
          world_id: world_id,
          room_id: this.rule.target.id
        }
      };
    } else if (this.rule.target.model_type == "path") {
      return {
        name: BUILDER_ZONE_PATH_DETAILS,
        params: {
          world_id: world_id,
          path_id: this.rule.target.id
        }
      };
    } else if (this.rule.target.model_type == "zone") {
      return {
        name: BUILDER_ZONE_PATH_DETAILS,
        params: {
          world_id: world_id,

          zone_id: this.rule.target.id
        }
      };
    }
  }

  get target_rule() {
    /*
      If the rule targets another rule, we'll want information about the
      target rule (such as its number).
    */
    const rule = this.rule;
    if (!rule) return;

    let rule_data: Rule | undefined | null = null;
    if (this.target_type == "rule") {
      rule_data = this.rules.find(r => r.id == rule.target.id);
    }
    return rule_data;
  }

  get target_type_choice_schema() {
    const target_type_schema = BUILDER_FORMS.LOADER_RULE.TARGET_TYPE_SCHEMA;
    return target_type_schema;
  }

  edit() {
    this.edit_mode = true;
  }

  async remove() {
    const resp = await axios.delete(
      `builder/worlds/${this.$route.params.world_id}/loaders/${this.$route.params.loader_id}/rules/${this.rule.id}`
    );
    this.$emit("remove", this.rule);
  }

  cancel() {
    if (this.new_rule) {
      this.$emit("cancel");
    } else {
      this.edit_mode = false;
    }
  }
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
.loader-rule {
  //border-top: 1px solid $color-text-hex-60;
  padding: 20px 5px;

  &.loader-rule-display {
    display: flex;

    .rule-order {
      width: 40px;
      white-space: nowrap;
    }

    .load-into {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      .load,
      .into {
        width: 70px;
      }
      .load-template,
      .into-target {
        display: flex;
        flex-grow: 1;
      }
      .template,
      .target {
        a {
          color: $color-secondary;
        }
      }
    }
  }

  &.loader-rule-edit {
    .num-copies {
      input {
        width: 50px;
      }
    }

    .template-and-target-selections,
    .template-and-target-references {
      display: flex;
      > div {
        flex: 1;
        &:not(:last-child) {
          margin-right: 10px;
        }
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }

    .actions {
      margin-top: 15px;
    }
  }
}
</style>
