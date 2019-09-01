<template>
  <Tabs />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Tabs from "../panel/Tabs.vue";

@Component({
  components: {
    Tabs
  }
})
export default class MobilePanel extends Vue {}
</script>