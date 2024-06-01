<template>
  <div id="sidebar">
    <!-- Quest Log -->
    <div class="sidebar-element logs">
      <h3>LOGS</h3>
      <div class="mt-4">
        <button class="btn-small mb-1 button-gray" @click="onClickQuestLog">QUEST LOG</button>
        <button class="btn-small button-gray" @click="onClickCommunicationLog" v-if="world.is_multiplayer">COMMUNICATION LOG</button>
      </div>
    </div>

    <!-- Focus -->
    <div class="sidebar-element focus" v-if="allow_combat">
      <h3>
        FOCUS
        <Help :help="focus_help" />
      </h3>
      <Focus class="mt-2" />
    </div>

    <!-- Who list -->
    <div class="sidebar-element who-list" v-if="world.is_multiplayer">
      <h3 v-if="who_list && who_list['players']" @click="onClickExpand('who')" class="hover">
        <span v-if="expanded === 'who'">-</span>
        <span v-else>+</span>
        {{ who_list["players"].length }}
        <template
          v-if="who_list['players'].length == 1"
        >player</template>
        <template v-else>players</template>
        in world
      </h3>
      <div v-if="expanded === 'who'" class="who-list-detail">
        <div
          v-for="player in who_list.players"
          :key="player.key"
          class='hover'
          :class="{ 'color-secondary': player.name_recognition, 'color-primary': player.is_immortal }"
          @click="onClickWhoPlayer(player)"
        >
          {{ player.name }} {{ player.title }}
          <span v-if="player.is_idle" class='ml-1 color-text-50'>(Idle)</span>

        </div>
      </div>
    </div>

    <!-- Flex Skills -->
    <div class="sidebar-element flex-skills" v-if="allow_combat && player_flex_skills_info.learnable_count">
      <h3 @click="onClickExpand('skills')" class="hover">
        <span v-if="expanded === 'skills'">-</span>
        <span v-else>+</span>
        FLEX SKILLS
        <Help :help="flex_skills_help" />
      </h3>
      <div v-if="expanded === 'skills'" class="my-1">
        <div
          v-for="skill in player_flex_skills_info.skills"
          :key="skill.code"
          class="flex-skill"
          :class="{ is_active: skill.is_active }"
          @click="onClickFlexSkill(skill)"
        >{{ skill.name }}</div>
      </div>
      <div
        v-if="player_flex_skills_info.num_active < player_flex_skills_info.learnable_count"
        class="color-text-red"
      >{{ player_flex_skills_info.learnable_count - player_flex_skills_info.num_active }} flex skill slots available</div>
    </div>

    <!-- Feats -->
    <div class="sidebar-element feats" v-if="!is_classless && allow_combat && player_feats_info.feats.length">
      <h3 @click="onClickExpand('feats')" class="hover">
        <span v-if="expanded === 'feats'">-</span>
        <span v-else>+</span>
        FEATS
        <Help :help="feats_help" />
      </h3>
      <div v-if="expanded === 'feats'" class="my-1">
        <div v-for="tier in player_feats_info.feats" class="feat-tier" :key="tier.tier_number">
          <div v-if="tier.tier_number != 1" class="tier-name my-1"></div>
          <div
            v-for="feat_data of tier.feats"
            :key="feat_data.code"
            :class="{ is_active: feat_data.is_active }"
            class="feat"
            @click="onClickFeat(feat_data)"
          >{{ feat_data.name }}</div>
        </div>
      </div>
      <div
        v-if="player_feats_info.num_unlearned_feats > 0"
        class="color-text-red"
      >{{ player_feats_info.num_unlearned_feats }} unselected feat tiers</div>
    </div>

    <!-- Chars -->
    <div class="sidebar-element chars">
      <h3 @click="onClickExpand('chars')" class="hover">
        <span v-if="expanded === 'chars'">-</span>
        <span v-else>+</span>
        {{ room_chars_length }}
        <template
          v-if="room_chars_length == 1"
        >CHARACTER</template>
        <template v-else>CHARACTERS</template>
        IN ROOM
      </h3>
      <div v-if="expanded === 'chars'" class="my-1">
        <Chars/>
      </div>
    </div>

    <!-- News -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import Help from "@/components/Help.vue";
import QuestLog from "@/components/game/QuestLog.vue";
import ComLog from "@/components/game/sidebar/ComLog.vue";
import Focus from "@/components/game/sidebar/Focus.vue";
import Chars from "@/components/game/sidebar/Chars.vue";
import _ from "lodash";

const store = useStore();

const expanded = ref<"who" | "" | "skills" | "feats" | "chars">("");

const world = computed(() => store.state.game.world);
const is_classless = computed(() => !store.state.game.player.archetype);
const allow_combat = computed(() => store.state.game.world.allow_combat);
const world_feats = computed(() => store.state.game.world.feats);
const world_skills = computed(() => store.state.game.world.skills);
const who_list = computed(() => store.state.game.who_list);
const player_archetype = computed(() => store.state.game.player_archetype);
const player_skills = computed(() => store.state.game.player_skills);
const player_level = computed(() => store.state.game.player_level);
const room_chars_length = computed(() => store.state.game.room_chars.length);

