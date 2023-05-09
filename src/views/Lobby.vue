<template>
  <div class="worlds-lobby" v-if="loaded">

    <!-- Recent Chars & Featured -->
    <div class="recent-and-featured lobby-section">

      <!-- Recent Chars -->
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

      <!-- Featured Worlds -->
      <div class="featured-wrapper">
        <div class="worlds">
          <div class="section-title">Featured Worlds</div>

          <div class="user-worlds-container">
            <WorldCard
              v-for="world in featured_worlds"
              :key="world.id"
              :world="world"/>
          </div>
        </div>
      </div>
    </div>

    <div class="divider higher-divider" v-if="discover_worlds.length"></div>

    <!-- Staff Picks -->
    <div class="discover lobby-section" style="justify-content: center" v-if="discover_worlds.length">
      <div>
        <div class="section-title text-center namubumo">
          Staff Picks
        </div>

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
              <WorldCard :world="world"/>
            </div>
          </slide>
        </carousel>
      </div>
    </div>

    <div class="divider lower-divider"></div>
    
  
    <!-- Playing -->
    <div class="lobby-section playing">
      <div class="section-title">Playing</div>
      <div class="worlds-list-section-worlds"
           :class="{ two_length: playing_worlds.length === 2}">
        <WorldCard v-for="world in playing_worlds" :key="world.id" :world="world"/>
      </div>
      <router-link 
        :to="{ name: 'lobby_section', params: { section: 'playing' } }"
        class="lobby-section-link"
        v-if="playing_worlds.length > 0">
        View More
      </router-link>
      <div v-else>
        You are not currently playing any worlds. Create a character in one to populate this section.
      </div>
    </div>

    <!-- Building -->
    <div class="lobby-section building">
      <div class="section-title">Building</div>
      <div class="worlds-list-section-worlds"
           :class="{ two_length: playing_worlds.length === 1 }">
        <WorldCard v-for="world in building_worlds.slice(0, 2)" :key="world.id" :world="world"/>
        <router-link :to="create_link" class="create-world">
          <button class="btn btn-add">CREATE WORLD</button>
        </router-link>
      </div>
      <router-link 
        :to="{ name: 'lobby_section', params: { section: 'building' } }"
        class="lobby-section-link">
        View More
      </router-link>
    </div>

    <!-- Start Here-->
    <div class="lobby-section start-here">
        <div class="section-title">Start Here</div>
        <div class="worlds-list-section-worlds">
          <WorldCard v-for="world in intro_worlds" :key="world.id" :world="world"/>
        </div>
    </div>
    

    <div class="divider lower-divider"></div>

    <div class="lobby-section search">
      <div class="section-title">Search Worlds</div>
      <div class="search-row form-group">
        <input type="text" placeholder="Search for a world" v-model="search_query" @keyup.enter="onSearch">
        <!-- <button class="btn btn-small" @click="onSearch">SEARCH</button> -->
      </div>
      <div class="mb-8">
        <label class="color-text-60">
          <input type="checkbox" 
                 v-model="include_unreviewed"> Include unpublished worlds
        </label>
      </div>
      <div class="worlds-list-section-worlds search-worlds-results">
        <WorldCard v-for="world in search_worlds" :key="world.id" :world="world"/>
      </div>
    </div>

    <div class="divider lower-divider"></div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import axios from "axios";
import {
  BUILDER_WORLD_INDEX,
  LOBBY_WORLD_DETAIL,
  BUILDER_WORLD_CREATE,
  LOBBY_WORLD_TRANSFER
} from "@/router";
import { INTRO_WORLD_ID } from "@/config";
import { World } from "@/core/interfaces";
import WorldCard from "@/components/WorldCard.vue"

@Component({
  components: {
    WorldCard
  }
})
export default class Lobby extends Vue {
  BUILDER_WORLD_INDEX = BUILDER_WORLD_INDEX;
  LOBBY_WORLD_DETAIL = LOBBY_WORLD_DETAIL;

  // deprecated
  worlds: {}[] = [];

  chars: {}[] = [];
  featured_worlds: World[] = [];
  discover_worlds: World[] = [];
  building_worlds: World[] = [];
  playing_worlds: World[] = [];
  intro_worlds: World[] = [];

  loaded: boolean = false;

  // Search Fields
  search_query: string = "";
  search_worlds: World[] = [];
  include_unreviewed: boolean = true;

