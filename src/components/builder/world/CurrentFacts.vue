<template>
    <table class='facts-table my-4'>
    <thead>
      <tr>
        <th>Fact</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="facts.length">
        <tr v-for="fact_value in facts" :key="fact_value.fact">
        <td>{{ fact_value.fact }}</td>
        <td>{{ fact_value.value }}</td>
      </tr>
      </template>
      <template v-else>
        <tr>
          <td colspan=2>No facts set</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import axios from "axios";
@Component
export default class CurrentFacts extends Vue {
  @Prop() world_id!: number;
  facts: {}[] = [];
  interval: any;

  async update_facts() {
    const resp = await axios.get(`builder/worlds/${this.world_id}/facts/`);
    this.facts = resp.data;
  }

  async mounted() {
    this.update_facts();
    this.interval = setInterval(() => {
      this.update_facts();
    }, 30000);
  }

  async destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
table.facts-table {
  border: 1px solid $color-form-border;
  td,
  th {
    padding: 5px 10px;
    border: 1px solid $color-form-border;
  }
  th {
    background: $color-background-light-border;
  }
}
</style>
