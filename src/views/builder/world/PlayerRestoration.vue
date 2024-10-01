<template>
  <div v-if="fetched">
    <h2 class='uppercase mb-4'>Item Restoration for {{ player.name }}</h2>

    <p class="color-text-70">
      Deleted items stick around in pending deletion state for at least a week after they've been marked as deleted from a world.
    </p>

    <p class="color-text-70">
      In addition, they only get actually cleaned up from the database when a world is stopped or killed (meaning that items can actually persist for longer than a week if the world has been up for a while).
    </p>

    <p class="color-text-70">
      You can restore items from this list by clicking the "RESTORE" button next to the item. To restore all items, click the "RESTORE ALL" button.
    </p>

    <h3 class="mb-4 mt-8">DELETED EQUIPMENT</h3>

    <div class="list">
      <div v-for="item in eq" :key="item.id">
        <div>
          <span class="color-text-50 mr-2">
          [ {{ item.id }} ]
          {{ formatTimestamp(item.pending_deletion_ts) }}
          </span>
          {{ item.name }}
          <span class='ml-4'>[ <button class="btn-thin" @click="restoreItem(item.id)">RESTORE</button> ]</span>
        </div>
        <div v-if="item.contains.length" class="ml-4">
            <div v-for="contained_item in item.contains" :key="contained_item.id">
                <span class="color-text-50" mr-2>[ {{ contained_item.id }} ]</span>
                {{ contained_item.name }}
            </div>
        </div>
      </div>
      <div v-if="eq.length == 0">
        <p>No deleted equipment.</p>
      </div>
    </div>

    <h3 class='mb-4 mt-8'>DELETED INVENTORY</h3>

    <div class="list">
      <div v-for="item in items" :key="item.id">
        <div>
          <span class="color-text-50 mr-2">
          [ {{ item.id }} ]
          {{ formatTimestamp(item.pending_deletion_ts) }}
          </span>
          {{ item.name }}
          <span class='ml-4'>[ <button class="btn-thin" @click="restoreItem(item.id)">RESTORE</button> ]</span>
        </div>
        <div v-if="item.contains.length" class="ml-4">
            <div v-for="contained_item in item.contains" :key="contained_item.id">
                <span class="color-text-50" mr-2>[ {{ contained_item.id }} ]</span>
                {{ contained_item.name }}
            </div>
        </div>
      </div>
    </div>

    <div v-if="items.length == 0">
      <p>No deleted inventory items.</p>
    </div>

    <button class="btn-small mt-4" @click="restoreAll">RESTORE ALL</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import axios from "axios";

const store = useStore();
const route = useRoute();

const fetched = ref(false);
const player: any = ref({});
const eq: any = ref([]);
const items: any = ref([]);

onMounted(async () => {
  const resp = await axios.get(`builder/worlds/${route.params.world_id}/players/${route.params.player_id}/restore/`);
  eq.value = resp.data.eq;
  player.value = resp.data.player;
  items.value = resp.data.items;
  fetched.value = true;
});

const restoreItem = async (item_id: number) => {
    const resp = await axios.post(`builder/worlds/${route.params.world_id}/players/${route.params.player_id}/restore/${item_id}/`);
    if (resp.status == 201) {
      items.value = items.value.filter((item: any) => item.id != item_id);
      eq.value = eq.value.filter((item: any) => item.id != item_id);
    }
  store.commit("ui/notification_set", "Item restored.");
};

const restoreAll = async () => {
    const resp = await axios.post(`builder/worlds/${route.params.world_id}/players/${route.params.player_id}/restore/`);
    if (resp.status == 201) {
        items.value = [];
    }
  store.commit("ui/notification_set", "Items restored.");
};

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);

    const month = (date.getUTCMonth() + 1); // Months are zero-indexed
    const day = date.getUTCDate();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${month}/${day} ${hours}:${minutes}:${seconds}`;
}

</script>