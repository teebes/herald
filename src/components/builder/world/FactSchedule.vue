<template>
  <div>
    <h3 class="name mb-2">{{ resource.name.toUpperCase() }}</h3>
    <div>Fact: {{ resource.fact }}</div>
    <div>Value: {{ resource.value }}</div>
    <div>Value Selection: {{ resource.selection }}</div>
    <div>Schedule: {{ resource.schedule }}</div>
    <div>Schedule Type: {{ resource.schedule_type }}</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() resource!: any;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>