const player_feats_info = computed(() => {
  interface FeatData {
    code: string;
    name: string;
    description: string;
    is_active: boolean;
  }

  interface FeatTier {
    tier_level: number;
    tier_number: number;
    feats: FeatData[];
  }

  // Value being returned by the getter
  const feats: FeatTier[] = [];

  const archetype_feats = world_feats.value[player_archetype.value];

  interface PlayerFeats {
    1: string;
    2: string;
    3: string;
  }

  const player_feats: PlayerFeats = player_skills.value.feat;

  const archetype_tiers = _.sortBy(
    _.map(Object.keys(archetype_feats), (tier) => Number(tier))
  );

  let num_learned_feats = 0;
  for (let tier_level of archetype_tiers) {
    const tier_number = archetype_tiers.indexOf(tier_level) + 1;
    tier_level = Number(tier_level);

    if (
      player_level.value < tier_level ||
      !Object.keys(archetype_feats[tier_level]).length
    )
      continue;

    const tier_data: FeatTier = {
      tier_level: tier_level,
      tier_number: tier_number,
      feats: [],
    };

    for (const feat_name of Object.keys(archetype_feats[tier_level])) {
      // Get the feat's details from the world data
      const world_feat_data: FeatData = {
        ...archetype_feats[tier_level][feat_name],
        is_active: false,
      };

      if (player_feats[tier_number] === feat_name) {
        world_feat_data.is_active = true;
        num_learned_feats += 1;
      }

      tier_data.feats.push(world_feat_data);
    }

    feats.push(tier_data);
  }

  const final = {
    feats,
    num_learned_feats,
    num_unlearned_feats: feats.length - num_learned_feats,
  };
  return final;
});

const player_flex_skills_info = computed(() => {
  // Given that there are no flex skills in classlessworlds, return empty structures.
  if (is_classless.value) {
    return {
      skills: [],
      num_active: 0,
      learnable_count: 0,
    };
  }

  const archetype_skills = world_skills.value[player_archetype.value];
  const archetype_flex_skill_codes = archetype_skills.flex;
  // Remap player skills from {1: skill1, 2: skill3} to [ skill1, skill2 ]
  const player_flex_skills: string[] = [];
  for (const i of [1, 2, 3]) {
    if (player_skills.value.flex[i]) {
      player_flex_skills.push(player_skills.value.flex[i]);
    }
  }

  interface SkillData {
    code: string;
    name: string;
    is_active: boolean;
  }
  const skills: SkillData[] = [];
  let num_active = 0;
  for (const skill_code of archetype_flex_skill_codes) {
    const skill_data = archetype_skills[skill_code];

    if (skill_data.level > player_level.value) continue;

    let is_active = false;
    if (player_flex_skills.indexOf(skill_data.code) !== -1) {
      is_active = true;
      num_active += 1;
    }

    skills.push({
      code: skill_data.code,
      name: skill_data.name,
      is_active: is_active,
    });
  }

  // Calculate the number of skills that this player is able to learn
  let learnable_count = 0;
  if (player_level.value >= 14) learnable_count = 3;
  else if (player_level.value >= 10) learnable_count = 2;
  else if (player_level.value >= 6) learnable_count = 1;

  return {
    skills,
    num_active,
    learnable_count,
  };
});

const onClickFlexSkill = (skill) => {
  if (!skill.is_active)
    store.dispatch("game/cmd", `learn ${skill.code}`);
};

const onClickFeat = (feat) => {
  if (!feat.is_active) {
    store.dispatch("game/cmd", `learn ${feat.code}`);
  }
};

const onClickWhoPlayer = (player) => {
  store.dispatch("game/cmd", `whois ${player.name}`);
};

const focus_help = `Set an item or character as the focus of another command.<br/>
    <br/>
    Enter 'help focus' for more information.`;

const flex_skills_help = `Each class has access at any given time to 5 core skills and 3 flex skills. The 3 flex skills are learned from a larger pool of available skills.<br/>
    <br/>
    Flex skill slots become unlocked reaching higher level, with 1 skill available at level 6, 2 at level 10 and 3 at level 14.<br/>
    <br/>
    Enter the 'learn' command to view more information about flex skills.`;

const feats_help = `Feats are character customizations that affect your stats or your skills. Three feats can be learned, one at level 4, the second at level 8 and the last at level 12.<br/>
  <br/>
  Enter the 'feat' command to view more information about feats.`;

const onClickExpand = (section: "who" | "" | "skills" | "feats" | "chars") => {
  if (expanded.value == section) {
    expanded.value = "";
  } else {
    expanded.value = section;
  }
};

const onClickQuestLog = () => {
  store.commit('ui/modal/open_view', {
    component: QuestLog,
    options: {
      closeOnOutsideClick: true,
    },
  });
};

const onClickCommunicationLog = () => {
  store.commit('ui/modal/open_view', {
    component: ComLog,
    options: {
      closeOnOutsideClick: true,
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
#sidebar {
  background: $color-background-light;
  border-left: 2px solid $color-background-very-light;
  width: 250px;

  .sidebar-element {
    padding: 15px;
    &:not(:last-child) {
      border-bottom: 1px solid $color-background-very-light;
    }

    h3 {
      text-transform: uppercase;
      span {
        width: 10px;
        display: inline-block;
      }
    }

    &.who-list {
      .who-list-detail {
        .hover:hover {
          color: $color-text-hex-80;
        }
      }
    }

    &.flex-skills {
      .flex-skill {
        &:not(.is_active) {
          color: $color-text-hex-50;
          &:hover {
            cursor: pointer;
            color: $color-primary;
          }
        }
      }
    }

    &.feats {
      .feat-tier {
        .tier-name {
          border-bottom: 1px solid #333;
          width: 100%;
        }
        .feat {
          &:not(.is_active) {
            color: $color-text-hex-50;
            &:hover {
              cursor: pointer;
              color: $color-primary;
            }
          }
        }
      }
    }
  }
}
</style>
