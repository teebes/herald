<template>
  <div class="new-character">
    <div class="new-char-signup" v-if="showSignup">
      <SignUp :redirect="$route.fullPath" />
    </div>

    <div class="wrapper" v-else>
      <form class @submit.prevent="createCharacter">
        <h1 class="form-title">CREATE NEW CHARACTER</h1>
        <div class="flex creation-fields" :class="{ selectableFaction: showFactions }">
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
          <div class="form-group">
            <label for="field-gender">Gender</label>
            <select id="field-gender" v-model="gender">
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

          <div class="form-group" v-if="showFactions">
            <label for="field-faction">Faction</label>
            <select id="field-faction" v-model="faction">
              <option
                v-for="faction in worldFactions"
                :key="faction.code"
                :value="faction.code"
              >{{ faction.name }}</option>
            </select>
          </div>

          <div class="form-group" v-if="$route.params.world_id != INTRO_WORLD_ID">
            <label for="field-archetype">Class</label>
            <select id="field-archetype" v-model="archetype">
              <option value="warrior">Warrior</option>
              <option value="mage">Mage</option>
              <option value="cleric">Cleric</option>
            </select>
          </div>
        </div>
        <button class="btn-large">CREATE CHARACTER</button>
      </form>
    </div>
    <div class="cancel-action" @click="onCancelCreate()">cancel</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import axios from "axios";
import { INTRO_WORLD_ID } from "@/config.ts";
import SignUp from "@/views/SignUp.vue";
import _ from "lodash";

@Component({
  components: {
    SignUp
  }
})
export default class extends Vue {
  INTRO_WORLD_ID = INTRO_WORLD_ID;

  charname: string = "";
  gender: string = "female";
  archetype: string = "warrior";
  faction: string | null;

  @Prop() world!: any;

  constructor() {
    super();
    if (this.worldFactions.length) {
      this.faction = this.worldFactions[0].code;
    } else {
      this.faction = null;
    }
  }

  get worldFactions() {
    const world_factions = this.world.core_factions;
    const selectable_factions = _.filter(world_factions, faction => {
      return faction.is_selectable;
    });
    const sorted_factions = _.sortBy(selectable_factions, faction => {
      return !faction.is_default;
    });
    return sorted_factions;
  }

  get showFactions() {
    return this.world.core_factions.length && this.world.can_select_faction;
  }

  get showSignup() {
    return !this.$store.state.auth.token;
  }

  async createCharacter() {
    const payload = {
      name: this.charname,
      gender: this.gender,
      archetype: this.archetype
    };
    if (this.faction) {
      payload["faction"] = this.faction;
    }
    const resp = await axios.post(
      `lobby/worlds/${this.$route.params.world_id}/chars/`,
      payload
    );
    if (resp.status === 201) {
      // this.chars.push(resp.data);
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

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

.new-character {
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
}
</style>