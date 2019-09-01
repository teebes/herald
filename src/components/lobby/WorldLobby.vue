<template>
  <div id="world_lobby" v-if="world">
    <div class="world-details">
      <div class="world-home-bg" :style="backgroundImage">
        <div class="world-home-bg-overlay"></div>
      </div>

      <div class="world-home flex">
        <div class="world-home-left-side">
          <div class="world-info">
            <div class="world-title">{{ world.name }}</div>
            <div class="world-author">
              By {{ world.built_by }}
              <template v-if="world.can_edit">
                <span class="divider"></span>
                <router-link
                  :to="{ name: BUILDER_WORLD_INDEX, params: { world_id: $route.params.world_id }}"
                >EDIT WORLD</router-link>
              </template>
            </div>
            <div class="world-description">{{ world.description}}</div>
          </div>

          <div class="world-chars-region">
            <div class="new-character" v-if="newCharacter">
              <div class="wrapper">
                <form class @submit.prevent="createCharacter">
                  <h1 class="form-title">CREATE NEW CHARACTER</h1>
                  <div class="flex">
                    <div class="form-group flex-1">
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
                    <div class="form-group flex-1">
                      <label for="field-gender">Gender</label>
                      <select id="field-gender" v-model="gender">
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                    <div class="form-group flex-1" v-if="$route.params.world_id != INTRO_WORLD_ID">
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
              <div class="cancel-action" @click="newCharacter = false">cancel</div>
            </div>
            <div class="world-chars" v-else>
              <div class="world-chars-title">YOUR CHARACTERS</div>
              <div class="world-chars-container">
                <div v-for="char in chars" :key="char.id" class="char-display">
                  <div class="char-name">{{ char.name }}</div>
                  <div class="char-info">{{ charInfo(char) }}</div>
                  <div class="enter-world">
                    <button
                      class="btn-small play-as"
                      @click="onTransfer(char)"
                      v-if="char.can_transfer && !$store.state.auth.user.is_temporary"
                    >TRANSFER {{ char.name }}</button>
                    <button
                      class="btn-small play-as"
                      @click="onEnter(char)"
                      v-else
                    >PLAY AS {{ char.name }}</button>
                  </div>
                </div>
                <button
                  class="btn-add new-character"
                  @click="newCharacter = true"
                >CREATE NEW CHARACTER</button>
              </div>
            </div>
          </div>
        </div>

        <div class="world-leaderboard">
          <template v-if="world.is_multiplayer">
            <div class="leaderboard-title">LEADERBOARD</div>
            <div class="leaderboard-region">
              <ul>
                <li class="world-leader" v-for="leader in leaders" :key="leader.id">
                  <span class="index">{{ leaders.indexOf(leader) + 1 }}</span>
                  {{ leader.name }} {{ leader.title }}
                  <span
                    v-if="leader.display_faction"
                  >[{{ leader.display_faction}}]</span>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import { BUILDER_WORLD_INDEX } from "@/router";
import { capitalize } from "@/core/utils.ts";
import { LOBBY_WORLD_TRANSFER, LOBBY_WORLD_DETAIL } from "@/router.ts";
import { INTRO_WORLD_ID } from "@/config.ts";

@Component({})
export default class WorldLobby extends Vue {
  BUILDER_WORLD_INDEX = BUILDER_WORLD_INDEX;
  INTRO_WORLD_ID = INTRO_WORLD_ID;

  chars: {}[] = [];
  world: any = null;
  leaders: {}[] = [];
  newCharacter: boolean = false;
  charname: string = "";
  gender: string = "female";
  archetype: string = "warrior";

  async createCharacter() {
    const resp = await axios.post(
      `lobby/worlds/${this.$route.params.world_id}/chars/`,
      {
        name: this.charname,
        gender: this.gender,
        archetype: this.archetype
      }
    );
    if (resp.status === 201) {
      this.chars.push(resp.data);
      this.newCharacter = false;
      this.charname = "";
      this.gender = "female";
    }
  }

  get is_temporary_user() {
    return this.$store.state.user.is_temporary;
  }

  get backgroundImage() {
    // Currently, the API returns the location of the banner so that it can
    // be changed on the fly. Unfortunately it returns a full path and webpack
    // wants to know which directories to include at runtime, so we have
    // to do a bit of work here.

    let imagePath = this.world && this.world.large_background,
      fileName = "world-home-bg.jpg";

    if (imagePath) {
      const pathElements = imagePath.split("/");
      fileName = pathElements[pathElements.length - 1];
    }
    return {
      backgroundImage: `url(/ui/lobby/${fileName})`
    };
  }

  charInfo(char) {
    return `${capitalize(char.gender)} ${char.archetype}, level ${char.level}`;
  }

