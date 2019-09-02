<template>
  <div>
    <div class="equipment-view">
      <table>
        <tr v-for="slotData in this.slots" :key="slotData.slotName">
          <td class="eq_slot">{{ slotData.slotName }}</td>
          <td class="eq-item">
            <span
              v-interactive="{target: slotData.slotItem}"
              class="interactive"
              :class="[slotData.slotItemQuality, slotData.slotItemKey ? 'interactive' : '']"
              :key="slotData.slotItemKey"
              :keyword="slotData.slotItemKeyword"
              @click="onItemClick(slotData.slotItem)"
            >{{ slotData.slotItemName }}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EQUIPMENT_SLOT_LIST } from "@/constants.ts";
import { getTargetInGroup } from "@/core/utils.ts";

@Component
export default class PanelEquipment extends Vue {
  get playerEq() {
    return this.$store.state.game.player.equipment;
  }

  get equipmentSlots() {
    // TODO: Might want to either factor this out into its own
    // constants file, or fetch it from the game at connection time
    // (since different worlds could eventually define different
    // equipment slots, though that's a ways away).
    return [
      "weapon",
      "offhand",
      "head",
      "body",
      "arms",
      "hands",
      "waist",
      "legs",
      "feet",
      "shoulders"
    ];
  }

  get slots() {
    let slots: {}[] = [];
    for (const slotName of this.equipmentSlots) {
      const slotData = {
        slotName: slotName,
        slotItemKey: "",
        slotItemName: "<empty>",
        slotItemQuality: "",
        slotItemKeyword: "",
        slotItem: null
      };

      const slotItem = this.playerEq[slotName];
      if (slotItem) {
        slotData.slotItemKey = slotItem.key;
        slotData.slotItemName = slotItem.name;
        slotData.slotItemQuality = slotItem.quality;
        slotData.slotItemKeyword = slotItem.keywords.split(" ")[0];
        slotData.slotItem = slotItem;
      }

      slots.push(slotData);
    }
    return slots;
  }

  onItemClick(item) {
    if (!item) return;
    if (this.$store.state.game.is_mobile) return;

    let items: {}[] = [];
    for (let slotName of EQUIPMENT_SLOT_LIST) {
      const slotItem = this.playerEq[slotName];
      if (slotItem) {
        items.push(slotItem);
      }
    }
    const target = getTargetInGroup(item, items);
    this.$store.dispatch("game/cmd", `remove ${target}`);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.equipment-view {
  padding: 0 20px;
  margin-top: auto;

  display: flex;
  flex-wrap: wrap;
  .equipment-slot {
    flex: 1 1 50%;
  }

  .eq-slot {
    vertical-align: top;
  }
  .eq-item {
    padding-left: 1em;
  }
}
</style>