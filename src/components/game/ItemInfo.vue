<template>
  <div>
    <div class="name" :class="[item.quality]">{{ capfirst(item.name) }}</div>
    <div class="summary">{{ item.summary }}</div>

    <div
      class="cannot-eq-heavy-armor"
      v-if="player.archetype !== 'warrior' && item.armor_class === 'heavy'"
    >Cannot equip heavy armor.</div>

    <div
      class="level-too-high"
      v-if="item.type === 'equippable' && is_eq_item_too_high_level"
    >Can only wear items up to level {{ is_eq_item_too_high_level }}.</div>

    <div
      class="level-too-high"
      v-if="item.type === 'food' && item.level > player.level"
    >Food is too high level to be consumed.</div>

    <div class="description">
      <div class="description-line" v-for="(line, index) in lines" :key="index">{{ line }}</div>
    </div>

    <template v-if="item.type === 'equippable' && item.stats.length">
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

      <div class='augments' v-if="item.augment && item.augment.key">
          Augmented with <span class="font-bold">{{ item.augment.name }}</span><span v-if="item.augment.stats.length">:</span><span v-else>.</span>
        <ul v-for="stat in item.augment.stats" :key="stat.stat" class="list">
          <li>+{{ stat.value }} {{ stat.stat }}</li>
        </ul>
      </div>

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
            <li v-for="contained_item in inventoryStack" :key="contained_item.display_key" class="inventory-item">
              <span
                :class="{ [contained_item.quality]: true}"
                class="contained-item interactive"
                @click="onClickContainedItem(contained_item)"
                v-if="!from_lookup"
                v-interactive="{target: contained_item}"
              >{{ contained_item.name }}</span>
              <span
                v-else
                :class="{ [contained_item.quality]: true}"
                @click="onClickContainedItem(contained_item)"
                class="contained-item"
              >{{ contained_item.name }}</span>
              <span class="item-count" v-if="contained_item.count && contained_item.count > 1">&nbsp;[{{contained_item.count}}]</span>
            </li>
          </ul>
        </div>
      </template>
      <template v-else>Container is empty.</template>
    </template>

    <div class="color-text-50 mt-2" v-if="item.label">An item label reads: "{{ item.label }}"</div>

    <div class='color-primary' v-if="item.on_use_description">On Use: {{ item.on_use_description }}</div>
    <div class='color-primary' v-else-if="item.on_use_cmd">Item has On Use command.</div>

    <div v-if="item.cost && item.currency === 'gold'" class="color-secondary mt-2">
      Sells for {{ item.cost }} gold.
      <template v-if="isUpgradable">
        <br />
        <!-- Upgrade can be attempted for {{ item.upgrade_cost }} gold. -->
         Upgrade can be attempted for {{ upgrade_cost(item) }} gold.
      </template>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { getTargetInGroup } from "@/core/utils.ts";
import { capfirst } from "@/core/utils.ts";
import { stackedInventory } from "@/core/utils.ts";

const store = useStore();

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  from_lookup: {
    type: Boolean,
    default: false
  }
});

const inventoryStack = stackedInventory(props.item.inventory);

const upgrader = computed(() => {
  for (const char of store.state.game.room.chars) {
    if (char.is_upgrader) {
      return char;
    }
  }
  return null;
});

const isUpgradable = computed(() => {
  if (!upgrader.value) return false;

  // Only show upgrade option in workshop rooms
  // if (store.state.game.room.flags.indexOf("workshop") == -1) return false;

  // Show upgrade price based on whether they can be upgraded
  if (props.item.quality == "enchanted" && props.item.upgrade_count <= 2) return true;
  else if (props.item.quality == "imbued" && props.item.upgrade_count == 0) return true;
  return false;
});

const upgrade_cost = (item) => {
  return Math.ceil(item.upgrade_cost * upgrader.value.upgrade_cost_multiplier);
};

const lines = computed(() => props.item.description.split("\n") || []);
const player = computed(() => store.state.game.player);
const is_eq_item_too_high_level = computed(() => {
  // If the user is allowed to wear the item, return false.
  // If the user cannot wear the item, return the max level
  // they are able to wear equipment at.
  const delta = props.item.level - player.value.level;
  if (delta > 3) {
    return player.value.level + 3;
  } else {
    return false;
  }
});

const onClickContainedItem = (contained_item) => {
  // Get the selection string for the item we're getting
  const target = getTargetInGroup(contained_item, props.item.inventory);

  // Get the selection string for the container item
  const container_key = props.item.in_container.key;
  let container_group;
  if (RegExp(/@\d+:room\./).test(container_key)) {
    // The container is a room, therefore look in the room's
    // inventory
    container_group = store.state.game.room.inventory;
  } else {
    // The container is a player
    container_group = store.state.game.player.inventory;
  }
  const container = getTargetInGroup(props.item, container_group);

  store.dispatch("game/cmd", `get ${target} ${container}`);
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.level-too-high,
.cannot-eq-heavy-armor {
  color: $color-red;
}

.description {
  max-height: 300px;
  overflow-y: auto;

  .description-line {
    min-height: 14px;
  }
}

.augments .list {
  margin-bottom: 0;
}
</style>