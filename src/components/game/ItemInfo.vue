<template>
  <div>
    <div class="name" :class="[item.quality]">{{ this.$capfirst(item.name) }}</div>
    <div class="summary">{{ item.summary }}</div>

    <div
      class="cannot-eq-heavy-armor"
      v-if="player.archetype !== 'warrior' && item.armor_class === 'heavy'"
    >Cannot equip heavy armor.</div>

    <div
      class="level-too-high"
      v-if="is_item_too_high_level"
    >Can only wear items up to level {{ is_item_too_high_level }}.</div>

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

    <template v-else-if="item.type === 'container' || item.type === 'corpse'">
      <template v-if="item.inventory.length">
        <div class="container-info">
          <div
            class="list-title"
            v-if="item.inventory.length === 1"
          >{{ item.inventory.length }} item in {{ item.type }}:</div>
          <div
            class="list-title"
            v-else-if="item.inventory.length > 1"
          >{{ item.inventory.length }} items in {{ item.type }}:</div>

          <ul class="list">
            <li v-for="contained_item in item.inventory" :key="contained_item.key">
              <span
                :class="{ [contained_item.quality]: true}"
                class="contained-item interactable"
                @click="onClickContainedItem(contained_item)"
                v-if="!from_lookup"
                v-interactive="{target: contained_item}"
              >{{contained_item.name}}</span>
              <span
                v-else
                :class="{ [contained_item.quality]: true}"
                @click="onClickContainedItem(contained_item)"
                class="contained-item"
              >{{ contained_item.name }}</span>
            </li>
          </ul>
        </div>
      </template>
      <template v-else>Container is empty.</template>
    </template>

    <div class="color-text-50 mt-2" v-if="item.label">An item label reads: "{{ item.label }}"</div>

    <div v-if="item.cost" class="color-secondary mt-2">
      Sells for {{ item.cost }} gold.
      <template v-if="isUpgradable">
        <br />
        Can be upgraded for {{ item.upgrade_cost }} gold.
      </template>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { getTargetInGroup } from "@/core/utils.ts";

@Component
export default class ItemInfo extends Vue {
  @Prop() item!: any;
  @Prop({ default: false }) from_lookup!: boolean;

  get isUpgradable() {
    // Only show upgrade option in workshop rooms
    if (this.$store.state.game.room.flags.indexOf("workshop") == -1)
      return false;
    // Show upgrade price based on whether they can be upgraded
    if (this.item.quality == "enchanted" && this.item.upgrade_count <= 2)
      return true;
    else if (this.item.quality == "imbued" && this.item.upgrade_cost == 0)
      return true;
    return false;
  }

  get lines() {
    return this.item.description.split("\n") || [];
  }

  get player() {
    return this.$store.state.game.player;
  }

  get is_item_too_high_level() {
    // If the user is allowed to wear the item, return false.
    // If the user cannot wear the item, return the max level
    // they are able to wear equipment at.
    const delta = this.item.level - this.player.level;
    if (delta > 3) {
      return this.player.level + 3;
    } else {
      return false;
    }
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
.level-too-high,
.cannot-eq-heavy-armor {
  color: $color-red;
}
</style>