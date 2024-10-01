<template>
  <div id="builder-player-detail" v-if="fetched">
    <h2 class="entity-title">{{ player.name }}</h2>

    <div>
      Level {{ player.level }} {{ player.archetype }}
      <span v-if="store.state.auth.user.is_staff" class='ml-2 color-text-50'>
        [ <router-link :to="user_page(player)">user {{ player.animation_data.user_id }}</router-link> ]
      </span>
    </div>
    <div v-if="player.title">Title: {{ player.title }}</div>
    <div v-if="player.is_immortal">This is a builder character.</div>
    <div>Power: {{ Number(player.power).toLocaleString() }}</div>
    <div>Spawn world details: {{ player.world.id }} ({{ player.world.state }})</div>

    <div class="mt-4">
      <button class="btn-small" @click="editInfo">EDIT INFO</button>
      <button
        class="btn-small ml-4"
        @click="resetPlayer"
        v-if="!store.state.builder.world.is_multiplayer"
      >RESET</button>
      <button class="btn-small ml-4" @click="deletePlayer">DELETE</button>
      <!-- <button class="btn-small ml-4" @click="restorePlayer">RESTORE</button> -->
    </div>

    <div class="mt-4">
      <router-link :to="{name: 'builder_world_player_restoration', params: { world_id: route.params.world_id, player_id: route.params.player_id }}">
        Item Restoration
      </router-link>
    </div>

    <div class="data-and-map">
      <div class="player-data">
        <div class="instance-details" v-if="!store.state.builder.world.is_multiplayer">
          <h3>Instance Details</h3>
          <div>Mob count: {{ player.instance_details.mob_count }}</div>
          <div>Item count: {{ player.instance_details.item_count }}</div>
        </div>

        <div class="facts" v-if="!player.world.is_multiplayer">
          <h3>Facts</h3>
          <CurrentFacts :world_id="player.world.id"/>
        </div>

        <div class="factions">
          <h3>Factions</h3>
          <div>core: {{ player.animation_data.factions.core }}</div>
          <div
            v-for="faction_code in Object.keys(player.animation_data.factions)"
            :key="faction_code"
          >
            <template
              v-if="faction_code !== 'core'"
            >{{ faction_code }}: {{ player.animation_data.factions[faction_code] }}</template>
          </div>
        </div>

        <div class="inventory">
          <h3>Inventory</h3>
          <div v-for="item in player.inventory" :key="item.id">{{ item.name }}</div>
        </div>

        <div class="equipment">
          <h3>Equipment</h3>
          <div v-for="slot in EQUIPMENT_SLOT_LIST" :key="slot">
            &lt;{{ slot }}&gt;
            <span v-if="player.equipment[slot]">{{ player.equipment[slot].name}}</span>
            <span v-else>empty</span>
          </div>
        </div>

        <div class="quests">
          <h3>Quests</h3>
          <div v-for="quest in player.quests" :key="quest.id">{{ quest.name }}</div>
        </div>

        <div class="trophy">
          <h3>Trophy</h3>
          <div
            v-for="mob_template_id in Object.keys(player.trophy)"
            :key="mob_template_id"
          >{{ player.trophy[mob_template_id]['mob_template']['name']}}: {{ player.trophy[mob_template_id]['count']}}</div>
        </div>

        <div class="marks">
          <h3>Marks</h3>
          <div v-for="mark in player.marks" :key="mark.name">{{ mark.name }}: {{ mark.value }}</div>
        </div>
      </div>

      <div class="player-map">
        <h3>Map</h3>
        <div class="player-room">{{ player.room.name }}</div>
        <Map
          :map="store.state.builder.map"
          :rooms_filter="player_rooms"
          :center_key="center_key"
          :unit="8"
          :radius="4"
          :display_planes="true"
          @clickRoom="onMapClickRoom"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import Map from "@/components/ui/Map.vue";
import CurrentFacts from "@/components/builder/world/CurrentFacts.vue";
import { Room } from "@/core/interfaces.ts";
import { EQUIPMENT_SLOT_LIST } from "@/constants";

const store = useStore();
const route = useRoute();
const router = useRouter();

const fetched = ref(false);
const center_key = ref("");

const player = computed<any>(() => store.state.builder.worlds.player);


onMounted(async () => {
  await store.dispatch("builder/worlds/player_fetch", {
    world_id: route.params.world_id,
    player_id: route.params.player_id,
  });
  fetched.value = true;
  center_key.value = player.value.room.key;
});

const editInfo = () => {
  const entity = player.value;
  const modal = {
    title: `Item Template ${entity.id}`,
    data: entity,
    schema: [
      {
        attr: "is_immortal",
        label: "Is Builder",
        widget: "checkbox",
      },
    ],
    action: "builder/worlds/player_set",
  };
  store.commit('ui/modal/open_form', modal);
};

const deletePlayer = async () => {
  const c = confirm(`Are you sure you want to delete Player ${player.value.id}?`);
  if (!c) return;

  await store.dispatch("builder/worlds/player_delete");
  router.push({
    name: 'builder_world_player_list',
    params: {
      world_id: route.params.world_id,
    },
  });
};

const resetPlayer = async () => {
  const c = confirm(
    `Are you sure you want to reset Player ${player.value.id}? This will erase all of their progress`
  );
  if (!c) return;

  await store.dispatch("builder/worlds/player_reset");
  router.push({
    name: 'builder_world_player_list',
    params: {
      world_id: route.params.world_id,
    },
  });
};

const onMapClickRoom = (room) => {
  const index = player_rooms.value.findIndex((_room) => room.key == _room.key);
  if (index !== -1) center_key.value = room.key;
};

const player_rooms = computed(() => {
  const viewed_rooms = player.value.viewed_rooms;
  const player_map = {};
  const player_rooms: Room[] = [];
  for (const namespaced_key of viewed_rooms) {
    const [, room_key] = namespaced_key.split(":");
    const room_data = store.state.builder.map[room_key];
    player_map[room_key] = room_data;
    player_rooms.push(room_data);
  }

  if (
    player_rooms.findIndex((_room) => player.value.room.key == _room.key) !== 1
  )
    player_rooms.push(player.value.room);

  return player_rooms;
});


const user_page = (player) => {
  return {
    name: 'staff_user_info',
    params: {
      user_id: player.animation_data.user_id,
    },
  };
};
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

#builder-player-detail {
  h3 {
    margin-top: 20px;
    text-transform: uppercase;
  }

  flex-grow: 1;

  .data-and-map {
    display: flex;

    flex-direction: column;
    @media ($desktop-site) {
      flex-direction: row;
    }

    > div {
      flex: 1;
      flex-grow: 1;
    }

    .player-map {
      .player-room {
        margin-bottom: 20px;
      }
    }
  }
}
</style>