<template>
  <div id="world-config" class="builder-config" v-if="store.state.builder.world.builder_info.builder_rank > 2">
    <h2>{{ world.name.toUpperCase() }} CONFIG</h2>

    <div class="general-settings mt-6">
      <!-- <h3>GENERAL SETTINGS</h3> -->

      <div class="color-text-60">
        <span v-if="world.is_public">Public</span><span v-else>Private</span> World
      </div>

      <div class="color-text-60 mb-6">Publication Status: {{ review_status }} <Help :help="review_help" v-if="review_help"/></div>
      <div class="review-details" v-if="review_status == 'Reviewed'">
        <div class="reviewer color-text-60 mb-2">Comments by {{ review.reviewer }}:</div>
        <div class="review-text mb-4">
          <div class="review-line min-line-height"
              v-for="(line, index) in review.text.split('\n')"
              :key="index">{{ line }}</div>
          </div>
      </div>

      <div v-if="world.description" class="world-description">
        <div class="desc-line" v-for="(line, index) of descLines" :key="index">{{ line }}</div>
      </div>

      <div class="settings-actions mt-4">
        <button class="btn-small mr-4" @click="editGeneral">EDIT</button>
        <button class="btn-small" @click="deleteWorld">DELETE</button>
        <button class="btn-small ml-4" @click="submitForReview" v-if="displaySubmitReview">SUBMIT FOR REVIEW</button>
      </div>
    </div>

    <div class="divider"></div>

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
            <li>
              Game
              <template v-if="!config.is_narrative">
                allows combat, pvp mode is
                <span v-if="config.pvp_mode === 'free_for_all'">Free for All.</span>
                <span v-else-if="config.pvp_mode === 'zone'">PvP Zones.</span>
                <span v-else>Disabled.</span>
              </template>
              <template v-else>is a narrative world, does not allow combat.</template>
            </li>

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
        <h3>World Admin</h3>

        <div>View connected players, start/stop multiplayer worlds.</div>

        <router-link :to="world_admin_link">manage</router-link>
      </div>

      <div class="random-profiles" v-if="!world.instance_of.id">
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
          :to="{name: 'builder_world_random_profile_list', params: {world_id: $route.params.world_id}}"
        >manage</router-link>
      </div>

      <div class="transformation-templates" v-if="!world.instance_of.id">
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
          :to="{name: 'builder_world_transformation_template_list', params: {world_id: $route.params.world_id}}"
        >manage</router-link>
      </div>

      <div class="world-builders" v-if="!world.instance_of.id">
        <h3>World Builders</h3>

        <div>Builders are able to access the editor for a given world. They can be given read-only access.</div>

        <router-link
          :to="{name: 'builder_world_builder_list', params: {world_id: $route.params.world_id}}"
        >manage</router-link>
      </div>

      <div class="world-players" v-if="!world.instance_of.id">
        <h3>World Players</h3>

        <div>View information about players in your world.</div>

        <router-link
          :to="{name: 'builder_world_player_list', params: {world_id: $route.params.world_id}}"
        >manage</router-link>
      </div>

      <div class="world-factions" v-if="!world.instance_of.id">
        <h3>Worlds Factions</h3>

        <div>View information about factions in your world.</div>

        <router-link :to="world_factions_link">manage</router-link>
      </div>

      <div class="world-facts">
        <h3>Worlds Facts</h3>

        <div>Facts are data points about your world that can be set by builders, mobs and a fact schedule. Conditions can then look at those facts to determine which loaders, room actions, quests and reactions should be considered active.</div>

        <router-link :to="world_facts_link">manage</router-link>
      </div>

      <div class='world-skills' v-if="!world.instance_of.id">
        <h3>Custom Skills</h3>

        <div>Builders can create skills, usable by players and mobs that do not have an archetype. To enable the creation of players that do not have an archetype, check the "Classless Players" checkbox under Advanced Config.</div>

        <router-link :to="world_skills_link">manage</router-link>
      </div>

      <div class="world-starting-eq" v-if="!world.instance_of.id">
        <h3>Starting EQ</h3>

        <div>Define the items that a player starts with.</div>

        <router-link :to="world_starting_eq_link">manage</router-link>
      </div>

      <div class="world-socials" v-if="!world.instance_of.id">
        <h3>SOCIALS</h3>
        <div>Socials are custom commands defined by builders that players and mobs can use to emote in a standardized way. Example typical socials: nod, shrug, wave, smile, laugh, sigh, shake, slap.</div>

        <router-link :to="world_socials_link">manage</router-link>
      </div>

      <div class="world-name-exclusions" v-if="!world.instance_of.id">
        <h3>NAME EXCLUSIONS</h3>

        <div>Exclude certain names available to players at character creation.</div>
        <button class="btn-thin" @click="editNameExclusions">EDIT</button>
      </div>

      <div class="world-currencies" v-if="!world.instance_of.id">
        <h3>CURRENCIES</h3>

        <div>Define the currencies that players can use in your world.</div>

        <router-link
          :to="{name: 'builder_world_currency_list', params: {world_id: $route.params.world_id}}"
        >manage</router-link>
      </div>
    </div>

    <div class="instances" v-if="!world.instance_of.id">
      <div class="divider"></div>
      <h3 class='mb-8'>INSTANCES</h3>

      <p>An instance is a unique, isolated version of a game area or dungeon that a player or group can enter, allowing for a private experience separate from other players in the world.</p>

      <p>Note: Instances are currently in Alpha, proceed with caution.</p>

      <div class='my-8'>
        <button class="btn-small" @click="createInstance">CREATE INSTANCE</button>
      </div>

      <div v-for="instance in store.state.builder.worlds.instances" :key="instance.id" :instance="instance" class="mb-8">
        <a :href="instanceLink(instance.id)">{{ instance.name }}</a>
      </div>
    </div>
  </div>
  <div v-else>
    <p>You do not have permission to configure this world.</p>

    <p v-if="store.state.builder.world.builder_info.builder_assignments.length">Entites assigned to you:</p>
    <ul class='ml-4'>
      <li v-for="assignment in store.state.builder.world.builder_info.builder_assignments" :key="assignment.id">
        <router-link :to="assignment_link(assignment)">
          {{ assignment.name }}
        </router-link>
      </li>
    </ul>

  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute, RouteLocationRaw } from 'vue-router';
