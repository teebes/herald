<template>
  <div id="console-wrapper">
    <div id="console" ref="console" @scroll="onScroll">
      <div class="buffer" :style="{ height: scrollHeight + 'px' }"></div>
      <div class="messages">
        <component
          v-for="(message, index) in messages"
          :key="message.message_id"
          :is="consoleMessage(message)"
          :message="message"
          :previousMessage="messages[index - 1]"
          :index="index"
          class="message"
          :class="[message.type]"
          :distanceToBottom="distanceToBottom"
          @scrollDown="scrollToBottom"
        />
      </div>
    </div>

    <ScrollTool
      v-if="!$store.state.game.is_mobile && distanceToBottom != 0"
      @clickScrollTool="scrollToBottom"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import EventBus from "@/core/eventbus.ts";
import Cast from "./consoleviews/Cast.vue";
import Chat from "./consoleviews/Chat.vue";
import CombatMessage from "./consoleviews/CombatMessage.vue";
import DeathMessage from "./consoleviews/DeathMessage.vue";
import Enquire from "./consoleviews/Enquire.vue";
import Equipment from "./consoleviews/Equipment.vue";
import Exits from "./consoleviews/Exits.vue";
import Factions from "./consoleviews/Factions.vue";
import Feats from "./consoleviews/Feats.vue";
import Help from "./consoleviews/Help.vue";
import Inventory from "./consoleviews/Inventory.vue";
import LookChar from "./consoleviews/LookChar.vue";
import LookItem from "./consoleviews/LookItem.vue";
import LookRoom from "./consoleviews/LookRoom.vue";
import MerchantInventory from "./consoleviews/MerchantInventory.vue";
import Message from "./consoleviews/Message.vue";
import OfferInventory from "./consoleviews/OfferInventory.vue";
import ScrollTool from "./ScrollTool.vue";
import Stats from "./consoleviews/Stats.vue";
import Upgrade from "./consoleviews/Upgrade.vue";
import Who from "./consoleviews/Who.vue";

import _ from "lodash";

@Component({
  components: {
    Cast,
    Chat,
    CombatMessage,
    DeathMessage,
    Enquire,
    Equipment,
    Exits,
    Factions,
    Feats,
    Help,
    Inventory,
    LookChar,
    LookItem,
    LookRoom,
    MerchantInventory,
    Message,
    OfferInventory,
    ScrollTool,
    Stats,
    Upgrade,
    Who
  }
})
export default class Console extends Vue {
  scrollHeight: number = 0;
  distanceToBottom: number = 0;

  consoleMessage(message) {
    const type = message.type;

    // Simple map from message type to console view
    const type_mapping = {
      "cmd.exits.success": "Exits",
      "cmd.feats.success": "Feats"
    };
    if (type_mapping[type]) return type_mapping[type];

    if (type === "cmd.look.success" && message.data.target_type === "item") {
      return "LookItem";
    } else if (
      type === "cmd.look.success" &&
      message.data.target_type === "char"
    ) {
      return "LookChar";
    } else if (
      type === "cmd.look.success" &&
      message.data.target_type === "room_detail"
    ) {
      return "Message";
    } else if (
      type === "cmd.look.success" ||
      type === "cmd.move.success" ||
      type === "affect.flee.success" ||
      type === "system.connect.success" ||
      type === "cmd.jump.success" ||
      type === "affect.death"
    ) {
      return "LookRoom";
    } else if (message.type === "cmd.inventory.success") {
      return "Inventory";
    } else if (message.type === "cmd.equipment.success") {
      return "Equipment";
    } else if (message.type === "cmd.stats.success") {
      return "Stats";
    } else if (message.type === "cmd.help.success") {
      return "Help";
    } else if (message.type === "cmd.factions.success") {
      return "Factions";
    } else if (message.type === "cmd.offer.success") {
      return "OfferInventory";
    } else if (message.type === "cmd.list.success") {
      return "MerchantInventory";
    } else if (message.type === "cmd.upgrade.success" && message.data.items) {
      return "Upgrade";
    } else if (message.type === "cmd.who.success") {
      return "Who";
    } else if (
      message.type === "notification.cmd.chat.success" ||
      message.type === "cmd.chat.success"
    ) {
      return "Chat";
    } else if (message.type === "notification.death") {
      return "DeathMessage";
    } else if (message.type === "cmd.enquire.success") {
      return "Enquire";
    } else if (
      message.type === "notification.combat.attack" ||
      message.type === "notification.combat.healing"
    ) {
      return "CombatMessage";
    } else if (
      message.data &&
      message.data.skill &&
      (message.data.method === "cast" || message.data.method === "channel") &&
      message.data.duration !== 0
    ) {
      return "Cast";
    }
    return "Message";
  }

  get messages() {
    return this.$store.getters["game/consoleMessages"];
    return _.filter(this.$store.state.game.messages, message => {
      return message.text || message.type === "system.connect.success";
    });
  }

  mounted() {
    const el = this.$refs.console as HTMLElement;
    this.scrollHeight = el.scrollHeight;
    this.scrollToBottom();
    EventBus.$on("scroll-down", this.scrollToBottom);
  }

  destroyed() {
    EventBus.$off("scroll-down", this.scrollToBottom);
  }

  updated() {
    if (this.distanceToBottom < 5) {
      this.scrollToBottom();
    } else {
      this.updateScroll();
    }
  }

  scrollToBottom() {
    const el = this.$refs.console as HTMLElement;
    if (!el) {
      return;
    }
    el.scrollTop = el.scrollHeight + 1000;
    this.distanceToBottom = 0;
  }

  onScroll = _.debounce(this.updateScroll, 250);

  updateScroll() {
    const el = this.$refs.console as HTMLElement;
    if (!el) {
      return;
    }
    this.distanceToBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
  }
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

#console-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  #console {
    height: 100%;
    position: relative;
    padding: 0 20px 8px 20px;
    margin-bottom: 8px;

    flex-grow: 1;
    overflow-y: auto;
    min-height: 0;
    display: flex;
    flex-direction: column;

    -webkit-overflow-scrolling: touch;

    .message {
      overflow-x: hidden;
      > div {
        overflow-x: hidden;
      }

      &.echo,
      &.grouped,
      &.room_write,
      &.affect\.cmd\.look\.success,
      &.affect\.idle\.timeout,
      &.notification\.cmd\.say\.success,
      &.notification\.cmd\.yell\.success,
      &.notification\.cmd\.chat\.success,
      &.notification\.tell,
      &.notification\.cmd\.emote\.success,
      &.notification\.movement\.enter,
      &.notification\.movement\.exit,
      &.notification\.decay,
      &.notification\.death {
        margin-top: 1rem;
      }

      &.room_write,
      &.write\.send,
      &.write\.sendexcept,
      &.write\.game,
      &.write\.zone {
        margin-top: 1rem;
        margin-bottom: 1rem;
      }

      &.notification\.cmd\.say\.success,
      &.notification\.cmd\.yell\.success,
      &.notification\.cmd\.chat\.success,
      &.cmd\.say\.success,
      &.cmd\.chat\.success,
      &.cmd\.yell\.success {
        color: $color-secondary;
      }

      &.cmd\.tell\.success,
      &.notification\.tell,
      &.cmd\.reply\.success {
        color: $color-red;
      }
    }
  }
}
</style>
