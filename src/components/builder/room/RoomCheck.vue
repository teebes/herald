<template>
  <div v-if="resource">
    <h3 class="name" v-if="resource.name">{{ resource.name.toUpperCase() }}</h3>
    <div>Prevent: {{ resource.prevent }}</div>

    <div v-if="resource.check === 'mob_is_present'">
      If
      <span class="resource-link">
        <router-link :to="mob_link(resource.argument)">mob {{ resource.argument }}</router-link>
      </span>
      is present
      <div v-if="resource.argument2">(does not affect {{ resource.argument2 }} characters).</div>
    </div>

    <div
      v-if="resource.check === 'not_in_inv' || resource.check === 'in_inv' || resource.check === 'equipped' || resource.check === 'not_equipped'"
    >
      If
      <span class="resource-link">
        <router-link
          v-if="resource.argument"
          :to="item_link(resource.argument)"
        >item {{ resource.argument }}</router-link>
        <span v-else>item</span>
        {{' '}}
      </span>
      <span v-if="resource.check === 'not_in_inv'">is not in inventory</span>
      <span v-if="resource.check === 'in_inv'">is in inventory</span>
      <span v-if="resource.check === 'equipped'">is equipped</span>
      <span v-if="resource.check === 'not_equipped'">is not equipped</span>
    </div>

    <div v-if="resource.check === 'health_below'">If health is below {{ resource.argument }}%</div>

    <div
      v-if="resource.check === 'faction_below'"
    >If faction membership with {{ resource.argument }} is below {{ resource.argument2 }}</div>

    <div v-else>
      Check: {{ resource.check }}
      <div>Argument: {{ resource.argument }}</div>
      <div v-if="resource.argument2">Argument 2: {{ resource.argument2 }}</div>
    </div>

    <div v-if="resource.failure_msg">Failure message: {{ resource.failure_msg }}</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import RoomView from "@/components/builder/room/RoomView.ts";
import {
  BUILDER_MOB_TEMPLATE_DETAILS,
  BUILDER_ITEM_TEMPLATE_DETAILS
} from "@/router.ts";

@Component({
  components: {}
})
export default class extends Mixins(RoomView) {
  @Prop() resource!: any;

  mob_link(mob_id) {
    return {
      name: BUILDER_MOB_TEMPLATE_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        mob_template_id: mob_id
      }
    };
  }

  item_link(item_id) {
    return {
      name: BUILDER_ITEM_TEMPLATE_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        item_template_id: item_id
      }
    };
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