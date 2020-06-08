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
          <div class="action">
            <a href="#" class='settings' @click.prevent="onClickSettings">Settings</a>
          </div>
          <div class="action">
            <a href="https://docs.writtenrealms.com" target="_blank">Documentation</a>
          </div>
          <div class="action">
            <a href="https://discord.gg/a3u82tR" target="_blank">Chat on Discord</a>
          </div>
          <div class="action">
            <a href="https://www.patreon.com/writtenrealms">Support Us</a>
          </div>
          <div class="action">
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
import SaveUser from "@/views/SaveUser.vue";
import { UI_MUTATIONS } from "@/constants.ts";
import { FormElement } from "@/core/forms.ts";

@Component
export default class PanelTop extends Vue {
  showMenu: boolean = false;

  get world() {
    return this.$store.state.game.world;
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
      component: QuestLog
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  onClickSettings() {
    /*
    const schema: FormElement[] = [
        {
          attr: 'room_brief',
          label: 'Room brief mode',
        },
        {
          attr: 'combat_brief',
          label: 'Combat brief mode',
        }
      ];
    */
    this.$store.commit("ui/modal_set", {
      title: `Edit Preferences`,
      data: this.$store.state.game.player_config,
      schema: schema,
      action: "game/save_player_config"
    });
  }

  saveCharacter() {
    const modal = {
      component: SaveUser,
      options: {
        overlayClasses: ["save_user"]
      }
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