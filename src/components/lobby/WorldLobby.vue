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
            </div>
            <div class='world-misc mt-1'>
              <span class='color-text-50 world-type'>
                {{ world_descriptors }}
              </span>
              <span class="divider"></span>
              <a href @click.prevent="copyShareLink" @click="copyShareLink">SHARE</a>              
              <template v-if="world.can_edit">
                <span class="divider"></span>  
                <router-link
                  :to="{ name: BUILDER_WORLD_INDEX, params: { world_id: $route.params.world_id }}"
                >EDIT</router-link>
              </template>
            </div>              
            
            <div class="world-description mt-4">
              <div class="desc-line" v-for="(line, index) of descLines" :key="index">{{ line }}</div>
            </div>
          </div>

          <UserChars @charcreated="onCharCreated" :chars="chars" :world="world" />
        </div>

        <div class="world-leaderboard" v-if="world.allow_combat && !$store.state.lobby.world_details.create_character">
          <template v-if="world.id != 217">
            <div class="leaderboard-title">
              <template v-if="world.id == 1">TRAILBLAZERS</template>
              <template v-else>LEADERBOARD</template>
            </div>
            <div class="leaderboard-region">
              <ul>
                <li class="world-leader" v-for="leader in leaders" :key="leader.id">
                  <span class="index">{{ leaders.indexOf(leader) + 1 }}</span>
                  {{ leader.name }} 
                  <span class='ml-4 color-text-50'>[ {{ capfirst(leader.core_faction) }} {{ capfirst(leader.archetype) }} ]</span>
                </li>
              </ul>
            </div>
          </template>

          <div class="mt-6" v-if="world.id=1">
            <span class='mr-1 color-primary'>&#x2606;</span>
            <router-link er-link :to="{'name': 'edeus_unique_bearers'}">Unique Bearers</router-link>
          </div>
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
import { capfirst } from "@/core/utils.ts";

@Component({
  components: {
    UserChars,
  },
})
export default class WorldLobby extends Vue {
  BUILDER_WORLD_INDEX = BUILDER_WORLD_INDEX;
  INTRO_WORLD_ID = INTRO_WORLD_ID;

  chars: {}[] = [];
  world: any = null;
  leaders: {}[] = [];

  capfirst = capfirst;

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
      imageUrl;

    if (/http(s)?:\/\//.test(imagePath)) {
      imageUrl = imagePath;
    } else if (imagePath) {
      const pathElements = imagePath.split("/");
      const fileName = pathElements[pathElements.length - 1];
      imageUrl = `/ui/lobby/${fileName}`;
    } else {
      imageUrl = `/ui/lobby/world-home-bg.jpg`;
    }
    return {
      backgroundImage: `url(${imageUrl})`,
    };
  }

  async mounted() {
    if (this.$store.state.auth.user.is_temporary) {
      this.$router.push({
        name: LOBBY_WORLD_DETAIL,
        params: {
          world_id: INTRO_WORLD_ID,
        },
      });
    }

    // reset world details state
    this.$store.commit("lobby/world_details/reset_state");

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
      leaderboardPromise,
    ]);

    this.chars = user_chars_resp.data.results;
    this.world = world_resp.data;
    this.leaders = leaderboard_resp.data.results;
  }

  get descLines() {
    return this.world.description.split("\n");
  }

  async copyShareLink() {
    const slug = this.world.name.toLowerCase().split(/\W+/).join("-");
    const url = `${window.location.href}/${slug}`;
    await this.$copyText(url);
    this.$store.commit("ui/notification_set", `World URL copied to clipboard!`);
  }

  get world_descriptors() {
    let descriptor = "";

    if (this.world.is_private) {
      descriptor += "PRIVATE ";
    }

    if (this.world.is_narrative) {
      descriptor += "NARRATIVE ";
    }

    const world_type = this.world.is_multiplayer
      ? "MULTIPLAYER"
      : "SINGLEPLAYER";
    return `${descriptor} ${world_type} WORLD`;
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
      margin-bottom: 50px;

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
              flex-basis: 50%;

              .play-as {
                text-transform: uppercase;
              }
            }
          }
        }
      }

      .world-leaderboard {
        flex: 1;

        @media ($mobile-site) {
          margin-top: 50px;
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

        .world-author,
        .world-misc {
          @include font-text-light;
          font-size: 15px;
          letter-spacing: -0.5px;
          line-height: 20px;
          // margin-bottom: 1em;

          a,
          .world-type {
            @include font-title-regular;
            font-size: 13px;
            letter-spacing: 0.83px;
            word-spacing: 0.5em;
            line-height: 16px;
          }
          a {
            color: $color-primary;
            &:hover {
              text-decoration: underline;
            }
          }

          span.divider {
            border-left: 1px solid white;
            opacity: 0.2;
            margin-left: 12px;
            padding-left: 12px;
          }
        }

        .world-description {
          @include font-text-light;
          font-size: 15px;
          line-height: 26px;

          div.desc-line:not(:last-child) {
            margin-bottom: 0.8em;
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