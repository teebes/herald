<template>
  <div v-if="resource">
    <h3 class="name" v-if="resource.name">{{ resource.name.toUpperCase() }}</h3>
    <div>Action:</div>
    <div class="panel mt-1">{{ resource.actions }}</div>

    <div class='mt-4'>Commands: </div>
    <div class='panel mt-1'>
      <div v-for="(command, index) in commands" :key="index">{{ command }}</div>
    </div>

    <div class='mt-4' v-if="resource.conditions">
      Conditions: <div class="panel mt-1">{{ resource.conditions }}</div>
      <div v-if="resource.show_details_on_failure" class='mt-1'>
        <div v-if="resource.failure_message">Default failure message will be shown if condition fails.</div>
        <div v-else>
          Custom failure message will be shown if condition fails: 
          <span>{{ resource.failure_message }}</span>
        </div>
      </div>
      
      
    </div>

    <div class="mt-2">
      
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import RoomView from "@/components/builder/room/RoomView.ts";
import DisplayEdit from "@/components/DisplayEdit.vue";

@Component({
  components: {}
})
export default class extends Mixins(RoomView) {
  @Prop() resource!: any;

  get commands() {
    return this.resource.commands.split('\n')
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.name {
  margin-bottom: 10px;
}
button.add-button {
  margin-bottom: 20px;
}
.resource-link > a {
  color: $color-secondary;
}
</style>