<template>
  <div class="form-group" :class="{ 'checkbox': elementSchema.widget == 'checkbox' }">
    <!-- Checkbox -->
    <div class="flex" v-if="elementSchema.widget == 'checkbox'">
      <label>
        <input :id="'field-' + elementSchema.attr" type="checkbox" v-model="internalValue" />
        {{ elementSchema.label }}
      </label>
      <Help v-if="elementSchema.help" :help="elementSchema.help"></Help>
    </div>

    <component v-else-if="elementSchema.widget == 'custom'"
      :is="elementSchema.widgetComponent"
      v-model="internalValue">
    </component>

    <template v-else>
      <label :for="'field-' + elementSchema.attr" :class="{ error: hasFieldError }">
        {{ elementSchema.label }}
        <span v-if="elementSchema.attr in formErrors">({{ formErrors[elementSchema.attr][0] }})</span>
        <Help v-if="elementSchema.help" :help="elementSchema.help"></Help>
      </label>

      <!-- Textarea -->
      <textarea
        v-if="elementSchema.widget == 'textarea'"
        :id="'field-' + elementSchema.attr"
        :placeholder="elementSchema.label"
        v-model="internalValue"
        @keyup="delete formErrors[elementSchema.attr]"
        @focus="onFocus"
        @blur="onBlur"
      ></textarea>

      <!-- Select -->
      <template v-else-if="elementSchema.options">
        <input v-if="readonly" :readonly="true" :value="internalValue" />
        <select :id="'field-' + elementSchema.attr" v-model="internalValue" v-else>
          <option v-for="option in elementSchema.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </template>

      <!-- Reference -->
      <ReferenceField
        v-else-if="elementSchema.widget == 'reference'"
        :schema="elementSchema"
        v-model="internalValue"
        @update="onUpdateReference"
      />

      <!-- Input -->
      <input
        v-else
        :id="'field-' + elementSchema.attr"
        :placeholder="elementSchema.label"
        v-model="internalValue"
        @keyup="delete formErrors[elementSchema.attr]"
        @focus="onFocus"
        @blur="onBlur"
        autocomplete="off"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import ReferenceField from "./ReferenceField.vue";
import { useStore } from 'vuex';
import Help from "@/components/Help.vue";

const props = withDefaults(defineProps<{
  elementSchema: any;
  modelValue: any;
  formErrors: Object;
  readonly?: boolean;
}>(), { readonly: false });

const store = useStore();
// const internalValue = ref(props.value);
const internalValue = ref(props.modelValue);
const hasFieldError = computed(() => props.elementSchema.attr in props.formErrors);

const emit = defineEmits(['input', 'update:modelValue', 'update']);

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue);
  emit('input', newValue);
  // may not be needed
  // emit('update', props.elementSchema.attr, newValue);
});
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});

const onFocus = () => { store.commit("ui/editing_field_set"); }

const onBlur = () => { store.commit("ui/editing_field_clear"); }


const onUpdateReference = (value) => {
  /*
    Comment from old vue 2 code:

    Surprising that this is needed given that v-model is supposed to update the
    value automatically when the component emits update, but for some reason that
    was not happening when trying to update for null references.

    Works if we include this. Not sure why.
  */
  emit('update:modelValue', value);
}
</script>

<style lang="scss">
.form-group.checkbox {
  display: flex;
  align-items: center;
  .help-icon > img {
    position: relative;
  }
}
</style>