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

          <UserChars @charcreated="onCharCreated" :chars="chars" :world="world" />
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
import { LOBBY_WORLD_DETAIL } from "@/router.ts";
import { INTRO_WORLD_ID } from "@/config.ts";
import UserChars from "./UserChars.vue";

@Component({
  components: {
    UserChars
  }
})
export default class WorldLobby extends Vue {
  BUILDER_WORLD_INDEX = BUILDER_WORLD_INDEX;
  INTRO_WORLD_ID = INTRO_WORLD_ID;

  chars: {}[] = [];
  world: any = null;
  leaders: {}[] = [];

  onCharCreated(new_character) {
    this.chars.splice(0, 0, new_character);
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
}
</script>

<style lang="scss">
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
              // margin-top: 40px;
              // flex-basis: 33%;
              // height: 60px;
            }
          }
        }
      }

      .world-leaderboard {
        flex: 1;
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