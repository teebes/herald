<template>
  <div id="augmented-game-desktop" class="flex flex-grow flex-row game-frame">
    <Panel />

    <div class="flex flex-grow">
      <div class="flex-grow flex flex-col">
        <Console :messages="messages" class="flex-grow" />
        <Hint v-if="hint" class="flex-shrink-0" />
        <Input @input="onInput" class="flex-shrink-0" />
      </div>
    </div>

    <Sidebar v-if="width > 1000" class="flex-shrink-0" />

    <!-- <div
      class="desktop-lookup"
      v-if="lookup"
      v-closable="{ handler: 'closeLookup' }"
      :style="lookupPosition"
    >
      <Lookup />
    </div> -->

    <div
      class="desktop-lookup"
      v-if="lookup"
      :style="lookupPosition"
      @mouseleave="onMouseOut"
      @mouseover="onMouseover"
    >
      <Lookup />
    </div>


  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Input from "@/components/game/Input.vue";
import Console from "@/components/game/console/Console.vue";
import Panel from "@/components/game/desktop/Panel.vue";
import Lookup from "@/components/game/lookup/Lookup.vue";
import Hint from "@/components/game/console/Hint.vue";
import Sidebar from "@/components/game/sidebar/Sidebar.vue";
import _ from "lodash";


defineProps<{
  width: number;
}>();

const store = useStore();

const messages = computed(() => {
  return store.state.game.messages.filter(
    (message) => message.type !== "notification.regen"
  );
});
const lookup = computed(() => store.state.game.lookup);
const hint = computed(() => store.state.game.hint);
const hover_entity = computed(() => store.state.game.hover_entity);

const emit = defineEmits(["input"]);

const lookupPosition = computed(() => {
  if (!lookup.value) {
    return {};
  }

  let left = 50;
  if (lookup.value.position) {
    left = 50 + lookup.value.position.left;
  }

  if (lookup.value.side === "right") {
    left -= 355;
  }

  let top = 0;
  if (lookup.value.position) {
    top = lookup.value.position.top;
  }

  return {
    left: left + "px",
    bottom: window.innerHeight - top + "px",
    "z-index": "10 !important"
  };
});

const onInput = (args) => {
    emit("input", args);
}

const closeLookup = () => {
  if (hover_entity.value && lookup.value && hover_entity.value.key === lookup.value.key) {
    return;
  }
  store.commit("game/lookup_clear");
  store.commit("game/popup_hover_set", false);
};

const onMouseover = () => {
  store.commit("game/popup_hover_set", true);
}

const onMouseOut = _.debounce(closeLookup, 150);
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";

#augmented-game-desktop {
  @media ($game-mobile-site) {
    display: none;
  }

  position: relative;

  .desktop-lookup {
    position: absolute;
    // Safari layering bug
    -webkit-transform: translate3d(0, 0, 0);
  }

  #input {
    padding: 0 20px;
  }
}
</style>
