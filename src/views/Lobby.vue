<template>
  <div class="worlds-lobby" v-if="worlds.length || chars.length">
    <div class="recent-chars-wrapper">
      <div class="section-title">Recent Characters</div>

      <div class="recent-chars" v-if="chars.length">
        <div class="panel panel-shadow recent-char" v-for="char in chars" :key="char.id">
          <div>
            <div class="char-name">{{ char.name }}</div>
            <div class="char-info">{{ char.world_name }}</div>
          </div>
          <div class="enter-world">
            <button
              class="btn-small play-as"
              @click="onTransfer(char)"
              v-if="char.can_transfer && !$store.state.auth.user.is_temporary"
            >TRANSFER {{ char.name.toUpperCase() }}</button>
            <button
              class="btn-small play-as"
              @click="onEnter(char)"
              v-else
            >PLAY AS {{ char.name.toUpperCase() }}</button>
          </div>
        </div>
      </div>
      <div v-else>No characters created.</div>
    </div>

    <div class="your-worlds-wrapper">
      <div class="your-worlds">
        <div class="section-title">Worlds</div>

        <div class="user-worlds-container">
          <router-link
            v-for="world in worlds"
            :key="world.id"
            :to="{ name: LOBBY_WORLD_DETAIL, params: {world_id: world.id}}"
            class="user-world world-info"
            :class="{['world-' + world.id]: true}"
            :style="backgroundImage(world)"
          >
            <div class="overlay">
              <div class="title">{{ world.name.toUpperCase() }}</div>

              <div class="num-characters">{{ world.num_user_characters }} characters</div>
            </div>
          </router-link>

          <router-link :to="create_link" class="w-full">
            <button class="btn btn-add create-world">CREATE WORLD</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import {
  BUILDER_WORLD_INDEX,
  LOBBY_WORLD_DETAIL,
  BUILDER_WORLD_CREATE,
  LOBBY_WORLD_TRANSFER
} from "@/router";
import { INTRO_WORLD_ID } from "@/config.ts";

@Component
export default class Lobby extends Vue {
  BUILDER_WORLD_INDEX = BUILDER_WORLD_INDEX;
  LOBBY_WORLD_DETAIL = LOBBY_WORLD_DETAIL;

  worlds: {}[] = [];
  //loaded: boolean = false;
  chars: {}[] = [];

  async mounted() {
    if (this.$store.state.auth.user.is_temporary) {
      this.$router.push({
        name: LOBBY_WORLD_DETAIL,
        params: {
          world_id: INTRO_WORLD_ID
        }
      });
    }

    const worlds_promise = axios.get("lobby/worlds/user/?page_size=50");
    const chars_promise = axios.get("lobby/chars/recent/");

    const [worlds_resp, chars_resp] = await Promise.all([
      worlds_promise,
      chars_promise
    ]);

    this.worlds = worlds_resp.data.results;
    this.chars = chars_resp.data.results;

    //this.loaded = true;
  }

  get create_link() {
    return {
      name: BUILDER_WORLD_CREATE
    };
  }

  onEnter(char) {
    this.$store.dispatch("game/world_enter", {
      player_id: char.id,
      world_id: this.$route.params.world_id
    });
  }

  onTransfer(char) {
    this.$router.push({
      name: LOBBY_WORLD_TRANSFER,
      params: {
        player_id: char.id,
        world_id: this.$route.params.world_id
      }
    });
  }

  backgroundImage(world) {
      // Currently, the API returns the location of the banner so that it can
      // be changed on the fly. Unfortunately it returns a full path and webpack
      // wants to know which directories to include at runtime, so we have
      // to do a bit of work here.

      let imagePath = world && world.small_background,
        fileName = "world-home-bg.jpg";

      if (imagePath) {
        const pathElements = imagePath.split("/");
        fileName = pathElements[pathElements.length - 1];
      }
      return {
        backgroundImage: `url(/ui/lobby/${fileName})`
      };
    }

}
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

