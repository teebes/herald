<template>
  <div id="world-config">
    <h2>WORLD CONFIG</h2>

    <div class="general-settings">
      <h3>GENERAL SETTINGS</h3>

      <div v-if="world.description">{{ world.description }}</div>

      <div class="settings-actions mt-4">
        <button class="btn-small mr-4" @click="editGeneral">EDIT</button>
        <button class="btn-small" @click="deleteWorld">DELETE</button>
      </div>
    </div>

    <div class="config-panels">
      <div class="advanced-config">
        <h3>ADVANCED CONFIG</h3>
        <template v-if="config">
          <div>New characters will enter the game with {{ config.starting_gold }} gold.</div>
          <div>
            When dying, characters will be taken to
            <router-link :to="death_room_link">{{ config.death_room.name }}</router-link>.
          </div>
          <button class="btn-thin" @click="editAdvancedConfig">EDIT</button>
        </template>
      </div>

      <div class="random-profiles">
        <h3>RANDOM ITEM PROFILES</h3>

        <div>
          <p>Random Item Profiles offer a way to define a random load. Use cases include:</p>
          <ul>
            <li>Equipping a mob with random gear</li>
            <li>Giving a random item reward on completing a quest</li>
            <li>Merchants with random sales inventory</li>
          </ul>
        </div>

        <router-link
          :to="{name: BUILDER_WORLD_RANDOM_PROFILES, params: {world_id: $route.params.world_id}}"
        >manage</router-link>
      </div>

      <div class="transformation-templates">
        <h3>Transformations</h3>

        <div>
          <p>Transformations can be applied to the output of a loader rule to modify a loaded template. Use cases include:</p>
          <ul>
            <li>Making a mob roam 100% of the time on tic rather than the default 5%</li>
            <li>Force a mob to roam in a particular direction</li>
            <li>Change the name of a mob when it loads</li>
            <li>Make any other one-off modification to a template for a loaded mob.</li>
          </ul>
        </div>

        <router-link
          :to="{name: BUILDER_WORLD_TRANSFORMATION_TEMPLATE_LIST, params: {world_id: $route.params.world_id}}"
        >manage</router-link>
      </div>

      <div class="world-builders">
        <h3>World Builders</h3>

        <div>Builders are able to access the editor for a given world. They can be given read-only access.</div>
        <div>In order to add a user as a builder, they must have created a character in your game.</div>

        <router-link
          :to="{name: BUILDER_WORLD_BUILDERS, params: {world_id: $route.params.world_id}}"
        >manage</router-link>
      </div>

      <div class="world-players">
        <h3>World Players</h3>

        <div>View information about players in your world.</div>

        <router-link
          :to="{name: BUILDER_WORLD_PLAYER_LIST, params: {world_id: $route.params.world_id}}"
        >manage</router-link>
      </div>

      <div class='world-factions'>
        <h3>Worlds Factions</h3>

        <div>View information about factions in your world.</div>

        <router-link :to="world_factions_link">manage</router-link>
      </div>      

      <div class="world-status">
        <h3>World Status</h3>

        <div>View connected players, start/stop multilpayer worlds.</div>

        <router-link :to="world_status_link">manage</router-link>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import {
  BUILDER_WORLD_RANDOM_PROFILES,
  BUILDER_WORLD_TRANSFORMATION_TEMPLATE_LIST,
  BUILDER_WORLD_BUILDERS,
  BUILDER_WORLD_PLAYER_LIST,
  BUILDER_ROOM_INDEX,
  BUILDER_WORLD_STATUS,
  BUILDER_WORLD_FACTIONS,
  LOBBY,
} from "@/router";
import { BUILDER_FORMS } from "@/core/forms";
import { UI_MUTATIONS } from "@/constants";
import WorldView from "@/components/builder/WorldView.ts";

@Component({
  components: {
    ElementList
  }
})
export default class WorldFrame extends Mixins(WorldView) {
  BUILDER_WORLD_RANDOM_PROFILES = BUILDER_WORLD_RANDOM_PROFILES;
  BUILDER_WORLD_TRANSFORMATION_TEMPLATE_LIST = BUILDER_WORLD_TRANSFORMATION_TEMPLATE_LIST;
  BUILDER_WORLD_BUILDERS = BUILDER_WORLD_BUILDERS;
  BUILDER_WORLD_PLAYER_LIST = BUILDER_WORLD_PLAYER_LIST;

  get death_room_link() {
    return {
      name: BUILDER_ROOM_INDEX,
      params: {
        world_id: this.world.id,
        room_id: this.config.death_room.id
      }
    };
  }

  get config() {
    return this.$store.state.builder.worlds.config;
  }

  get world() {
    return this.$store.state.builder.world;
  }

  async editGeneral() {
    const modal = {
      title: `Edit World`,
      data: this.world,
      schema: [
        BUILDER_FORMS.NAME,
        BUILDER_FORMS.DESCRIPTION,
        {
          attr: "is_public",
          label: "Is Public",
          widget: "checkbox"
        }
      ],
      action: "builder/world_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  async fetch() {
    this.$store.commit("builder/worlds/config_clear");
    await this.$store.dispatch("builder/worlds/config_fetch", {
      world_id: this.world.id
    });
  }

  async editAdvancedConfig() {
    const modal = {
      title: `Edit World Config`,
      data: this.config,
      schema: [
        {
          attr: "starting_gold",
          label: "Stating Gold"
        },
        {
          attr: "death_room",
          label: "Death Room",
          widget: "reference",
          references: "room",
          required: true
        }
      ],
      action: "builder/worlds/config_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  async deleteWorld() {
    const world_id = this.world.id;

    // Crude confirm dialog
    const c = confirm(
      `Are you sure you want to delete this world and everything in it? This action cannot be undone.`
    );
    if (!c) return;

    await this.$store.dispatch("builder/world_delete");
    this.$store.commit(
      UI_MUTATIONS.SET_NOTIFICATION,
      `Deleted World ${world_id}`
    );
    this.$router.push({ name: LOBBY });
  }

  get world_status_link() {
    return {
      name: BUILDER_WORLD_STATUS,
      params: { world_id: this.world.id }
    };
  }

  get world_factions_link() {
    return {
      name: BUILDER_WORLD_FACTIONS,
      params: { world_id: this.world.id }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";
#world-config {
  h3 {
    text-transform: uppercase;
    margin: 30px 0 10px 0;
  }
  .config-panels {
    display: flex;
    flex-wrap: wrap;

    @media ($desktop-site) {
      > div {
        flex-basis: 50%;
        &:nth-child(odd) {
          padding-right: 15px;
        }
        &:nth-child(even) {
          padding-left: 15px;
        }
      }
    }
  }
}
</style>