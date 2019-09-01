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
          <tr v-for="element in elements" :key="element.id" @click="clickRow(element.id)">
            <td v-for="field in schema" :key="field.name">{{ element[field.name] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script lang='ts'>
import axios from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";
import Pagination from "@/components/elementlist/Pagination.vue";
import FilterGroup from "@/components/elementlist/FilterGroup.vue";
import { ElementListSchema } from "@/core/interfaces.ts";

@Component
export default class ElementTable extends Vue {
  @Prop() title!: string;
  @Prop() schema!: any;
  @Prop() endpoint!: string;
  @Prop() elements!: Array<ElementListSchema>;

  clickRow(element_id) {
    this.$emit("show-details", element_id);
  }
}
</script>
<style lang='scss' scoped>
</style>
