<template>
  <div id="sidebar">
    <!-- Quest Log -->
    <div class="sidebar-element logs">
      <h3>LOGS</h3>
      <div class="mt-4">
        <button class="btn-small mb-1 button-gray" @click="onClickQuestLog">QUEST LOG</button>
        <button class="btn-small button-gray" @click="onClickCommunicationLog">COMMUNICATION LOG</button>
      </div>
    </div>

    <!-- Focus -->
    <div class="sidebar-element focus">
      <h3>
        FOCUS
        <Help :help="focus_help" />
      </h3>
      <Focus class="mt-2" />
    </div>

    <!-- Who list -->
    <div class="sidebar-element who-list">
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
          <span v-if="player.is_immortal">~</span>
          {{ player.name }} {{ player.title }}
          <span v-if="player.is_idle" class='ml-1 color-text-50'>(Idle)</span>
        
        </div>
      </div>
    </div>

    <!-- Flex Skills -->
    <div class="sidebar-element flex-skills" v-if="player_flex_skills_info.learnable_count">
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
    <div class="sidebar-element feats" v-if="player_feats_info.feats.length">
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Help from "@/components/Help.vue";
import QuestLog from "@/components/game/QuestLog.vue";
import ComLog from "@/components/game/sidebar/ComLog.vue";
import Focus from "@/components/game/sidebar/Focus.vue";
import { UI_MUTATIONS } from "@/constants.ts";
import { STAFF_PLAYING } from "../../router";
import _ from "lodash";

@Component({
  components: {
    Help,
    QuestLog,
    ComLog,
    Focus
  }
})
export default class Sidebar extends Vue {
  expanded: "who" | "" | "skills" | "feats" = "";

  get world_feats() {
    return this.$store.state.game.world.feats;
  }

  get player_feats_info() {
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

    const archetype_feats = this.world_feats[this.player.archetype];

    interface PlayerFeats {
      1: string;
      2: string;
      3: string;
    }

    const player_feats: PlayerFeats = this.player.skills.feat;

    const archetype_tiers = _.sortBy(
      _.map(Object.keys(archetype_feats), tier => Number(tier))
    );

    let num_learned_feats = 0;
    for (let tier_level of archetype_tiers) {
      const tier_number = archetype_tiers.indexOf(tier_level) + 1;
      tier_level = Number(tier_level);

      if (
        this.player.level < tier_level ||
        !Object.keys(archetype_feats[tier_level]).length
      )
        continue;

      const tier_data: FeatTier = {
        tier_level: tier_level,
        tier_number: tier_number,
        feats: []
      };

      for (const feat_name of Object.keys(archetype_feats[tier_level])) {
        // Get the feat's details from the world data
        const world_feat_data: FeatData = {
          ...archetype_feats[tier_level][feat_name],
          is_active: false
        };

        if (player_feats[tier_number] === feat_name) {
          world_feat_data.is_active = true;
          num_learned_feats += 1;
        }

        tier_data.feats.push(world_feat_data);
      }

      feats.push(tier_data);
    }

    return {
      feats,
      num_learned_feats,
      num_unlearned_feats: feats.length - num_learned_feats
    };
  }

  get world_skills() {
    return this.$store.state.game.world.skills;
  }

  get player_flex_skills_info() {
    const archetype_skills = this.world_skills[this.player.archetype];
    const archetype_flex_skill_codes = archetype_skills.flex;
    // Remap player skills from {1: skill1, 2: skill3} to [ skill1, skill2]
    const player_flex_skills: string[] = [];
    for (const i of [1, 2, 3]) {
      if (this.player.skills.flex[i]) {
        player_flex_skills.push(this.player.skills.flex[i]);
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

      if (skill_data.level > this.player.level) continue;

      let is_active = false;
      if (player_flex_skills.indexOf(skill_data.code) !== -1) {
        is_active = true;
        num_active += 1;
      }

      skills.push({
        code: skill_data.code,
        name: skill_data.name,
        is_active: is_active
      });
    }

    // Calculate the number of skills that this player is able to learn
    let learnable_count = 0;
    if (this.player.level >= 14) learnable_count = 3;
    else if (this.player.level >= 10) learnable_count = 2;
    else if (this.player.level >= 6) learnable_count = 1;

    return {
      skills,
      num_active,
      learnable_count
    };
  }

  onClickFlexSkill(skill) {
    if (!skill.is_active)
      this.$store.dispatch("game/cmd", `learn ${skill.code}`);
  }

  onClickFeat(feat) {
    if (!feat.is_active) {
      this.$store.dispatch("game/cmd", `learn ${feat.code}`);
    }
  }

  onClickWhoPlayer(player) {
    this.$store.dispatch("game/cmd", `whois ${player.name}`);
  }

  get who_list() {
    return this.$store.state.game.who_list;
  }

  get player() {
    return this.$store.state.game.player;
  }

  get focus_help() {
    return `Set an item or character as the focus of another command.<br/>
    <br/>
    Enter 'help focus' for more information.`;
  }

  get flex_skills_help() {
    return `Each class has access at any given time to 5 core skills and 3 flex skills. The 3 flex skills are learned from a larger pool of available skills.<br/>
    <br/>
    Flex skill slots become unlocked reaching higher level, with 1 skill available at level 6, 2 at level 10 and 3 at level 14.<br/>
    <br/>
    Enter the 'learn' command to view more information about flex skills.`;
  }

  get feats_help() {
    return `Feats are character customizations that affect your stats or your skills. Three feats can be learned, one at level 4, the second at level 8 and the last at level 12.<br/>
    <br/>
    Enter the 'feat' command to view more information about feats.`;
  }

  onClickExpand(section) {
    if (this.expanded == section) {
      this.expanded = "";
    } else {
      this.expanded = section;
    }
  }

  onClickQuestLog() {
    const modal_data = {
      component: QuestLog,
      options: {
        closeOnOutsideClick: true
      }
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal_data);
  }

  onClickCommunicationLog() {
    const modal_data = {
      component: ComLog,
      options: {
        closeOnOutsideClick: true
      }
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal_data);
  }
}
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
