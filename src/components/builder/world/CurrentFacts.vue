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

<script lang='ts' setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

const props = defineProps<{
  world_id: number;
}>();

const facts: any = ref([]);
const interval: any = ref(null);

const update_facts = async () => {
  const resp = await axios.get(`builder/worlds/${props.world_id}/facts/`);
  facts.value = resp.data;
};

onMounted(() => {
  update_facts();
  interval.value = setInterval(() => {
    update_facts();
  }, 30000);
});

onUnmounted(() => {
  clearInterval(interval.value);
});
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