  async mounted() {
    if (this.$store.state.auth.user.is_temporary) {
      this.$router.push({
        name: LOBBY_WORLD_DETAIL,
        params: {
          world_id: INTRO_WORLD_ID
        }
      });
    }

    const worldFetchPromise = axios.get(
      `/lobby/worlds/${this.$route.params.world_id}/`
    );

    const userCharsPromise = axios.get(
      `/lobby/worlds/${this.$route.params.world_id}/chars/`
    );

    const leaderboardPromise = axios.get(
      `/lobby/worlds/${this.$route.params.world_id}/leaders/`
    );

    const [world_resp, user_chars_resp, leaderboard_resp] = await Promise.all([
      worldFetchPromise,
      userCharsPromise,
      leaderboardPromise
    ]);

    this.chars = user_chars_resp.data.results;
    this.world = world_resp.data;
    this.leaders = leaderboard_resp.data.results;
  }

  async onEnter(char) {
    this.$store.dispatch("game/world_enter", {
      player_id: char.id,
      world_id: this.$route.params.world_id
    });
  }

  async onTransfer(char) {
    this.$router.push({
      name: LOBBY_WORLD_TRANSFER,
      params: {
        player_id: char.id,
        world_id: this.$route.params.world_id
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

#world_lobby {
  width: 100%;
  //padding: 50px 20px;
  max-width: 1150px;
  margin: 0 auto;

  .world-details {
    flex-grow: 1;

    max-width: 1150px;
    margin: 0 auto;
    position: relative;

    .world-home-bg {
      position: absolute;
      background: #332d25;
      background: url("/ui/lobby/world-home-bg.jpg");
      background-size: 1150px 299px;
      width: 100%;
      height: 299px;
    }
    .world-home-bg-overlay {
      background: linear-gradient(
        to bottom,
        $color-transparent-rgba,
        $color-background-rgba 100%
      );
      position: absolute;
      width: 100%;
      height: 299px;
    }

    .world-home {
      position: absolute;
      z-index: 10000;
      width: 100%;
      margin-top: 150px;

      flex-direction: row;
      @media ($mobile-site) {
        flex-direction: column;
        margin-top: 50px;
      }

      .world-home-left-side {
        flex: 2;

        .world-title {
          text-transform: uppercase;
        }

        .world-chars {
          .world-chars-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .char-display {
              flex-basis: 33%;
              @media (max-width: 900px) {
                flex-basis: 50%;
              }

              .play-as {
                text-transform: uppercase;
              }
            }

            .new-character {
              margin-top: 40px;
              flex-basis: 33%;
              height: 60px;
            }
          }
        }
      }

      .world-leaderboard {
        flex: 1;
      }

      .new-character {
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

          .form-group {
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
    }

    .world-home-left-side {
      padding: 0 30px;
      @media ($desktop-site) {
        padding-left: 80px;
      }
      @media ($mobile-site) {
        padding: 0 15px;
      }
      //@include media-breakpoint-up(lg) {
      //  padding-left: 80px;
      //}

      // Details of the world
      .world-info {
        .world-title {
          @include font-title-regular;
          font-size: 30px;
          letter-spacing: 1.3px;
          line-height: 35px;
        }

        .world-author {
          @include font-text-light;
          font-size: 15px;
          letter-spacing: -0.5px;
          line-height: 20px;
          margin-bottom: 1em;

          a {
            @include font-title-regular;
            font-size: 13px;
            letter-spacing: 0.83px;
            line-height: 16px;
            color: $color-primary;
            &:hover {
              text-decoration: underline;
            }
          }

          span.divider {
            border-left: 1px solid white;
            opacity: 0.2;
            margin-left: 10px;
            padding-left: 14px;
          }
        }

        .world-description {
          @include font-text-light;
          font-size: 15px;
          line-height: 26px;
        }
      }

      .world-chars-region {
        padding-top: 50px;

        // Your characters
        .world-chars {
          .world-chars-title {
            @include font-title-regular;
            color: $color-secondary;
            letter-spacing: 1.5px;
            font-size: 15px;
            line-height: 18px;
            margin-bottom: 27px;
          }

          .char-display {
            margin-bottom: 50px;

            .char-name {
              @include font-text-regular;
              line-height: 20px;
            }

            .char-info {
              @include font-text-light;
              line-height: 23px;
              color: $color-text-hex-50;
            }

            .play-as {
              margin-top: 15px;
            }
          }

          .create-character {
            margin-top: 12px;
          }
        }

        // New Character
        .new-character {
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
      }
    }

    // Leaderboard
    .world-leaderboard {
      padding: 0 30px;
      // @include media-breakpoint-up(lg) {
      //   margin-top: 130px;
      //   padding: 0 15px 0 50px;
      // }
      // @include media-breakpoint-down(md) {
      //   padding-top: 50px;
      // }
      padding-top: 146px;
      @media ($mobile-site) {
        padding: 0 15px 0 15px;
      }

      .leaderboard-title {
        @include font-title-regular;
        color: $color-secondary;
        font-size: 15px;
        letter-spacing: 1.5px;
        line-height: 18px;
        margin-bottom: 20px;
      }

      ul {
        list-style-type: none;
        padding: 0;

        li.world-leader {
          line-height: 23px;

          .index {
            color: $color-secondary;
            margin-right: 0.5em;
          }
        }
      }
    }
  }
}
</style>