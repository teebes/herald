<template>
  <div class="lookup-desktop lookup-item">
    <ItemInfo :item="item" :from_lookup="true" />

    <div class="actions">
      <div
        class="action primary"
        @click="doAction(item, actions.primaryAction.action)"
        v-if="actions.primaryAction"
      >{{ actions.primaryAction.label }}</div>
      <div
        class="action"
        v-for="action in actions.actions"
        :key="actions.actions.indexOf(action)"
        @click="doAction(item, action.action)"
      >{{ action.label }}</div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import ItemInfo from "@/components/game/ItemInfo.vue";

const store = useStore();

const props = defineProps({
  entity: {
    type: Object,
    required: true
  }
});

const item = ref(props.entity);
const actions = computed(() => {
  // Analyze the actions returned by the lookup to see which to
  // display in the modal.

  // Meant to look like: action = {code: code, label: label}
  var actions: any[] = [],
    actionsPriority = [
      // higher the better
      {
        action: "upgrade",
        label: "UPGRADE"
      },
      {
        action: "buy",
        //label: "BUY FOR " + this.item.buy_price + " GOLD"
        label: `BUY FOR ${
          item.value.buy_price
        } ${item.value.currency.toUpperCase()}`
      },
      { action: "sell", label: "SELL" },
      { action: "wield", label: "WIELD" },
      { action: "wear", label: "WEAR" },
      { action: "remove", label: "REMOVE" },
      { action: "get", label: "GET" },
      { action: "drop", label: "DROP" },
      { action: "get_from", label: "GET FROM" },
      { action: "get_all_from", label: "GET ALL FROM" }
    ];

  for (const action of actionsPriority) {
    if (item.value.actions && item.value.actions[action.action]) {
      // If we have get_from, make sure the container has an inventory
      if (item.value.is_container && action.action === "get_from") {
        if (!item.value.inventory.length) {
          continue;
        } else if (item.value.corpse_id) {
          action.label = "LOOT";
        }
      }

      actions.push(action);
    }
  }

  var primaryAction;
  if (actions.length > 0) {
    primaryAction = actions.shift();
  }

  return {
    primaryAction: primaryAction,
    actions: actions
  };
});

const doAction = (item, action) => {
  action = action.toLowerCase();
  let payload: any = {};

  // Try to determine if a modifier needs to be used for that item, if there
  // are multiple of the same keyword in either room or inventory.
  let in_room = false;
  let duplicateCount = 0;
  for (const room_item of store.state.game.room.inventory) {
    if (room_item.key === item.key) {
      in_room = true;
      break;
    } else {
      const foundIndex = room_item.keywords.split(" ").indexOf(item.keyword);
      if (foundIndex !== -1) {
        duplicateCount += 1;
      }
    }
  }

  let in_inv = false;
  if (!in_room) {
    duplicateCount = 0;
    for (const inv_item of store.state.game.player.inventory) {
      if (inv_item.key === item.key) {
        in_inv = true;
        break;
      } else {
        const foundIndex = inv_item.keywords.split(" ").indexOf(item.keyword);
        if (foundIndex !== -1) {
          duplicateCount += 1;
        }
      }
    }
  }

  let item_keyword = item.keyword;
  if ((in_room || in_inv) && duplicateCount > 0) {
    item_keyword = `${duplicateCount + 1}.${item_keyword}`;
  }

  payload.type = `cmd.${action}`;
  payload.data = {
    item: { key: item.key }
  };
  payload.text = `${action} ${item_keyword}`;

  if (action == "get_from") {
    payload.data.from = { key: item.key };
    payload.data.item = { name: "all" };
    payload.type = "cmd.get";
    payload.text = `get all ${item_keyword}`;
  }

  store.dispatch("game/cmd_structured", payload);
  store.commit("game/lookup_clear");
  store.commit("ui/modal/close");
}
</script>
