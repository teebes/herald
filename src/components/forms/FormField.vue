<template>
  <div class="form-group" :class="{ 'checkbox': elementSchema.widget == 'checkbox' }">
    <!-- Checkbox -->
    <div class="flex" v-if="elementSchema.widget == 'checkbox'">
      <label>
        <input :id="'field-' + elementSchema.attr" type="checkbox" v-model="internalValue" />
        {{ elementSchema.label }}
      </label>
      <div v-if="elementSchema.help && elementSchema.help" class="help-icon">
        <img alt="help" src="~@/assets/ui/help_icon_2x.png" v-tooltip="tooltip_content" />
      </div>
    </div>

    <template v-else>
      <label :for="'field-' + elementSchema.attr" :class="{ error: hasFieldError }">
        {{ elementSchema.label }}
        <span
          v-if="elementSchema.attr in formErrors"
        >({{ formErrors[elementSchema.attr][0] }})</span>
        <div v-if="elementSchema.help && elementSchema.help" class="help-icon">
          <img alt="help" src="~@/assets/ui/help_icon_2x.png" v-tooltip="tooltip_content" />
        </div>
      </label>

      <!-- Textarea -->
      <textarea
        :id="'field-' + elementSchema.attr"
        :placeholder="elementSchema.label"
        v-model="internalValue"
        v-if="elementSchema.widget == 'textarea'"
        @keyup="delete formErrors[elementSchema.attr]"
        @focus="onFocus"
        @blur="onBlur"
      ></textarea>

      <!-- Select -->
      <template v-else-if="elementSchema.options">
        <input v-if="readonly" readonly="readonly" :value="internalValue" />
        <select :id="'field-' + elementSchema.attr" v-model="internalValue" v-else>
          <option
            v-for="option in elementSchema.options"
            :key="option.value"
            :value="option.value"
          >{{ option.label }}</option>
        </select>
      </template>

      <!-- Reference -->
      <ReferenceField
        v-else-if="elementSchema.widget == 'reference'"
        :schema="elementSchema"
        v-model="internalValue"
      />

      <!-- Input -->
      <input
        :id="'field-' + elementSchema.attr"
        :placeholder="elementSchema.label"
        v-model="internalValue"
        @keyup="delete formErrors[elementSchema.attr]"
        @focus="onFocus"
        @blur="onBlur"
        autocomplete="off"
        v-else
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ReferenceField from "./ReferenceField.vue";
import { UI_MUTATIONS } from "@/constants";

@Component({ components: { ReferenceField } })
export default class FormField extends Vue {
  @Prop() elementSchema!: any;
  @Prop() value!: any;
  @Prop() formErrors!: Object;
  @Prop({ default: false }) readonly!: boolean;

  constructor() {
    super();
    console.log(this.elementSchema);
  }

  get tooltip_content() {
    return {
      content: this.elementSchema.help,
      trigger: "hover click",
      autoHide: false
    };
  }

  internalValue: any = this.value;

  get hasFieldError() {
    return this.elementSchema.attr in this.formErrors;
  }

  @Watch("internalValue")
  onValueChange(val: any, oldVal: any) {
    this.$emit("update", this.elementSchema.attr, val);
    this.$emit("input", val);
  }

  @Watch("value")
  onElementValueChange(newValue) {
    this.internalValue = newValue;
  }

  onFocus() {
    this.$store.commit(UI_MUTATIONS.EDITING_FIELD_SET);
  }

  onBlur() {
    setTimeout(() => {
      this.$store.commit(UI_MUTATIONS.EDITING_FIELD_CLEAR);
    }, 250);
  }
}
</script>

<style lang="scss" scoped>
.form-group.checkbox {
  display: flex;
  align-items: center;
  img {
    position: relative;
    bottom: 6px;
  }
}
</style>