.worlds-lobby {
  position: relative;

  display: flex;
  margin: 0 auto;

  margin-top: 20px;

  @media (min-width: 800px) {
    flex-direction: row-reverse;
    justify-content: space-around;
    flex-grow: 1;
    max-width: 900px;
    margin-top: 50px;
    margin-bottom: 50px;

    > div {
      box-sizing: content-box;
      &:nth-child(even) {
        padding-right: 25px;
      }
      &:nth-child(odd) {
        padding-left: 25px;
      }
    }
  }

  @media (max-width: 800px) {
    flex-direction: column;
    margin-bottom: 30px;
  }

  .section-title {
    @include font-title-light;
    color: $color-secondary;
    font-size: 30px;
    line-height: 29px;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .your-worlds-wrapper {
    width: 375px;

    .your-worlds {
      max-width: 370px;
      margin: 0 auto;

      .user-worlds-container {
        display: flex;
        flex-wrap: wrap;

        .empty-user-worlds {
          max-width: 226px;
        }
      }

      .create-world {
        font-size: 15px;
        letter-spacing: 1.12px;
        line-height: 18px;
        height: 86px;
        margin-bottom: 20px;
      }
    }
  }

  .recent-chars-wrapper {
    width: 375px;

    .recent-char {
      //box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
      // background: $color-background-light;
      // border: 1px solid $color-background-light-border;
      color: $color-text-gray;
      width: 370px;
      height: 73px;
      margin-bottom: 20px;
      padding: 10px;

      .char-name {
        @include font-text-regular;
        line-height: 20px;
      }

      .char-info {
        @include font-text-light;
        line-height: 23px;
        color: $color-text-hex-50;
      }

      display: flex;
      justify-content: space-between;
    }
  }

  .world-info {
    background: #332d25;

    a {
      @include font-title-regular;
      letter-spacing: 1.3px;
    }

    .title {
      @include font-title-regular;
      text-align: center;
      font-size: 22px;
      letter-spacing: 1.14px;
      line-height: 27px;
      color: $color-text;

      a {
        color: $color-text;
        margin: 0 auto;
      }
    }

    &:hover {
      cursor: pointer;
      .title,
      .title > a {
        color: $color-primary;
        text-decoration: underline;
      }
    }

    .actions {
      @include font-title-regular;
      letter-spacing: 0.9px;
      line-height: 17px;
      color: $color-primary;
      font-size: 14px;
      text-align: center;

      a {
        margin: 0 auto;
      }
      a:hover {
        text-decoration: underline;
      }
    }

    .num-characters {
      color: $color-text-hex-50;
      // color: white;
      // opacity: 0.5;
      line-height: 16px;
      font-size: 12px;
      position: absolute;
      bottom: 15px;
      text-align: center;
      width: 100%;
    }

    &.user-world {
      width: 370px;
      height: 166px;

      background: url("/ui/lobby/world-card-horizontal-bg@2x.jpg");
      background-size: 370px 166px;

      /*
      &.world-1 {
        background: url("/ui/lobby/unbroken.jpg");
        background-size: 370px 166px;
      }

      &.world-4 {
        background: url("/ui/lobby/tutorial.jpg");
        background-size: 370px 166px;
      }

      &.world-217 {
        background: url("/ui/lobby/bane.jpg");
        background-size: 370px 166px;
      }

      &.world-83 {
        background: url("/ui/lobby/wot.jpg");
        background-size: 370px 166px;
      }

      &.world-873 {
        background: url("/ui/lobby/dacrothea.jpg");
        background-size: 370px 166px;
      }
      */

      margin-bottom: 20px;
      position: relative;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);

      .overlay {
        width: 354px;
        height: 150px;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 8px;
        left: 8px;
      }

      .title {
        padding-top: 40px;
      }
      .actions {
        margin-top: 10px;
      }
    }
  }
}
</style>