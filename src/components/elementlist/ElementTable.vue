<template>
  <div>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th v-for="field in schema" :key="field.name">{{ field.label }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="element in elements" :key="element.id" @click="clickRow(element)">
            <td v-for="field in schema" :key="field.name" :nowrap="isNowrap(field)">
              {{ getFieldValue(element, field.name) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElementListSchema } from "@/core/interfaces.ts";

defineProps<{
  title: string;
  schema: any;
  elements: Array<ElementListSchema>;
}>();
const emit = defineEmits(['show-details']);

const clickRow = (element: ElementListSchema) => {
  emit('show-details', element);
};

const isNowrap = (field: any) => {
  return field.nowrap;
};

const getFieldValue = (element: ElementListSchema, name: string) => {
  if (name.indexOf(".") !== -1) {
    const parts = name.split(".");
    const parent = element[parts[0]];
    return parent[parts[1]];
  }
  return element[name];
};
</script>
<style lang="scss" scoped></style>