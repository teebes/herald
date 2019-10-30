<template>
  <div class="worlds-lobby" v-if="loaded">
    <div class="worlds-row">
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

      <div class="worlds-wrapper">
        <div class="worlds">
          <div class="section-title">Featured Worlds</div>

          <div class="user-worlds-container">
            <router-link
              v-for="world in featured_worlds"
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
          </div>
        </div>
      </div>
    </div>

    <div class="worlds-row discover" style="justify-content: center" v-if="discover_worlds.length">
      <div>
        <div class="section-title text-center">Discover</div>

        <carousel
          :per-page="1"
          :autoplay="true"
          :loop="true"
          style="width: 370px;"
          paginationColor="#424242"
          paginationActiveColor="#ebebeb"
          :autoplayTimeout="8000"
        >
          <slide v-for="world in discover_worlds" :key="world.id">
            <div
              style="width: 370px; height: 166px; margin: 0 auto"
              @click="clickDiscoverWorld(world)"
            >
              <div class="user-world world-info" :style="backgroundImage(world)">
                <div class="overlay">
                  <div class="title">{{ world.name.toUpperCase() }}</div>

                  <div class="num-characters">{{ world.num_user_characters }} characters</div>
                </div>
              </div>
            </div>
          </slide>
        </carousel>
      </div>
    </div>

    <div class="worlds-row mt-8">
      <!-- All Worlds -->
      <div class="worlds-wrapper all-worlds">
        <div class="worlds">
          <div class="section-title">All Worlds</div>
          <div class="user-worlds-container">
            <router-link
              v-for="world in all_worlds"
              :key="world.id"
              :to="{ name: LOBBY_WORLD_DETAIL, params: {world_id: world.id}}"
              class="user-world world-info"
              :style="backgroundImage(world)"
            >
              <div class="overlay">
                <div class="title">{{ world.name.toUpperCase() }}</div>

                <div class="num-characters">{{ world.num_user_characters }} characters</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Your Worlds -->
      <div class="worlds-wrapper your-worlds">
        <div class="worlds">
          <div class="section-title">Your Worlds</div>
          <div class="user-worlds-container">
            <router-link
              v-for="world in user_worlds"
              :key="world.id"
              :to="{ name: LOBBY_WORLD_DETAIL, params: {world_id: world.id}}"
              class="user-world world-info"
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
import { World } from "@/core/interfaces.ts";

@Component
export default class Lobby extends Vue {
  BUILDER_WORLD_INDEX = BUILDER_WORLD_INDEX;
  LOBBY_WORLD_DETAIL = LOBBY_WORLD_DETAIL;

  // deprecated
  worlds: {}[] = [];

  chars: {}[] = [];
  featured_worlds: World[] = [];
  discover_worlds: World[] = [];
  all_worlds: World[] = [];
  user_worlds: World[] = [];

  loaded: boolean = false;

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
    const featured_worlds_promise = axios.get(
      "lobby/worlds/featured/?page_size=2"
    );
    const discover_worlds_promise = axios.get("lobby/worlds/discover/");
    const all_worlds_promise = axios.get("lobby/worlds/all/");
    const user_worlds_promise = axios.get("lobby/worlds/user/");

    const [
      chars_resp,
      featured_worlds_resp,
      discover_worlds_resp,
      all_worlds_resp,
      user_worlds_resp
    ] = await Promise.all([
      //worlds_promise,
      chars_promise,
      featured_worlds_promise,
      discover_worlds_promise,
      all_worlds_promise,
      user_worlds_promise
    ]);

    //this.worlds = worlds_resp.data.results;
    this.chars = chars_resp.data.results;
    this.featured_worlds = featured_worlds_resp.data.results;
    this.discover_worlds = discover_worlds_resp.data.results;
    this.all_worlds = all_worlds_resp.data.results;
    this.user_worlds = user_worlds_resp.data.results;
    this.loaded = true;
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
    // Custom world background images can be set provided that the assets
    // have been installed.

    let imagePath = world && world.small_background,
      imageUrl;

    if (/http(s)?:\/\//.test(imagePath)) {
      imageUrl = imagePath;
    } else if (imagePath) {
      // legacy method, where the full (but relative) path was specified to find
      // the asset. New way is either just set filename, or supply a url. THis branch
      // handles the 'just set the filename', including stripping its old (and likely
      // obsolete) path.
      const pathElements = imagePath.split("/");
      const fileName = pathElements[pathElements.length - 1];
      imageUrl = `/ui/lobby/${fileName}`;
    } else {
      imageUrl = `/ui/lobby/world-home-bg.jpg`;
    }
    return {
      backgroundImage: `url(${imageUrl})`
    };
  }

  clickDiscoverWorld(world) {
    this.$router.push({
      name: LOBBY_WORLD_DETAIL,
      params: { world_id: world.id }
    });
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

$lobby-wide-width: 850px;
$lobby-breakpoint: 760px;

.worlds-lobby {
  position: relative;

  display: flex;
  flex-direction: column;

  margin: 0 auto;

  margin-top: 20px;
  width: 100%;

  @media (min-width: $lobby-breakpoint) {
    max-width: $lobby-wide-width;
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .worlds-row {
    display: flex;
    flex-direction: row-reverse;
    @media (min-width: $lobby-breakpoint) {
      flex-direction: row-reverse;
      justify-content: space-between;
      flex-grow: 1;

      > div {
        box-sizing: content-box;
        &:nth-child(even) {
          // padding-right: 50px;
        }
        &:nth-child(odd) {
          // padding-left: 50px;
        }
      }
    }

    @media (max-width: $lobby-breakpoint) {
      flex-direction: column;
      margin-bottom: 30px;
      align-items: center;
    }

    &.discover {
      margin: 0;
      @media (min-width: $lobby-breakpoint) {
        margin-top: 60px;
        margin-bottom: 20px;
      }
    }

    @media (max-width: $lobby-breakpoint) {
      .all-worlds {
        order: 2;
      }
      .your-worlds {
        order: 1;
      }
    }
  }

  .section-title {
    @include font-title-light;
    color: $color-secondary;
    font-size: 30px;
    line-height: 29px;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .worlds-wrapper {
    width: 375px;

    .worlds {
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

  .VueCarousel-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>