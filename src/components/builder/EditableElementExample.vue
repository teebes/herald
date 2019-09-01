<template>
  <EditableElement @save="save">
    <template slot="display">Tied to {{ quest.mob_template.name }}.</template>
    <template slot="edit">
      <FormField :elementSchema="mob_template_schema" v-model="edit_data" :formErrors="formErrors" />
    </template>
  </EditableElement>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { BUILDER_ACTIONS, UI_MUTATIONS } from "@/constants";
import { Entity } from "@/core/interfaces.ts";
import FormField from "@/components/forms/FormField.vue";
import { FormElement, BUILDER_FORMS } from "@/core/forms";
import EditableElement from "@/components/EditableElement.vue";

@Component({
  components: {
    EditableElement,
    FormField
  }
})
export default class extends Vue {
  edit_data: Entity | null = null;
  formErrors: {} = {};

  constructor() {
    super();
    if (this.quest && this.quest.mob_template) {
      this.edit_data = this.quest.mob_template;
    }
  }

  get quest() {
    return this.$store.state.builder.quest;
  }

  get mob_template_schema() {
    const schema = BUILDER_FORMS.MOB_TEMPLATE;
    schema.label = "Quest is tied to mob";
    return schema;
  }

  save() {}
}
</script>