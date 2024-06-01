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
      <template v-for="fieldSchema in schema" :key="fieldSchema.attr">
        <FormField
          v-model="edit_data[fieldSchema.attr]"
          :elementSchema="fieldSchema"
          :formErrors="formErrors"

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


<script lang='ts' setup>
/*
    The element is in charge of editing, creating or removing an entity that is
    being manipulated.
*/
import { ref, computed } from "vue";
import { useStore } from "vuex";
import FormField from "@/components/forms/FormField.vue";
import axios from "axios";

const store = useStore();
const props = withDefaults(defineProps<{
  element: any;
  schema: any;
  endpoint: string;
  endpoint_filters?: {};
  selected?: any;
  editable?: boolean;
  isNew?: boolean;
}>(), {isNew: false});
const emit = defineEmits(["update", "create", "remove", "cancel"]);

let edit_mode = ref(props.isNew);
let edit_data = ref({ ...props.element });
let formErrors = ref({});

const details_endpoint = computed(() => {
  let endpoint = `${props.endpoint}${props.element.id}/`;

  let filters: string[] = [];
  if (props.endpoint_filters) {
    for (const filter_name in props.endpoint_filters) {
      const filter_value = props.endpoint_filters[filter_name];
      filters.push(`${filter_name}=${filter_value}`);
    }
    if (filters.length) endpoint += "?" + filters.join("&");
  }
  return endpoint;
});

const submit_data = computed(() => {
  let data = {};
  for (const fieldSchema of props.schema) {
    data[fieldSchema.attr] = edit_data.value[fieldSchema.attr];
  }
  return data;
});

const validate_data = () => {
  formErrors.value = {};
  for (const fieldSchema of props.schema) {
    if (fieldSchema.required && !edit_data.value[fieldSchema.attr]) {
      formErrors.value[fieldSchema.attr] = "This field is required";
    }
  }
  if (formErrors.value) return formErrors.value;
  return true;
};

const edit = () => {
  edit_mode.value = true;
  edit_data.value = { ...props.element };
};

const cancelEdit = () => {
  edit_mode.value = false;
  emit("cancel");
};

// const onFormFieldUpdate = (attr: string, value: any) => {
//   if (props.schema) edit_data.value[attr] = value;
// };

const splitLines = (element: any) => {
  if (typeof element === "string") {
    return element.split("\n");
  }
  return [];
};

const save = async () => {
  if (!validate_data()) {
    return;
  }

  if (props.isNew) return create();

  try {
    const resp = await axios.put(details_endpoint.value, submit_data.value);
    emit("update", resp.data);
    edit_mode.value = false;
  } catch (e: any) {
    if (e.response.status == 400) {
      formErrors.value = e.response.data;
      store.commit(
        'ui/notification_set_error',
        "Error saving form"
      );
    }
  }
};

const create = async () => {
  try {
    const resp = await axios.post(props.endpoint, submit_data.value);
    emit("create", resp.data);
    edit_mode.value = false;
  } catch (e: any) {
    if (e.response.status == 400) {
      formErrors.value = e.response.data;
      store.commit(
        'ui/notification_set_error',
        "Error saving form"
      );
    }
  }
};

const remove = async () => {
  if (!confirm(`Confirm deletion?`)) return;
  await axios.delete(details_endpoint.value);
  emit("remove");
};
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
