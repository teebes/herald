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
              <button class="btn-small play-as" @click="onTransfer(char)"
                v-if="char.can_transfer && !store.state.auth.user.is_temporary">TRANSFER {{ char.name.toUpperCase()
                }}</button>
              <button class="btn-small play-as" @click="onEnter(char)" v-else>PLAY AS {{ char.name.toUpperCase()
                }}</button>
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
            <WorldCard v-for="world in featured_worlds" :key="world.id" :world="world" />
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

        <div class="carousel-container">
          <div class="carousel" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div class="slide" v-for="world in discover_worlds" :key="world.id">
              <div style="width: 370px; height: 166px; margin: 0 auto" @click="clickDiscoverWorld(world)">
                <WorldCard :world="world" />
              </div>
            </div>
          </div>
          <button class="carousel-control prev" @click="prevSlide">‹</button>
          <button class="carousel-control next" @click="nextSlide">›</button>
        </div>
      </div>
    </div>

    <div class="divider lower-divider"></div>


    <!-- Playing -->
    <div class="lobby-section playing">
      <div class="section-title">Playing</div>
      <div class="worlds-list-section-worlds" :class="{ two_length: playing_worlds.length === 2 }">
        <WorldCard v-for="world in playing_worlds" :key="world.id" :world="world" />
      </div>
      <router-link :to="{ name: 'lobby_section', params: { section: 'playing' } }" class="lobby-section-link"
        v-if="playing_worlds.length > 0">
        View More
      </router-link>
      <div v-else>
        You are not currently playing any worlds. Create a character in one to populate this section.
      </div>
    </div>

    <!-- In Development -->
    <div class="lobby-section dev" v-if="dev_worlds.length">
      <div class="section-title">In Development</div>
      <div class="worlds-list-section-worlds" :class="{ two_length: dev_worlds.length === 2 }">
        <WorldCard v-for="world in dev_worlds" :key="world.id" :world="world" />
      </div>
    </div>

    <!-- Building -->
    <div class="lobby-section building">
      <div class="section-title">Building</div>
      <div class="worlds-list-section-worlds" :class="{ two_length: playing_worlds.length === 1 }">
        <WorldCard v-for="world in building_worlds.slice(0, 2)" :key="world.id" :world="world" />
        <router-link :to="{ name: 'world-create'}" class="create-world">
          <button class="btn btn-add">CREATE WORLD</button>
        </router-link>
      </div>
      <router-link :to="{ name: 'lobby_section', params: { section: 'building' } }" class="lobby-section-link">
        View More
      </router-link>
    </div>

    <!-- Start Here-->
    <div class="lobby-section start-here">
      <div class="section-title">Start Here</div>
      <div class="worlds-list-section-worlds">
        <WorldCard v-for="world in intro_worlds" :key="world.id" :world="world" />
      </div>
      <router-link :to="{ name: 'lobby_section', params: { section: 'public' } }" class="all-public-worlds-link color-primary">
        View All Public Worlds
      </router-link>
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
          <input type="checkbox" v-model="include_unreviewed"> Include unpublished worlds
        </label>
      </div>
      <div class="worlds-list-section-worlds search-worlds-results">
        <WorldCard v-for="world in search_worlds" :key="world.id" :world="world" />
      </div>
    </div>

    <div class="divider lower-divider lowest-divider"></div>

  </div>
  <div v-else class="loading-container">
    <div class="spinner"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import { World } from "@/core/interfaces";
import WorldCard from "@/components/lobby/WorldCard.vue"


const chars = ref<any[]>([]);
const featured_worlds = ref<World[]>([]);
const discover_worlds = ref<World[]>([]);
const dev_worlds = ref<World[]>([]);
const building_worlds = ref<World[]>([]);
const playing_worlds = ref<World[]>([]);
const intro_worlds = ref<World[]>([]);

const loaded = ref<boolean>(false);
// Carousel
const currentIndex = ref(0);
let intervalId: ReturnType<typeof setTimeout> | null = null;

// Search Fields
const search_query = ref<string>('');
const search_worlds = ref<World[]>([]);
const include_unreviewed = ref<boolean>(true);

