<template>
  <div id="lobby-new-character">
    <div class="new-char-signup" v-if="showSignup">
      <SignUp :redirect="$route.fullPath" />
    </div>

    <div class="wrapper" v-else>
      <form class @submit.prevent="createCharacter">
        <h1 class="form-title">CREATE NEW CHARACTER</h1>
        <div
          class="flex creation-fields"
          :class="{ selectableFaction: showFactions }"
        >
          <!-- Name -->
          <div class="form-group">
            <label for="field-name">Name</label>
            <input
              id="field-name"
              type="name"
              class="form-control"
              placeholder="Name"
              v-model="charname"
              required="required"
            />
          </div>

          <!-- Gender -->
          <div class="form-group">
            <label for="field-gender">Gender</label>
            <select
              id="field-gender"
              v-model="gender"
              :disabled="!world.can_select_gender"
              :readonly="!world.can_select_gender"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non_binary">Non-Binary</option>
            </select>
          </div>

          <!-- Factions -->
          <div class="form-group" v-if="showFactions">
            <label for="field-faction">Faction</label>
            <select id="field-faction" v-model="faction">
              <option
                v-for="faction in worldFactions"
                :key="faction.code"
                :value="faction.code"
                >{{ faction.name }}</option
              >
            </select>
          </div>

          <!-- Archetype -->
          <div class="form-group" v-if="showArchetype">
            <div class="flex">
              <label for="field-archetype">Class</label>
              <Help v-if="!showFactions" :help="archetypeHelp" />
            </div>
            <select id="field-archetype" v-model="archetype">
              <option value="warrior">Warrior</option>
              <option value="mage">Mage</option>
              <option value="cleric">Cleric</option>
              <option value="assassin">Assassin</option>
            </select>
          </div>

          <!-- Faction Description -->
          <template v-if="showArchetype && showFactions">
            <div class="form-group field-description">
              <div class="inner-description">
                <div
                  v-for="(line, index) in factionDescriptionLines"
                  :key="index"
                  class="faction-description-line"
                >
                  {{ line }}
                </div>
              </div>
            </div>
            <div class="form-group field-description">
              <div class="inner-description">
                {{ archetypeDescription(archetype) }}
              </div>
            </div>
          </template>
        </div>

        <button class="btn-large">CREATE CHARACTER</button>
      </form>
    </div>
    <div class="cancel-action" @click="onCancelCreate()">cancel</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import axios from "axios";
import { INTRO_WORLD_ID } from "@/config.ts";
import SignUp from "@/views/SignUp.vue";
import _ from "lodash";
import { capfirst } from "@/core/utils.ts";
import Help from "@/components/Help.vue";

@Component({
  components: {
    SignUp,
    Help,
  },
})
export default class extends Vue {
  INTRO_WORLD_ID = INTRO_WORLD_ID;

  charname: string = "";
  gender: string = "female";
  archetype: string = "warrior";
  faction: string | null;

  @Prop() world!: any;

  capfirst = capfirst;

  constructor() {
    super();
    if (this.worldFactions.length) {
      this.faction = this.worldFactions[0].code;
    } else {
      this.faction = null;
    }

    this.gender = this.world.default_gender;
  }

  get worldFactions() {
    const world_factions = this.world.core_factions;
    const selectable_factions = _.filter(world_factions, (faction) => {
      return faction.is_selectable;
    });
    const sorted_factions = _.sortBy(selectable_factions, (faction) => {
      return !faction.is_default;
    });
    return sorted_factions;
  }

  get showFactions() {
    // if (this.world.id == 1 && this.$store.state.auth.user.is_staff) {
    //   return true;
    // }
    return this.world.core_factions.length && this.world.can_select_faction;
  }

  get showSignup() {
    return !this.$store.state.auth.token;
  }

  get showArchetype() {
    if (
      !this.world.allow_combat ||
      this.$route.params.world_id == INTRO_WORLD_ID
    )
      return false;
    return true;
  }

  get factionData() {
    for (const faction_data of this.world.core_factions) {
      if (this.faction === faction_data.code) {
        return faction_data;
      }
    }
    return false;
  }

  get factionDescriptionLines() {
    if (this.factionData.description)
      return this.factionData.description.split("\n");
    return [];
  }

  // Eventually, this would come from state instead
  archetypeDescription(archetype) {
    if (archetype === "warrior") {
      return "Warriors are hardened brawlers, smashing their enemies head-on.";
    } else if (archetype === "mage") {
      return "Mages are glass cannons, masters of elemental damage.";
    } else if (archetype === "assassin") {
      return "Assassins are masters of stealth and violence.";
    } else if (archetype === "cleric") {
      return "Clerics are masters of healing and survival.";
    }
  }

  get archetypeHelp() {
    const help: string[] = [];
    for (const archetype of ["warrior", "mage", "assassin", "cleric"]) {
      help.push(
        `${capfirst(archetype)} - ${this.archetypeDescription(archetype)}`
      );
    }
    return help.join("<br/><br/>");
  }

  async createCharacter() {
    const payload = {
      name: this.charname,
      gender: this.gender,
      archetype: this.archetype,
    };
    if (this.faction) {
      payload["faction"] = this.faction;
    }
    const resp = await axios.post(
      `lobby/worlds/${this.$route.params.world_id}/chars/`,
      payload
    );
    if (resp.status === 201) {
      this.$emit("charcreated", resp.data);
      this.charname = "";
      this.gender = "female";
    }
  }

  onCancelCreate() {
    this.$store.commit("lobby/world_details/create_character_set", false);
  }
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

#lobby-new-character {
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 50px;
  margin-top: 40px;
  flex-basis: 33%;

  .wrapper {
    background: $color-background-light;
    border: 1px solid $color-background-light-border;
    padding: 15px;
    width: 100%;

    .form-title {
      text-align: center;
      width: 100%;
      margin-bottom: 50px;
    }

    .creation-fields {
      &.selectableFaction {
        flex-wrap: wrap;
        .form-group {
          flex: 0 48%;

          &:nth-child(even) {
            margin-left: 2%;
          }
          &:nth-child(odd) {
            margin-right: 2%;
          }
        }
      }
      &:not(.selectableFaction) {
        .form-group {
          flex: 1;
          &:first-child {
            margin-right: 1rem;
            @media ($mobile-site) {
              margin-right: 0.5rem;
            }
          }
          &:last-child {
            margin-left: 1rem;
            @media ($mobile-site) {
              margin-left: 0.5rem;
            }
          }
        }
      }
    }

    // Used for both archetype & faction descriptions
    .field-description {
      .field-name {
        @include font-title-light;
        color: $color-secondary;
        font-size: 15px;
        letter-spacing: 0;
        padding-bottom: 0.5rem;
      }
      .inner-description {
        .faction-description-line {
          min-height: 0.6rem;
        }
      }
    }

    .creation-fields .field-description {
      padding-bottom: 2rem;
      padding-left: 0.25rem;
    }
  }
  .cancel-action {
    @include font-text-light;
    opacity: 0.5;
    width: 100%;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
  }

  .form-group {
    .help-icon > img {
      bottom: 10px !important;
    }
  }
}
</style>