  async mounted() {
    if (this.$store.state.auth.user.is_temporary) {
      this.$router.push({
        name: LOBBY_WORLD_DETAIL,
        params: {
          world_id: INTRO_WORLD_ID
        }
      });
    }

    const chars_promise = axios.get("lobby/chars/recent/");
    const featured_worlds_promise = axios.get("lobby/worlds/featured/?page_size=2");
    const discover_worlds_promise = axios.get("lobby/worlds/discover/");
    const building_worlds_promise = axios.get("lobby/worlds/building/?page_size=3")
    const playing_worlds_promise = axios.get("lobby/worlds/playing/?page_size=3")
    const intro_worlds_promise = axios.get("lobby/worlds/intro/?page_size=3")

    const [
      chars_resp,
      featured_worlds_resp,
      discover_worlds_resp,
      building_worlds_resp,
      playing_worlds_resp,
      intro_worlds_resp
    ] = await Promise.all([
      chars_promise,
      featured_worlds_promise,
      discover_worlds_promise,
      building_worlds_promise,
      playing_worlds_promise,
      intro_worlds_promise
    ]);

  
    this.chars = chars_resp.data.results;
    this.featured_worlds = featured_worlds_resp.data.results;
    this.discover_worlds = discover_worlds_resp.data.results;
    this.playing_worlds = playing_worlds_resp.data.results;
    this.building_worlds = building_worlds_resp.data.results;
    this.intro_worlds = intro_worlds_resp.data.results;

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

  timeout: number | null = null;
  @Watch("search_query")
  onSearchQueryChange() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.onSearch();
    }, 500);
  }

  @Watch("include_unreviewed")
  onIncludeUnreviewedChange() {
    this.onSearch();
  }

  async onSearch() {
    const query = this.search_query.trim();
    const params = { q: query }

    if (this.include_unreviewed) {
      params["reviewed"] = false;
    } else {
      params["reviewed"] = true;
    }

    const resp = await axios.get("lobby/worlds/search/", {
      params: params
    });
    this.search_worlds = resp.data.results;
  }
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";


.worlds-lobby {
  position: relative;

  display: flex;
  flex-direction: column;

  margin: 0 auto;

  margin-top: 20px;
  width: 100%;
  max-width: $lobby-wide-width;

  .world-card { margin-bottom: 20px; }

  .divider {
    margin: 60px 0 20px 0;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: $lobby-breakpoint) {
    margin-top: 50px;
    margin-bottom: 50px;

    .higher-divider {
      margin-top: 80px;
    }
    .lower-divider {
      margin-bottom: 40px;
    }
  }

  /* 
    Horizontal section of the lobby, capped at 850 width and 
    centered at lower widths.
  */
  .lobby-section {
    width: 100%;
    max-width: 850px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    @media (min-width: $lobby-breakpoint) {
      justify-content: space-between;

      &.recent-and-featured {
        flex-direction: row-reverse;
      }
    }

    @media (max-width: $lobby-breakpoint) {
      align-items: center;
    }

    &.discover {
      margin: 0;
      align-items: center;
      @media (min-width: $lobby-breakpoint) {
        margin: 20px 0 0 0;
      }
    }

    &.playing, &.building {
      margin-bottom: 20px;
    }

    a.lobby-section-link {
      color: $color-text-hex-50;
      &:hover { color: $color-primary; }
    }

    .worlds-list-section-worlds {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      &.two_length {
        justify-content: flex-start;
        > .world-card { margin-right: 20px; }
      }

      &.search-worlds-results {
        // justify-content: flex-start;
        flex-wrap: wrap;
      }

      @media (max-width: $lobby-breakpoint) {
        flex-direction: column;
      }

      > .world-card {
        @media (min-width: $lobby-breakpoint) {
          max-width: 270px;
          max-height: 140px;
        }
        // .num-characters { display: none }
      }

      .create-world {
        width: 270px;
        height: 140px;

        > button { 
          height: 100%; 
          font-size: 15px;
          letter-spacing: 1.12px;
          line-height: 18px;
        }
      }
    }

    .search-row {
      max-width: 400px;
      display: flex;
      flex-direction: row;
      > button { margin-left: 20px; }
    }
  }

  .featured-wrapper { 
    width: 375px; 
  }

  .recent-chars-wrapper {
    width: 375px;

    .recent-char {
      color: $color-text-gray;
      width: 370px;
      height: 73px;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
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

  .VueCarousel-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .namubumo {
    a { color: $color-secondary; }
    a { 
      &:hover { 
        text-decoration: none; 
        color: $color-primary; 
      }
    }
  }
}
</style>