import { capfirst } from "@/core/utils.ts";
import Help from "@/components/Help.vue";
import { BUILDER_FORMS, FormElement } from "@/core/forms";
import ReviewInstructions from "@/components/builder/world/ReviewInstructions.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();

const world = computed(() => store.state.builder.world);
console.log(world.value);
const config = computed(() => store.state.builder.worlds.config);

const room_link = (id: number) => {
  return {
    name: 'builder_room_index',
    params: {
      world_id: world.value.id,
      room_id: id,
    },
  };
};

onMounted(async () => {
  store.commit("builder/worlds/config_clear");

  // Convert each call into a promise and then call both at once

  const config_promise = store.dispatch("builder/worlds/config_fetch", {
    world_id: world.value.id,
  });

  const instances_promise = store.dispatch("builder/worlds/instances_fetch", {
    world_id: world.value.id,
  });

  await Promise.all([config_promise, instances_promise]);

});

const editGeneral = () => {

  const description = {
    ...BUILDER_FORMS.DESCRIPTION,
    help: `The description of the world as it will displayed to all players in the world's Lobby.`,
  };

  const modal = {
    title: `Edit World`,
    data: world.value,
    schema: [
      BUILDER_FORMS.NAME,
      description,
      {
        attr: "motd",
        label: "Message of the Day",
        widget: "textarea",
        help: `A message that will be displayed to players when they enter the world.`,
      },
      {
        attr: "is_public",
        label: "Is Public",
        widget: "checkbox",
        help: `A public world is visible and searchable to all players. A private world is only visible to players who have been given access to it.`,
      },
    ],
    action: "builder/world_save",
  };
  store.commit('ui/modal/open_form', modal);
};

