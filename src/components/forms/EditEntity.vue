<template>
  <div class="edit-entity">
    <h1 v-if="title">{{ title.toUpperCase() }}</h1>

    <slot></slot>

    <form @submit.prevent="submit" autocomplete="off">
      <div class="form-content">
        <template v-for="element in validSchema">
          <div v-if="element.children" class="form-subsection" :key="element.attr">
            <div class="subsection-title" v-if="element.row_name">{{ element.row_name.toUpperCase() }}</div>
            <div class="groups" :class="element.class">
              <template v-for="child in element.children">
                <FormField
                  :formErrors="formErrors"
                  v-model="formData[child.attr]"
                  :elementSchema="child"
                  :key="child.attr"
                  v-if="child.attr"

                />
                <div v-else class="form-group" :key="element.children.indexOf(child)"></div>
              </template>
            </div>
          </div>

          <FormField
            v-else
            :key="element.attr + 'else'"
            :formErrors="formErrors"
            v-model="formData[element.attr]"
            :elementSchema="element"
            :readonly="element.readonly || false"
          />
        </template>
      </div>

      <div class="action-bar">
        <button class="btn-large action-cancel" type="button" @click="$emit('close')">CANCEL</button>
        <button class="btn-large action-save" @click="$emit('save')">{{ submitLabel }}</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import FormField from "@/components/forms/FormField.vue";

const props = defineProps<{
  title?: string;
  schema: any;
  data: any;
  action: string;
  submitLabel?: string;
}>();

const store = useStore();
const formData: any = reactive({});
const formErrors = reactive({});
const submitLabel = computed(() => {
  if (props.submitLabel)
    return props.submitLabel.toUpperCase();
  return 'SAVE CHANGES'
});

const emit = defineEmits(['close', 'save']);

const validSchema = computed(() => {
  return props.schema.filter((field_schema) => {
    if (field_schema.attr && props.data[field_schema.attr] === undefined) {
      console.warn(`Invalid schema: ${field_schema.attr} is not an attribute of data`);
      return false;
    }
    if ("children" in field_schema) {
      for (const child of field_schema.children) {
        formData[child.attr] = props.data[child.attr];
      }
    } else {
      formData[field_schema.attr] = props.data[field_schema.attr];
    }
    return true;
  });
});


const submit = async () => {
  if (props.data.id) {
    formData.id = props.data.id;
  }
  await store.dispatch(props.action, formData);
  store.commit('ui/notification_set', 'Saved Changes');
  store.commit('ui/modal/close');
  emit('close');
};
defineExpose({
  submit
});
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
