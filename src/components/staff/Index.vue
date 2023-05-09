<template>
  <div id="page">
    <h1>Staff Panel</h1>
    <div>Panel Contents</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import axios from "axios";

@Component({
  components: {
    ElementList
  }
})
export default class StaffPage extends Vue {
}
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
</style>