<template>
  <div class="top-region">
    <div class="inner">
      <div class="game-logo"></div>
      <div class="world-title">
        <span>{{ world.name }}</span>
      </div>
      <div class="game-menu">
        <button type="button" class="btn btn-small" @click.stop="onClickMenu">&#9776;</button>
      </div>
    </div>
    <div class="menu-region" v-if="showMenu" v-closable="{ handler: 'onClickMenu'}">
      <div class="callout-actions point-up">
        <template v-if="$store.state.auth.user.is_temporary">
          <div class="action create-account" @click="saveCharacter">Save Character</div>
          <!-- should save -->
          <div class="action exit-demo" @click="onClickExit">Exit Introduction</div>
          <!-- should logout -->
        </template>
        <template v-else>
          <div class="action" @click="onClickSettings">
            <a href="#" class='settings' @click.prevent="onClickSettings">Settings</a>
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
          <div class="action" @click="onClickExit">
            <a href="#" class="exit-game" @click="onClickExit">Exit World</a>
          </div>
        </template>
      </div>
    </div>
    <img class="game-divider" src="~@/assets/ui/divider.svg" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import QuestLog from "../QuestLog.vue";
import WorldMap from "../WorldMap.vue";
import SaveUser from "@/views/SaveUser.vue";
import { UI_MUTATIONS } from "@/constants.ts";
import { FormElement } from "@/core/forms.ts";

@Component
export default class PanelTop extends Vue {
  showMenu: boolean = false;

  get world() {
    return this.$store.state.game.world;
  }

  onClickDocumentation() {
    window.open("https://docs.writtenrealms.com", "_blank");
  }
  onClickChatOnDiscord() {
    window.open('"https://discord.gg/a3u82tR', "_blank");
  }
  onClickPatreon() {
    window.open("https://www.patreon.com/writtenrealms", "_blank");
  }

  onClickMenu() {
    this.showMenu = !this.showMenu;
  }

  onClickExit() {
    this.$store.dispatch("game/cmd", "quit");
  }

  onClickQuestLog() {
    this.showMenu = false;
    const modal = {
      component: QuestLog,
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  onClickSettings() {
    this.showMenu = false;

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
  }

  onClickMap() {
    this.showMenu = false;
    const modal = { component: WorldMap };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  saveCharacter() {
    const modal = {
      component: SaveUser,
      options: {
        overlayClasses: ["save_user"],
      },
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
    this.showMenu = false;
  }
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