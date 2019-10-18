<template>
  <div id="world-config" class="builder-config">
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
          <ul class="list">
            <li>New characters will enter the game with {{ config.starting_gold }} gold.</li>

            <li>
              New characters will enter the game in
              <router-link :to="room_link(config.starting_room.id)">{{ config.starting_room.name }}</router-link>.
            </li>

            <li>
              On death, player will be taken to
              <router-link :to="room_link(config.death_room.id)">{{ config.death_room.name }}</router-link>.
            </li>

            <!-- <li>
              On death, player's equipment will
              <template v-if="config.death_mode == 'lose_none'">not</template> transfer to his corpse.
            </li>-->

            <!-- <li>
              Players
              <template v-if="!config.auto_equip">do not</template> automatically wear equipment in available slots.
            </li>

            <li>
              Players can
              <template v-if="config.can_select_faction">not</template> select their starting core faction.
            </li>

            <li>
              Players can
              <template v-if="config.players_can_set_title">not</template> set their own titles.
            </li>-->

            <li>
              Game
              <template v-if="config.allow_combat">
                allows combat
                <template v-if="config.allow_pvp">and PvP</template>.
              </template>
              <template v-else>does not allow combat.</template>
            </li>

            <!-- Consider adding to display:
          built_by
          death_route
            -->

            <li v-if="config.small_background || config.large_background">
              <div v-if="config.small_background">
                General Lobby art:
                <a
                  :href="config.small_background"
                  v-if="config.small_background.startsWith('http')"
                >link</a>
                <span v-else>{{ config.small_background }}</span>
              </div>
              <div v-if="config.large_background">
                World Lobby art:
                <a
                  :href="config.large_background"
                  v-if="config.large_background.startsWith('http')"
                >link</a>
                <span v-else>{{ config.large_background }}</span>
              </div>
            </li>
          </ul>

          <button class="btn-thin" @click="editAdvancedConfig">EDIT</button>
        </template>
      </div>

      <div class="world-status">
        <h3>World Status</h3>

        <div>View connected players, start/stop multilpayer worlds.</div>

        <router-link :to="world_status_link">manage</router-link>
      </div>

      <div class="random-profiles">
        <h3>RANDOM ITEM PROFILES</h3>

        <div>
          <p>Random Item Profiles offer a way to define a random load. Use cases include:</p>
          <ul class="list">
            <!-- <li>Equipping a mob with random gear</li> -->
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
          <ul class="list">
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

      <div class="world-factions">
        <h3>Worlds Factions</h3>

        <div>View information about factions in your world.</div>

        <router-link :to="world_factions_link">manage</router-link>
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
  LOBBY
} from "@/router";
import { BUILDER_FORMS, FormElement } from "@/core/forms";
import { UI_MUTATIONS } from "@/constants";
import WorldView from "@/components/builder/world/WorldView.ts";

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

  room_link(id) {
    return {
      name: BUILDER_ROOM_INDEX,
      params: {
        world_id: this.world.id,
        room_id: id
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
    const starting_gold: FormElement = {
      attr: "starting_gold",
      label: "Starting Gold"
    };
    const death_room: FormElement = {
      attr: "death_room",
      label: "Death Room",
      widget: "reference",
      references: "room",
      required: true
    };
    const starting_room: FormElement = {
      attr: "starting_room",
      label: "Starting Room",
      widget: "reference",
      references: "room",
      required: true,
      help: `Which room a new player starts in by default.<br/><br/>
             A starting room can also be defined at the Faction level, 
             which will take precendence over this default starting room.`
    };
    const death_mode: FormElement = {
      attr: "death_mode",
      label: "Death EQ Loss",
      widget: "select",
      options: [
        {
          value: "lose_all",
          label: "Lose All"
        },
        {
          value: "lose_none",
          label: "Lose None"
        }
      ],
      help: `Determines what happens to the player's equipment on death.<br/><br/>
             Lose None: player retains all of their equipment<br/>
             Lose All: all of the player's equipment goes to their corpse`
    };
    const built_by: FormElement = {
      attr: "built_by",
      label: "Built By",
      help: `What to show in the 'built by' field of the World Lobby. If missing, will default to the author's username.`
    };
    const death_route: FormElement = {
      attr: "death_route",
      label: "Death Route",
      widget: "select",
      options: [
        {
          value: "top_faction",
          label: "Top Faction"
        },
        {
          value: "near_room",
          label: "Near Room"
        },
        {
          value: "far_room",
          label: "Far Room"
        }
      ],
      help: `Where to go on death.<br/><br/>
             Top Faction: The death room of the faction you have highest standing with.<br/>
             Near Room: The death room nearest where you died.<br/>
             Far Room: the death room furthest from where you died.`
    };
    const auto_equip: FormElement = {
      attr: "auto_equip",
      label: "Auto Equip Items",
      widget: "checkbox",
      help: `If checked, items acquired to the player's inventory will
             automatically equip if the corresponding slot is empty.`
    };
    const allow_pvp: FormElement = {
      attr: "allow_pvp",
      label: "Allow PvP",
      widget: "checkbox",
      help: `If checked, players can kill other players.`
    };
    const can_select_faction: FormElement = {
      attr: "can_select_faction",
      label: "Can Select Core Faction",
      widget: "checkbox",
      help: `If unchecked, all players will always start with the default core faction.`
    };
    const allow_combat: FormElement = {
      attr: "allow_combat",
      label: "Allow Combat",
      widget: "checkbox",
      help: `A world without combat allowed will disable all kill commands, 
             combat skills, and will not show combat-related UI elements.`
    };
    const players_can_set_title: FormElement = {
      attr: "players_can_set_title",
      label: "Players Can Set Title",
      widget: "checkbox",
      help: `Whether players are allowed to change their own title.`
    };
    const small_background: FormElement = {
      attr: "small_background",
      label: "740 x 332 Card URL",
      help: `Image displayed in the general lobby`
    };
    const large_background: FormElement = {
      attr: "large_background",
      label: "2300 x 598 Banner URL",
      help: `Image displayed in the world lobby`
    };

    const modal = {
      title: `Edit World Config`,
      data: this.config,
      schema: [
        {
          children: [starting_gold, death_mode]
        },
        {
          children: [starting_room, death_room]
        },
        {
          children: [built_by, death_route]
        },
        {
          children: [auto_equip, allow_pvp]
        },
        {
          children: [can_select_faction, allow_combat]
        },
        players_can_set_title,
        // { children: [players_can_set_title, death_route] },
        {
          children: [small_background, large_background]
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
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";
</style>