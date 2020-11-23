<template>
  <div id="mobilemenu">
    <div class="menu-item">
      <a href="#" @click.prevent="onClickSettings">Settings</a>
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
    <div class="menu-item">
      <a href="#" class="exit-game" @click.prevent="$store.dispatch('game/cmd', 'quit')">Exit World</a>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { UI_MUTATIONS } from "@/constants.ts";
import QuestLog from "../QuestLog.vue";
import { FormElement } from "@/core/forms.ts";

@Component
export default class MobileMenu extends Vue {
  get world() {
    return this.$store.state.game.world;
  }

  onClickQuestLog() {
    const modal = {
      component: QuestLog,
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  onClickSettings() {
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

    if (this.world.is_multiplayer) {
      schema.push({
        attr: "idle_logout",
        label: "Idle Auto-Logout",
        widget: "checkbox",
        help: `Whether to automatically log out after 10 minutes of inactivity.`,
      });
    }

    this.$store.commit("ui/modal_set", {
      title: `Edit Preferences`,
      data: this.$store.state.game.player_config,
      schema: schema,
      action: "game/save_player_config",
    });
    this.$emit("closeMenu");
  }
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