const editAdvancedConfig = () => {
  const starting_gold: FormElement = {
    attr: "starting_gold",
    label: "Starting Gold",
  };
  const death_room: FormElement = {
    attr: "death_room",
    label: "Death Room",
    widget: "reference",
    references: "room",
    required: true,
  };
  const starting_room: FormElement = {
    attr: "starting_room",
    label: "Starting Room",
    widget: "reference",
    references: "room",
    required: true,
    help: `Which room a new player starts in by default.<br/><br/>
            A starting room can also be defined at the Faction level,
            which will take precendence over this default starting room.`,
  };
  const death_mode: FormElement = {
    attr: "death_mode",
    label: "Death EQ Loss",
    widget: "select",
    options: [
      {
        value: "lose_all",
        label: "Lose All",
      },
      {
        value: "lose_none",
        label: "Lose None",
      },
      {
        value: "lose_gold",
        label: "Lose Gold",
      },
      {
        value: "lose_inv",
        label: "Lose Inventory",
      },
      {
        value: "destroy_eq",
        label: "Destroy Equipped Items",
      },
    ],
    help: `Determines what happens to the player's equipment on death.<br/><br/>
            Lose None: player retains all of their equipment<br/>
            Lose All: all of the player's equipment goes to their corpse<br/>
            Lose Gold: player pays 20% of their equipment's value on death<br/>
            Lose Inventory: all of the player's inventory goes to their corpse<br/>
            Destroy Equipped Items: all equipped items are destroyed on death. Not for the faint of heart.`,
  };
  const built_by: FormElement = {
    attr: "built_by",
    label: "Built By",
    help: `What to show in the 'built by' field of the World Lobby. If missing, will default to the author's username.`,
  };
  const death_route: FormElement = {
    attr: "death_route",
    label: "Death Route",
    widget: "select",
    options: [
      {
        value: "top_faction",
        label: "Top Faction",
      },
      {
        value: "near_room",
        label: "Nearest Room",
      },
      {
        value: "far_room",
        label: "Furthest Room",
      },
      {
        value: "nearest_in_zone",
        label: "Nearest in Zone",
      },
    ],
    help: `Where players go on death.<br/><br/>
            Top Faction: the nearest procession room of the faction you have highest standing with.<br/>
            Nearest Room: the procession room nearest where you died.<br/>
            Furthest Room: the procession room furthest from where you died.<br/>
            Nearest in Zone: the procession room closest to you in your current zone.`,
  };
  const auto_equip: FormElement = {
    attr: "auto_equip",
    label: "Auto Equip Items",
    widget: "checkbox",
    help: `If checked, items acquired to the player's inventory will
            automatically equip if the corresponding slot is empty.`,
  };

  const pvp_mode: FormElement = {
    attr: "pvp_mode",
    label: "PvP Mode",
    widget: "select",
    options: [
      {
        value: "free_for_all",
        label: "Free for All",
      },
      {
        value: "disabled",
        label: "Disabled",
      },
      {
        value: "zone",
        label: "PvP Zones",
      },
    ],
    help: `In multiplayer worlds, to what extent PvP is allowed.<br/><br/>
          Free for All - anyone can attack anyone else, unless in a peace room.<br/>
          Disabled - no player can attack another player, ever.<br/>
          PvP Zones - default is no PvP but certain zones can enable it.<br/>
    `,
  };
  const can_select_faction: FormElement = {
    attr: "can_select_faction",
    label: "Can Select Core Faction",
    widget: "checkbox",
    help: `If unchecked, all players will always start with the default core faction.`,
  };
  const allow_combat: FormElement = {
    attr: "is_narrative",
    label: "Narrative World",
    widget: "checkbox",
    help: `A narrative world disables combat, and will not show combat-related UI elements.`,
  };
  const players_can_set_title: FormElement = {
    attr: "players_can_set_title",
    label: "Players Can Set Title",
    widget: "checkbox",
    help: `Whether players are allowed to change their own title.`,
  };
  const small_background: FormElement = {
    attr: "small_background",
    label: "740 x 332 Card URL",
    help: `Image displayed in the general lobby`,
  };
  const large_background: FormElement = {
    attr: "large_background",
    label: "2300 x 598 Banner URL",
    help: `Image displayed in the world lobby`,
  };
  const is_classless: FormElement = {
    attr: "is_classless",
    label: "Classless Players",
    widget: "checkbox",
    help: `If this option is checked, no player will have a starting archetype, or its associated skills. Builders will have to create all the skills that players can learn.`
  };
  const non_ascii_names: FormElement = {
    attr: "non_ascii_names",
    label: "Allow Non-ASCII Names",
    widget: "checkbox",
    help: `If this option is checked, players will be able to use non-ASCII characters in their names.`
  };
  const globals_enabled: FormElement = {
    attr: "globals_enabled",
    label: "Enable Channels",
    widget: "checkbox",
    help: `If this option is checked, players will be able to use global communication channels (chat, gossip, clan chat).`,
  };

  const modal = {
      title: `Edit World Config`,
      data: config.value,
      schema: [
        {
          children: [starting_gold, starting_room],
        },
        {
          children: [death_mode, death_room],
        },
        {
          children: [pvp_mode, death_route],
        },
        {
          children: [allow_combat, auto_equip],
        },
        {
          children: [can_select_faction, players_can_set_title],
        },
        {
          children: [is_classless, non_ascii_names]
        },
        {
          children: [globals_enabled],
        },
        {
          children: [small_background, large_background],
        },
        built_by,
      ],
      action: "builder/worlds/config_save",
    };
    store.commit('ui/modal/open_form', modal);
};

const editNameExclusions = () => {
  const modal = {
    class: "description-modal",
    data: config.value,
    schema: [
      {
        attr: 'name_exclusions',
        label: 'Name Exclusions',
        widget: 'textarea',
        help: `A list of names that are not allowed to be used by players in this world. One name per line.`
      }
    ],
    action: "builder/worlds/config_patch",
  };
  store.commit('ui/modal/open_form', modal);
};

