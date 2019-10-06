<template>
  <div>
    <h3 class="name" v-if="resource.keywords">{{ resource.keywords.toUpperCase() }}</h3>
    <div>{{ resource.description }}</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import RoomView from "@/components/builder/room/RoomView.ts";

@Component({
  components: {}
})
export default class RoomDetailDetail extends Mixins(RoomView) {
  @Prop() resource!: any;
}
</script>

<style lang="scss" scoped>