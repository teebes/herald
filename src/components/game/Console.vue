<template>
  <div id="console" ref="console" @scroll="onScroll">
    <div class="buffer" :style="{ height: scrollHeight + 'px'}"></div>
    <div class="messages">
      <component
        v-for="(message, index) in messages"
        :key="message.receive_ts"
        :is="consoleMessage(message)"
        :message="message"
        :previousMessage="messages[index - 1]"
        :index="index"
        class="message"
        :class="[message.type]"
      />
    </div>
    <ScrollTool
      v-if="!$store.state.game.is_mobile && distanceToBottom != 0"
      @clickScrollTool="scrollToBottom"
    />
    <div ref="bottom"></div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Cast from "./consoleviews/Cast.vue";
import CombatMessage from "./consoleviews/CombatMessage.vue";
import DeathMessage from "./consoleviews/DeathMessage.vue";
import Equipment from "./consoleviews/Equipment.vue";
import Factions from "./consoleviews/Factions.vue";
import Help from "./consoleviews/Help.vue";
import Inventory from "./consoleviews/Inventory.vue";
import LookChar from "./consoleviews/LookChar.vue";
import LookItem from "./consoleviews/LookItem.vue";
import LookRoom from "./consoleviews/LookRoom.vue";
import MerchantInventory from "./consoleviews/MerchantInventory.vue";
import Message from "./consoleviews/Message.vue";
import OfferInventory from "./consoleviews/OfferInventory.vue";
import Stats from "./consoleviews/Stats.vue";
import Upgrade from "./consoleviews/Upgrade.vue";
import Who from "./consoleviews/Who.vue";
import ScrollTool from "./ScrollTool.vue";

import _ from "lodash";

@Component({
  components: {
    Cast,
    CombatMessage,
    DeathMessage,
    Equipment,
    Factions,
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
    if (type === "cmd.look.success" && message.data.target_type === "item") {
      return "LookItem";
    } else if (
      type === "cmd.look.success" &&
      message.data.target_type === "char"
    ) {
      return "LookChar";
    } else if (
      type === "cmd.look.success" ||
      type === "cmd.move.success" ||
      type === "cmd.flee.success" ||
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
    } else if (message.type === "notification.death") {
      return "DeathMessage";
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
  }

  updated() {
    if (this.distanceToBottom < 5) {
      this.scrollToBottom();
    } else {
      this.updateScroll();
    }
  }

  scrollToBottom() {
    const bottom = this.$refs.bottom as HTMLElement;
    bottom && bottom.scrollIntoView();
    this.distanceToBottom = 0;
  }

  onScroll = _.debounce(this.updateScroll, 250);

  updateScroll() {
    const el = this.$refs.console as HTMLElement;
    this.distanceToBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
  }
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

#console {
  //border: 1px solid #444;
  padding: 0 20px 8px 20px;
  margin-bottom: 8px;

  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;

  -webkit-overflow-scrolling: touch;

  .interactable {
    @include font-text-regular;
    border-bottom: 1px dotted #888;
    cursor: pointer;
  }

  .message {
    &.echo,
    &.grouped,
    &.room_write,
    &.affect\.cmd\.look\.success,
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

    &.notification\.cmd\.say\.success,
    &.notification\.cmd\.yell\.success,
    &.notification\.cmd\.chat\.success,
    &.cmd\.say\.success,
    &.cmd\.chat\.success,
    &.cmd\.yell\.success {
      color: $color-secondary;
    }

    &.cmd\.tell\.success,
    &.notification\.tell {
      color: $color-red;
    }
  }
}
</style>