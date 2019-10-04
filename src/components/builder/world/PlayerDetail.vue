<template>
  <div id="builder-player-detail" v-if="fetched">
    <h2 class="entity-title">{{ player.name }}</h2>

    <div>Level {{ player.level }} {{ player.archetype }}</div>
    <div v-if="player.title">Title: {{ player.title }}</div>
    <div v-if="player.is_immortal">This is a builder character.</div>
    <div>Spawn world details: {{ player.world.id }} ({{ player.world.state }})</div>

    <div class="mt-4">
      <button class="btn-small" @click="editInfo">EDIT INFO</button>
      <button
        class="btn-small ml-4"
        @click="resetPlayer"
        v-if="!$store.state.builder.world.is_multiplayer"
      >RESET</button>
      <button class="btn-small ml-4" @click="deletePlayer">DELETE</button>
    </div>

    <div class="data-and-map">
      <div class="player-data">
        <div class="instance-details" v-if="!$store.state.builder.world.is_multiplayer">
          <h3>Instance Details</h3>
          <div>Mob count: {{ player.instance_details.mob_count }}</div>
          <div>Item count: {{ player.instance_details.item_count }}</div>
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
      </div>

      <div class="player-map">
        <h3>Map</h3>
        <div class="player-room">{{ player.room.name }}</div>
        <Map
          :map="$store.state.builder.map"
          :rooms_filter="player_rooms"
          :center_key="center_key"
          :unit="8"
          :radius="4"
          :display_planes="false"
          @clickRoom="onMapClickRoom"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import WorldView from "@/components/builder/WorldView.ts";
import Map from "@/components/Map.vue";
import { Room } from "@/core/interfaces.ts";
import { EQUIPMENT_SLOT_LIST } from "@/constants";
import { BUILDER_WORLD_PLAYER_LIST } from "@/router";
import { UI_MUTATIONS } from "@/constants";

@Component({
  components: {
    Map
  }
})
export default class PlayerDetail extends Mixins(WorldView) {
  fetched: Boolean = false;
  center_key: string = "";
  EQUIPMENT_SLOT_LIST = EQUIPMENT_SLOT_LIST;

  get player() {
    return this.$store.state.builder.worlds.player;
  }

  async activated() {
    const player = await this.$store.dispatch("builder/worlds/player_fetch", {
      world_id: this.$route.params.world_id,
      player_id: this.$route.params.player_id
    });
    this.fetched = true;
    this.center_key = player.room.key;
  }

  editInfo() {
    const entity = this.player;
    const modal = {
      title: `Item Template ${entity.id}`,
      data: entity,
      schema: [
        {
          attr: "is_immortal",
          label: "Is Builder",
          widget: "checkbox"
        }
      ],
      action: "builder/worlds/player_set"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  async deletePlayer() {
    const c = confirm(
      `Are you sure you want to delete Player ${this.player.id}?`
    );
    if (!c) return;

    await this.$store.dispatch("builder/worlds/player_delete");
    this.$router.push({
      name: BUILDER_WORLD_PLAYER_LIST,
      params: {
        world_id: this.$route.params.world_id
      }
    });
  }

  async resetPlayer() {
    const c = confirm(
      `Are you sure you want to reset Player ${this.player.id}? This will erase all of their progress`
    );
    if (!c) return;

    await this.$store.dispatch("builder/worlds/player_reset");
    // this.$router.push({
    //   name: BUILDER_WORLD_PLAYER_LIST,
    //   params: {
    //     world_id: this.$route.params.world_id
    //   }
    // });
  }

  get player_list_link() {
    return {
      name: BUILDER_WORLD_PLAYER_LIST,
      params: {
        world_id: this.$route.params.world_id
      }
    };
  }

  onMapClickRoom(room) {
    const index = this.player_rooms.findIndex(_room => room.key == _room.key);
    if (index !== -1) this.center_key = room.key;
  }

  get player_rooms() {
    // viewed_rooms looks like this: ["@2:room.1", ... ]
    const viewed_rooms = this.player.viewed_rooms;
    const player_map = {};
    const player_rooms: Room[] = [];
    for (const namespaced_key of viewed_rooms) {
      const [world_id, room_key] = namespaced_key.split(":");
      const room_data = this.$store.state.builder.map[room_key];
      player_map[room_key] = room_data;
      player_rooms.push(room_data);
    }

    if (
      player_rooms.findIndex(_room => this.player.room.key == _room.key) !== 1
    )
      player_rooms.push(this.player.room);

    return player_rooms;
  }
}
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