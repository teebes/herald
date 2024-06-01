<template>
  <div>
    <Element
      v-for="(element, index) in elements"
      :key="element.attr"
      :endpoint="endpoint"
      :endpoint_filters="endpoint_filters"
      :element="element"
      :schema="schema"
      :selected="selected"
      :editable="editable"
      @update="onUpdate"
      @click.native="onClick(element)"
      @remove="onRemove(index)"
    />

    <Element
      v-if="adding"
      :isNew="true"
      :endpoint="endpoint"
      :endpoint_filters="endpoint_filters"
      :element="newData"
      :schema="schema"
      @create="onCreate"
      @cancel="adding = false"
    />

    <button class="btn-add" @click="add" v-if="!adding">ADD {{ title.toUpperCase() }}</button>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Element from "./Element.vue";

const props = withDefaults(defineProps<{
  endpoint: string;
  endpoint_filters?: {};
  schema: Array<any>;
  title: string;
  initial_new_data?: {};
  selected?: any;
  editable?: boolean;
}>(), { editable: true});
const emit = defineEmits(["add", "remove", "clickElement"]);

let adding = ref(false);
let elements = ref<any[]>([]);

const newData = computed(() => {
  let data = {};

  if (props.initial_new_data) return props.initial_new_data;

  for (let elementSchema of props.schema) {
    data[elementSchema.attr] = elementSchema.default || "";
  }
  return data;
});

const fetch = async () => {
  let endpoint = props.endpoint;

  let filters: string[] = [];
  if (props.endpoint_filters) {
    for (const filter_name in props.endpoint_filters) {
      const filter_value = props.endpoint_filters[filter_name];
      filters.push(`${filter_name}=${filter_value}`);
    }
    if (filters.length) endpoint += "?" + filters.join("&");
  }

  const resp = await axios.get(endpoint);
  if (resp.data.data) elements.value = resp.data.data;
  else if (resp.data.results) elements.value = resp.data.results;
  else elements.value = resp.data;
};

onMounted(async () => {
  await fetch();
});

const add = () => {
  adding.value = true;
};

const onCreate = (element) => {
  elements.value.push(element);
  adding.value = false;
  emit("add", element);
};

const onRemove = (index) => {
  const removed = elements.value.splice(index, 1);
  emit("remove", removed[0]);
};

const onClick = (element) => {
  emit("clickElement", element);
};

const onUpdate = (element) => {
  const index = elements.value.findIndex((el) => el.id === element.id);
  elements.value[index] = element;
};
</script>