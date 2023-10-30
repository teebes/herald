<template>
  <div class="edit-entity">
    <h1 v-if="title">{{ title.toUpperCase() }}</h1>

    <slot></slot>

    <form @submit.prevent="submit" autocomplete="off">
      <div class="form-content">
        <template v-for="element in validSchema">
          <div v-if="element.children" class="form-subsection" :key="element.attr">
            <div
              class="subsection-title"
              v-if="element.row_name"
            >{{ element.row_name.toUpperCase() }}</div>
            <div class="groups" :class="element.class">
              <template v-for="child in element.children">
                <FormField
                  :formErrors="formErrors"
                  :value="formData[child.attr]"
                  :elementSchema="child"
                  :key="child.attr"
                  v-if="child.attr"
                  @update="onFormFieldUpdate"
                />
                <div v-else class="form-group" :key="element.children.indexOf(child)"></div>
              </template>
            </div>
          </div>

          <FormField
            v-else
            :key="element.attr"
            :formErrors="formErrors"
            :value="formData[element.attr]"
            :elementSchema="element"
            :readonly="element.readonly || false"
            @update="onFormFieldUpdate"
          />
        </template>
      </div>

      <div class="action-bar">
        <button class="btn-large action-cancel" type="button" @click="$emit('close')">CANCEL</button>
        <button class="btn-large action-save" @click="$emit('save')">{{ submitLabel || 'SAVE CHANGES' }}</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FormField from "@/components/forms/FormField.vue";
import { FormElement } from "@/core/interfaces.ts";
import { UI_MUTATIONS } from "@/constants.ts";

@Component({
  components: {
    FormField
  }
})
export default class EditEntity extends Vue {
  @Prop() title!: string;
  // List of field definitions on the object
  @Prop() schema!: any;
  // The object being edited
  @Prop() data!: any;
  // Action to call on successful save
  @Prop() action!: string;
  // Label for the submit button
  @Prop() submitLabel!: string;

  formData: any = {};
  formErrors: any = {};
  // Since sometimes schemas can contain invalid attributes (by mistake), we only iterate through
  // field schemas that we know are in the data.
  validSchema: {}[] = [];

  constructor() {
    super();

    // Copy form Data from the entity
    for (const field_schema of this.schema) {
      if (field_schema.attr && this.data[field_schema.attr] === undefined) {
        console.warn(
          `Invalid schema passed to EditEntity: ${field_schema.attr} not an attribute of:`
        );
        console.warn(this.data);
        continue;
      } else {
        this.validSchema.push(field_schema);
      }

      if ("children" in field_schema) {
        for (const child of field_schema.children) {
          this.formData[child.attr] = this.data[child.attr];
        }
      } else {
        this.formData[field_schema.attr] = this.data[field_schema.attr];
      }
    }
  }

  async submit() {
    if (this.data.id) {
      this.formData.id = this.data.id;
    }
    await this.$store.dispatch(this.action, this.formData);
    this.$store.commit(UI_MUTATIONS.SET_NOTIFICATION, `Saved Changes`);
    this.$store.commit(UI_MUTATIONS.MODAL_CLOSE);
    this.$emit("close");
  }

  onFormFieldUpdate(attr, value) {
    this.formData[attr] = value;
  }
}
</script>

<style lang='scss' scoped>
.edit-entity {
  max-width: 550px !important;
  padding: 15px !important;

  .form-content {
    z-index: 1000;
  }
  .action-bar {
    z-index: 10;
  }

  h1 {
    margin-bottom: 10px;
  }

  .form-content {
    position: relative;
    //overflow-y: auto;
  }
}
</style>
