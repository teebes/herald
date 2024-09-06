<template>
  <div id="full-screen-message" v-if="full_screen_message">{{ full_screen_message }}</div>
  <div id="transition-screen"
       v-else-if="transfer_to.world_name">
       <div class="instance-world"
            :style="{ backgroundImage: 'url(' + transfer_to.banner_url + ')' }">
            <div class="instance-world-overlay">
              <div class='instance-world-title'>
                {{ transfer_to.world_name.toUpperCase() }}
              </div>
              <div>Loading...</div>
            </div>
        </div>
  </div>
  <div id="game" v-else-if="loaded" class="flex flex-grow">
    <component
      :is="gameComponent"
      :width="width"
      class="flex-grow"
      v-if="store.state.game.is_connected"
    ></component>
  </div>
  <div v-else>Loading...</div>
</template>

<script type="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import AccessibleGame from "@/components/game/AccessibleGame.vue";
import AugmentedGame from "@/components/game/AugmentedGame.vue";
import _ from "lodash";

const store = useStore();
const router = useRouter();

const loaded = ref(false);
const width = ref(window.innerWidth);

const messages = computed(() => store.state.game.messages);
const isConnected = computed(() => store.state.game.is_connected);
const full_screen_message = computed(() => store.state.game.full_screen_message);
const transfer_to = computed(() => store.state.game.transfer_to);
const accessibility_mode = computed(() => store.state.auth.user.accessibility_mode);
const gameComponent = computed(() => accessibility_mode.value ? AccessibleGame : AugmentedGame);

const resize = _.debounce(() => {
  width.value = window.innerWidth;
  store.commit("game/width_set", width.value);
}, 500);

onMounted(() => {
  if (!store.state.game.player_id) {
    if (store.state.auth.user.is_temporary) {
      router.push({ name: 'home' });
      return;
    } else {
      router.push({ name: 'lobby' })
      return;
    }
  }
  loaded.value = true;
  window.addEventListener("resize", resize);
  store.commit("game/width_set", width.value);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

#full-screen-message {
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}

#game {
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  .game-frame {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    min-height: 0;
  }
}

#transition-screen {
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  position: relative;

  .instance-world{
    position: absolute;
    display: flex;
    flex-grow: 1;
    max-width: 1150px;
    width: 100%;
    height: 299px;
    background-size: 1150px 299px;

    .instance-world-overlay {
      position: absolute;
      background: linear-gradient(
        to bottom,
        $color-transparent-rgba,
        $color-background-rgba 100%);
      width: 100%;
      height: 299px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      color: $color-text-70;

      .instance-world-title {
        color: $color-text;
        @include font-title-regular;
        font-size: 30px;
        letter-spacing: 1.3px;
      }

    }
  }
}
</style>
