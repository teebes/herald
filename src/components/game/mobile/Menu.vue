<template>
  <div id="mobilemenu" ref="outsideClickRef">
    <div class="menu-item">
      <a href="#" @click.prevent="onClickSettings">Settings</a>
    </div>
    <div class="menu-item" v-if="world.id === 2">
      <a href="#" @click.prevent="onClickMap">World Map</a>
    </div>
    <div class="menu-item">
      <a href="#" @click.prevent="onClickQuestLog">Quest Log</a>
    </div>
    <div class="menu-item">
      <a href="https://discord.gg/a3u82tR" target="_blank">Chat on Discord</a>
    </div>
    <div class="menu-item">
      <a href="https://www.patreon.com/writtenrealms" target="_blank">Support Us</a>
    </div>
    <div class="menu-item" v-if="store.state.game.world.instance_of_id">
      <a href="#" class="exit-game" @click.prevent="store.dispatch('game/cmd', 'leave')">Leave Instance</a>
    </div>
    <div class="menu-item" v-else>
      <a href="#" class="exit-game" @click.prevent="store.dispatch('game/cmd', 'quit')">Exit World</a>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import QuestLog from "@/components/game/QuestLog.vue";
import { FormElement } from "@/core/forms.ts";
import { onOutsideClick } from "@/composables/onOutsideClick";
import WorldMap from "@/components/game/WorldMap.vue";

const store = useStore();
const emit = defineEmits(["closeMenu"]);

const outsideClickRef = onOutsideClick(() => {
  emit('closeMenu');
});

const world = computed(() => store.state.game.world);

const onClickQuestLog = () => {
  store.commit('ui/modal/open_view', {component: QuestLog});
};

const onClickSettings = () => {
  const schema: FormElement[] = [
    {
      attr: "room_brief",
      label: "Room Brief Mode",
      widget: "checkbox",
      help: `In room brief mode, room descriptions are only shown when using the 'look' command. For other actions, such as moving or fleeing, they will not.`,
    },
    {
      attr: "combat_brief",
      label: "Combat Brief Mode",
      widget: "checkbox",
      help: `In combat brief mode, the combat text is abbreviated and indented so that it can be scanned more quickly.`,
    },
  ];

  if (world.value.is_multiplayer) {
    schema.push({
      attr: "idle_logout",
      label: "Idle Auto-Logout",
      widget: "checkbox",
      help: `Whether to automatically log out after 10 minutes of inactivity.`,
    });
  }

  schema.push({
    attr: "mobile_map_width",
    label: "Map Width",
  })

  store.commit('ui/modal/open_form', {
    title: `Edit Preferences`,
    data: store.state.game.player_config,
    schema: schema,
    action: "game/save_player_config",
  });
  emit("closeMenu");
};

const onClickMap = () => {
  emit('closeMenu');
  store.commit('ui/modal/open_view', {
    component: WorldMap,
    options: {
      closeOnOutsideClick: true,
    }
  });
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

#mobilemenu {
  border-top: 1px solid $color-background-light-border;
  position: absolute;
  background: $color-background-black;
  width: 100%;
  bottom: 60px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .menu-item {
    padding: 20px;
    width: 85%;
    text-align: center;

    &:not(:last-child) {
      border-bottom: 1px solid $color-background-light-border;
    }

    a {
      color: $color-text;
      @include font-title-light;
      font-size: 19px;
    }
  }
}
</style>