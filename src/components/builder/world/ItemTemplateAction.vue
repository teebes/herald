<template>
  <div v-if="resource">
    <div class='flex justify-between'>
      <h3 class="name inline-block" v-if="resource.name">{{ resource.name.toUpperCase() }}</h3>
      <button class="btn-thin clone" @click="clone(resource)">CLONE</button>
    </div>

    <div>Action:</div>
    <div class="panel mt-1">{{ resource.actions }}</div>

    <div class='mt-4'>Commands: </div>
    <div class='panel mt-1'>
      <div v-for="(command, index) in commands" :key="index">{{ command }}</div>
    </div>

    <div class='mt-4' v-if="resource.conditions">
      Conditions: <div class="panel mt-1">{{ resource.conditions }}</div>
      <div v-if="resource.show_details_on_failure" class='mt-4'>

        <div v-if="resource.failure_message">
          Custom failure message will be shown if condition fails: 
          <span>{{ resource.failure_message }}</span>
        </div>
        <div v-else>
          Default failure message will be shown if condition fails.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import axios from "axios";
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import DisplayEdit from "@/components/DisplayEdit.vue";

@Component({
  components: {}
})
export default class extends Mixins(Vue) {
  @Prop() resource!: any;

  get commands() {
    return this.resource.commands.split("\n");
  }

  async clone(resource) {
    if (!confirm(`Clone this item action?`)) return;
    const world_id = this.$route.params.world_id;
    const item_template_id = this.$store.state.builder.worlds.item_template.id;
    const action_id = resource.id;
    const endpoint = `/builder/worlds/${world_id}/itemtemplates/${item_template_id}/actions/${action_id}/clone/`;
    const resp = await axios.post(endpoint);
    this.$emit('addToCollection', resp.data);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.name {
  margin-bottom: 10px;
  align-content: space-between;
}
button.add-button {
  margin-bottom: 20px;
}
.resource-link > a {
  color: $color-secondary;
}
button.clone {
  margin-bottom: 1px;
}
</style>