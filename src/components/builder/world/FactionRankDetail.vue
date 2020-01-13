<template>
  <div>{{ resource.name }} - {{ resource.standing }}</div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class FactionRankDetail extends Vue {
  @Prop() resource!: any;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>