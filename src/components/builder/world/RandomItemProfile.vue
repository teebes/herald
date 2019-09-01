<template>
  <div>
    <h3 class='name'>{{ resource.name.toUpperCase() }}</h3>
    <div class='level'>Level {{ resource.level }}</div>
    <div>{{ resource.chance_imbued }}% imbued</div>
    <div>{{ resource.chance_enchanted }}% enchanted</div>
    <div>{{ resource.restriction }}</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import WorldView from "@/components/builder/WorldView.ts";
import DisplayEdit from "@/components/DisplayEdit.vue"

@Component({
  components: {
  }
})
export default class extends Mixins(WorldView) {

    @Prop() resource!: any;

}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.name { margin-bottom: 10px;}
button.add-button {
  margin-bottom: 20px;
}
</style>