const createInstance = () => {
  const modal = {
    title: 'Create Instance',
    data: {
      'name': 'Unnamed Instance',
      'instance_of': world.value.id,
    },
    submitLabel: 'CREATE INSTANCE',
    schema: [
      {
        attr: 'name',
        label: 'Name',
        help: `The name of the instance.`
      },
    ],
    action: 'builder/worlds/instance_create',
  }
  store.commit('ui/modal/open_form', modal);
};

const submitForReview = () => {
  const modal = {
    title: 'Submit For Review',
    data: { 'description': '' },
    submitLabel: 'SUBMIT',
    schema: [
      {
        attr: 'description',
        label: 'Description',
        widget: 'textarea',
        help: `Describe your world to the reviewer.`
      }
    ],
    action: "builder/worlds/submit_world_for_review",
    slot: ReviewInstructions,
  };
  store.commit('ui/modal/open_form', modal);
}

const deleteWorld = async () => {
  const world_id = world.value.id;

  // Crude confirm dialog
  const c = confirm(`Are you sure you want to delete this world and everything in it? This action cannot be undone.`);
  if (!c) return;

  await store.dispatch('builder/world_delete');
  store.commit('ui/notification_set', `Deleted World ${world_id}`);
  router.push({ name: 'lobby' });
};

const world_admin_link = {
  name: 'builder_world_admin',
  params: { world_id: world.value.id },
};

const world_factions_link = {
  name: 'builder_world_faction_list',
  params: { world_id: world.value.id },
};

const world_facts_link = {
  name: 'builder_world_fact_list',
  params: { world_id: world.value.id },
};

const world_skills_link = {
  name: 'builder_world_skill_list',
  params: { world_id: world.value.id },
};

const world_starting_eq_link = {
  name: 'builder_world_starting_eq_list',
  params: { world_id: world.value.id },
};

const world_socials_link = {
  name: 'builder_world_social_list',
  params: { world_id: world.value.id },
};

const descLines = computed(() => world.value.description.split("\n"));
const displaySubmitReview = computed(() => world.value.review.status === "unsubmitted" || world.value.review.status == "reviewed");
const review = computed(() => world.value.review);

const review_status = computed(() => {
  if (world.value.review.status === 'unsubmitted') {
    return 'Unpublished';
  } else if (world.value.review.status === 'submitted') {
    return 'Under Review';
  } else if (world.value.review.status === 'reviewed') {
    return 'Reviewed';
  } else if (world.value.review.status === 'approved') {
    return 'Published';
  }
  return capfirst(world.value.review.status);
});

const review_help = computed(() => {
  if (world.value.review.status === 'unsubmitted') {
    return `A world that's been approved for publication will be featured in curated sections of the site. To initiate a review, click the SUBMIT FOR REVIEW action.`;
  } else if (world.value.review.status === 'submitted') {
    return `Your review has been submitted. Once a staff member reviews it, it will either be approved or you will receive feedback on what to change.`;
  } else if (world.value.review.status === 'reviewed') {
    return `Your world has been reviewed but is not quite ready for primetime yet. Read the reviewer's notes and re-submit it once you're ready.`;
  }
  return '';
});

const instanceLink = (instance_id) => {
  return router.resolve({
    name: 'builder_world_index',
    params: { world_id: instance_id }
  }).href;
};

const assignment_link = (assignment) => {
  if (assignment.model_type === 'room') {
    return {
      name: 'builder_room_index',
      params: {
        world_id: route.params.world_id,
        room_id: assignment.id
      }
    } as RouteLocationRaw;
  } else if (assignment.model_type === 'itemtemplate') {
    return {
      name: 'builder_item_template_details',
      params: {
        world_id: route.params.world_id,
        item_template_id: assignment.id
      }
    } as RouteLocationRaw;
  } else if (assignment.model_type === 'mobtemplate') {
    return {
      name: 'builder_mob_template_details',
      params: {
        world_id: route.params.world_id,
        mob_template_id: assignment.id
      }
    } as RouteLocationRaw;
  }
  // Assume it's a zone
  return {
    name: 'builder_zone_index',
    params: {
      world_id: route.params.world_id,
      zone_id: assignment.id
    }
  } as RouteLocationRaw;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";

.world-description {
  div.desc-line:not(:last-child) {
    margin-bottom: 0.8em;
  }
}


.review-details {
  .review-text {
    border: 1px solid $color-background-light-border;
    padding: 15px;
  }
}

.divider {
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>