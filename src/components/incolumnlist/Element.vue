<template>
  <!-- Display Mode -->
  <div
    class="panel display"
    v-if="!edit_mode"
    :class="{ selected: selected && selected(element) }"
    :element="element.key"
    :selected_key="selected"
  >
    <template v-for="fieldSchema in schema">
      <div :key="fieldSchema.attr" v-if="element[fieldSchema.attr]" class='mb-1'>
        <div
          v-if="fieldSchema.references && element[fieldSchema.attr]"
        >{{ fieldSchema.label }}: {{ element[fieldSchema.attr].name }}</div>
        <div v-else-if="splitLines(element[fieldSchema.attr]).length > 1">
            {{ fieldSchema.label }}:<br/> 
            <div class='indented'>
              <div v-for="(line, index) in splitLines(element[fieldSchema.attr])" :key="index">{{ line }}</div>
            </div>
        </div>
        <div v-else>
          {{ fieldSchema.label }}: {{ element[fieldSchema.attr] }}
        </div>
      </div>
    </template>
    <div class="reaction-actions">
      <button class="btn-thin" @click="edit" v-if="editable">EDIT</button>
      <button class="btn-thin" @click="remove">DELETE</button>
    </div>
  </div>

  <!-- Edit Mode -->
  <div v-else>
    <div class="panel panel-edit">
      <template v-for="fieldSchema in schema">
        <FormField
          :key="fieldSchema.attr"
          :value="edit_data[fieldSchema.attr]"
          :elementSchema="fieldSchema"
          :formErrors="formErrors"
          @update="onFormFieldUpdate"
        />
      </template>
      <button class="btn btn-medium" @click="save">
        <span v-if="isNew">ADD</span>
        <span v-else>SAVE</span>
      </button>
    </div>
    <div class="panel-cancel" @click="cancelEdit">cancel</div>
  </div>
</template>


<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import FormField from "@/components/forms/FormField.vue";
import axios from "axios";
import { UI_MUTATIONS } from "@/constants.ts";

@Component({
  components: {
    FormField
  }
})
export default class Element extends Vue {
  /*
    The element is in charge of editing, creating or removing an entity that is
    being manipulated.
  */

  @Prop() element!: any;
  @Prop() schema!: any;
  @Prop() endpoint!: string;
  @Prop() endpoint_filters!: {};
  @Prop() selected!: any;
  @Prop() editable!: boolean;

  @Prop({ default: false }) isNew!: boolean;

  edit_mode: boolean = this.isNew;
  edit_data: Object = {};
  formErrors: Object = {};

  constructor() {
    super();
    this.edit_data = { ...this.element };
  }

  get details_endpoint() {
    let endpoint = `${this.endpoint}${this.element.id}/`;

    let filters: string[] = [];
    if (this.endpoint_filters) {
      for (const filter_name in this.endpoint_filters) {
        const filter_value = this.endpoint_filters[filter_name];
        filters.push(`${filter_name}=${filter_value}`);
      }
      if (filters.length) endpoint += "?" + filters.join("&");
    }

    return endpoint;
  }

  get submit_data() {
    let data = {};
    for (const fieldSchema of this.schema) {
      data[fieldSchema.attr] = this.edit_data[fieldSchema.attr];
    }
    return data;
  }

  validate_data() {
    this.formErrors = {};
    for (const fieldSchema of this.schema) {
      if (fieldSchema.required && !this.edit_data[fieldSchema.attr]) {
        this.formErrors[fieldSchema.attr] = "This field is required";
      }
    }
    if (this.formErrors) return this.formErrors;
    return true;
  }

  edit() {
    this.edit_mode = true;
    this.edit_data = { ...this.element };
  }

  cancelEdit() {
    this.edit_mode = false;
    this.$emit("cancel");
  }

  onFormFieldUpdate(attr, value) {
    if (this.schema) this.edit_data[attr] = value;
  }

  splitLines(element) {
    if (typeof element === "string") {
      return element.split("\n");
    }
    return [];
  }

  async save() {
    if (!this.validate_data()) {
      return;
    }

    if (this.isNew) return this.create();

    try {
      const resp = await axios.put(this.details_endpoint, this.submit_data);
      this.$emit("update", resp.data);
      this.edit_mode = false;
    } catch (e) {
      if (e.response.status == 400) {
        this.formErrors = e.response.data;
        this.$store.commit(
          UI_MUTATIONS.SET_NOTIFICATION_ERROR,
          "Error saving form"
        );
      }
    }
  }

  async create() {
    const world_id = this.$route.params.world_id;
    const mob_template_id = this.$route.params.mob_template_id;
    try {
      const resp = await axios.post(this.endpoint, this.submit_data);
      this.$emit("create", resp.data);
    } catch (e) {
      if (e.response.status == 400) {
        this.formErrors = e.response.data;
        this.$store.commit(
          UI_MUTATIONS.SET_NOTIFICATION_ERROR,
          "Error saving form"
        );
      }
    }
  }

  async remove() {
    if (!confirm(`Confirm deletion?`)) return;
    await axios.delete(this.details_endpoint);
    this.$emit("remove");
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";

.panel {
  &:not(.panel-edit) {
    margin-bottom: 10px;
  }
}

.panel-cancel {
  color: $color-text-hex-70;
  margin-bottom: 10px;
  width: 100%;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
}

.reaction-actions {
  button {
    padding: 0;
    margin: 10px 10px 0 0;
  }
}
</style>
