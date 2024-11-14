<template>
    <div class="menu-region" ref="outsideClickRef">
      <div class="callout-actions point-up">
        <template v-if="user.is_temporary">
          <div class="action create-account" @click="saveCharacter">Save Character</div>
          <div class="action exit-demo" @click="onClickExit">Exit Introduction</div>
        </template>
        <template v-else>
          <div class="action" @click="onClickSettings">
            <a href="#" class='settings' @click.prevent>Settings</a>
          </div>
          <div class="action" v-if="world.id === 2">
            <a href="#" @click.prevent="onClickMap">World Map</a>
          </div>
          <div class="action" @click="onClickDocumentation">
            <a href="https://docs.writtenrealms.com" target="_blank">Documentation</a>
          </div>
          <div class="action" @click="onClickChatOnDiscord">
            <a href="https://discord.gg/a3u82tR" target="_blank">Chat on Discord</a>
          </div>
          <div class="action" @click="onClickPatreon">
            <a href="https://www.patreon.com/writtenrealms">Support Us</a>
          </div>
          <div class="action" @click="onClickLeave" v-if="store.state.game.world.instance_of_id">
            <a href="#" class="exit-game" @click.prevent>Leave Instance</a>
          </div>
          <div class="action" @click="onClickExit" v-else>
            <a href="#" class="exit-game" @click.prevent>Exit World</a>
          </div>
        </template>
      </div>
    </div>
</template>


<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import SaveUser from "@/components/account/SaveUser.vue"
import WorldMap from "@/components/game/WorldMap.vue";
import { FormElement } from "@/core/forms";
import { onOutsideClick } from "@/composables/onOutsideClick";

const store = useStore();

const emit = defineEmits(['close']);

const outsideClickRef = onOutsideClick(() => {
  emit('close');
});

const world: any = computed(() => store.state.game.world);
const player: any = computed(() => store.state.game.player);
const user: any = computed(() => store.state.auth.user);


const onClickDocumentation = () => {
  emit('close');
  window.open("https://docs.writtenrealms.com", "_blank");
}

const onClickChatOnDiscord = () => {
  emit('close');
  window.open('https://discord.gg/a3u82tR', "_blank");
}

const onClickPatreon = () => {
  emit('close');
  window.open("https://www.patreon.com/writtenrealms", "_blank");
}

const onClickExit = () => {
  emit('close');
  store.dispatch("game/cmd", "quit");
}

const onClickLeave = () => {
  emit('close');
  store.dispatch("game/cmd", "leave");
}

const onClickSettings = () => {
  emit('close');

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
    {
      attr: "display_chat",
      label: "Display Chat",
      widget: "checkbox",
      help: `Whether to show chat messages.`,
    },
  ];

  if (world.is_multiplayer && player.is_immortal) {
    schema.push({
      attr: "idle_logout",
      label: "Idle Auto-Logout",
      widget: "checkbox",
      help: `Whether to automatically log out after 2 hours of inactivity.`,
    });
  }

  store.commit("ui/modal/open_form", {
    title: `Edit Preferences`,
    data: store.state.game.player_config,
    schema: schema,
    action: "game/save_player_config",
  });
}

const onClickMap = () => {
  emit('close');
  store.commit('ui/modal/open_view', {component: WorldMap});
}

const saveCharacter = () => {
  emit('close');
  store.commit('ui/modal/open_view', {
    component: SaveUser,
    options: {
      overlayClasses: ["save_user"],
      closeOnOutsideClick: true
    },
  });
}
</script>


<style lang='scss' scoped>
.menu-region {
  position: relative;

  .callout-actions {
    right: -31px;
    top: 3px;
  }
}
</style>