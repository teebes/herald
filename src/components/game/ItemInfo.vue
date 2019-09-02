<template>
  <div>
    <div class="name" :class="[item.quality]">{{ this.$capfirst(item.name) }}</div>
    <div class="summary">{{ item.summary }}</div>
    <div class="description">
      <div class="description-line" v-for="line in lines" :key="lines.indexOf(line)">{{ line }}</div>
    </div>

    <template v-if="item.type === 'equippable'">
      <div class="list-title stats">Stats:</div>
      <table class="item-stats">
        <tr
          v-for="stat in item.stats"
          :key="item.stats.indexOf(stat)"
          :class="{ 'zero': stat.is_zero }"
        >
          <td class="item-name">{{ stat.label }}</td>
          <td class="item-value">{{ stat.value }}</td>
          <td class="item-value-change">
            <span class="change" :class="[stat.change_direction]">({{ stat.change }})</span>
          </td>
        </tr>
      </table>

      <div
        class="upgrade_count color-text-50"
        v-if="item.upgrade_count > 0"
      >Upgrade count: {{item.upgrade_count}}</div>
    </template>

    <template v-else-if="item.type === 'container'">
      <template v-if="item.inventory.length">
        <div class="container-info">
          <div
            class="list-title"
            v-if="item.inventory.length === 1"
          >{{ item.inventory.length }} item in container:</div>
          <div
            class="list-title"
            v-else-if="item.inventory.length > 1"
          >{{ item.inventory.length }} items in container:</div>

          <ul class="list">
            <li v-for="contained_item in item.inventory" :key="contained_item.key">
              <span
                :class="{ interactive: $store.state.game.lookup, [contained_item.quality]: true}"
                class="contained-item"
                @click="onClickContainedItem(contained_item)"
              >{{contained_item.name}}</span>
            </li>
          </ul>
        </div>
      </template>
      <template v-else>Container is empty.</template>
    </template>

    <div class="color-text-50 mt-2" v-if="item.label">An item label reads: "{{ item.label }}"</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { getTargetInGroup } from "@/core/utils.ts";

@Component
export default class ItemInfo extends Vue {
  @Prop() item!: any;

  get lines() {
    return this.item.description.split("\n") || [];
  }

  onClickContainedItem(contained_item) {
    // Get the selection string for the item we're getting
    const target = getTargetInGroup(contained_item, this.item.inventory);

    // Get the selection string for the container item
    const container_key = this.item.in_container.key;
    let container_group;
    if (RegExp(/@\d+:room\./).test(container_key)) {
      // The container is a room, therefore look in the room's
      // inventory
      container_group = this.$store.state.game.room.inventory;
    } else {
      // The container is a player
      container_group = this.$store.state.game.player.inventory;
    }
    const container = getTargetInGroup(this.item, container_group);

    this.$store.dispatch("game/cmd", `get ${target} ${container}`);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>