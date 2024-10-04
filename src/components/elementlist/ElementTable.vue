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
          <tr v-for="element in elements" :key="element.id">
            <td v-for="field in schema" :key="field.name" :nowrap="isNowrap(field)">
              <a :href="element.link" class="link-full-cell">
                {{ getFieldValue(element, field.name) || "&nbsp;" }}
              </a>
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

<style lang="scss" scoped>
@import "@/styles/colors.scss";

tbody {
  tr {
    td {
      position: relative;
      padding: 0;
      a.link-full-cell {
        display: block;
        width: 100%;
        height: 100%;
        color: inherit;
        text-decoration: none;
        padding: 16px 8px;
        box-sizing: border-box;
      }
    }
  }
}
</style>