const store = useStore();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  if (store.state.auth.user.is_temporary) {
    await store.dispatch('auth/logout');
    router.push({name: 'home'});
  }

  const lobby_data = await axios.get('lobby/');

  chars.value = lobby_data.data.recent_characters;
  featured_worlds.value = lobby_data.data.featured;
  discover_worlds.value = lobby_data.data.staff_picks;
  playing_worlds.value = lobby_data.data.playing;
  dev_worlds.value = lobby_data.data.in_development;
  building_worlds.value = lobby_data.data.building;
  intro_worlds.value = lobby_data.data.intro;

  loaded.value = true;
  startAutoSlide();
});

const onEnter = (char) => {
  store.dispatch('game/request_enter_world', {
    player_id: char.id,
    world_id: char.world_id
  });
  // const cod_accepted = this.$store.state.auth.user.cod_accepted;
  // if (cod_accepted) {
  //   this.$store.dispatch(GAME_ACTIONS.REQUEST_ENTER_WORLD, {
  //     player_id: char.id,
  //     world_id: char.world_id
  //   });
  // } else {
  //   const modal = {
  //     component: CodeOfConduct,
  //     options: { closeOnOutsideClick: true },
  //     action: "auth/accept_code_of_conduct"
  //   };
  //   this.$store.commit("ui/modal_set", modal);
  // }
}

const onTransfer = (char) => {
  router.push({
    name: 'lobby_world_transfer',
    params: {
      player_id: char.id,
      world_id: route.params.world_id
    }
  });

}

const clickDiscoverWorld = (world) => {
  router.push({
    name: 'lobby_world_details',
    params: { world_id: world.id }
  });
};

let timeout: ReturnType<typeof setTimeout> | null = null;
watch(search_query, () => {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    onSearch();
  }, 500);
});

watch(include_unreviewed, () => {
  onSearch();
});

const onSearch = async () => {
  const query = search_query.value.trim();
  const params = { q: query };

  if (include_unreviewed.value) {
    params['reviewed'] = false;
  } else {
    params['reviewed'] = true;
  }

  const resp = await axios.get('lobby/worlds/search/', {
    params: params
  });
  search_worlds.value = resp.data.results;
};

// Carousel

const startAutoSlide = () => {
  intervalId = setInterval(() => {
    nextSlide();
  }, 8000);
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % discover_worlds.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + discover_worlds.value.length) % discover_worlds.value.length;
};

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
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

  .world-card {
    margin-bottom: 20px;
  }

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

  @media (max-width: $lobby-breakpoint) {
    .divider.lower-divider.lowest-divider {
      margin-top: 0;
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

      .carousel-container {
        position: relative;
        width: 370px;
        overflow: hidden;

        .carousel {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }

        .slide {
          min-width: 100%;
          box-sizing: border-box;
        }

        .carousel-control {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
        }

        .prev {
          left: 0;
        }
      }
    }

    &.playing,
    &.building {
      margin-bottom: 20px;
    }

    a.lobby-section-link {
      color: $color-text-hex-50;

      &:hover {
        color: $color-primary;
      }
    }

    .worlds-list-section-worlds {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      &.two_length {
        justify-content: flex-start;

        >.world-card {
          margin-right: 20px;
        }
      }

      &.search-worlds-results {
        // justify-content: flex-start;
        flex-wrap: wrap;
      }

      @media (max-width: $lobby-breakpoint) {
        flex-direction: column;
      }

      >.world-card {
        @media (min-width: $lobby-breakpoint) {
          max-width: 270px;
          max-height: 140px;
        }

        // .num-characters { display: none }
      }

      .create-world {
        width: 270px;
        height: 140px;

        @media (max-width: $lobby-breakpoint) {
          width: 100%;
          margin-bottom: 1rem;
        }

        >button {
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

      >button {
        margin-left: 20px;
      }
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

  .namubumo {
    a {
      color: $color-secondary;
    }

    a {
      &:hover {
        text-decoration: none;
        color: $color-primary;
      }
    }
  }
}


</style>