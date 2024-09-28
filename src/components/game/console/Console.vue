<template>
  <div id="console-wrapper">
    <div id="console" @scroll="onScroll">
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
          :class="[message.type, {grouped: isGrouped(message, messages[index - 1])}]"
          :distanceToBottom="distanceToBottom"
          @scrollDown="scrollToBottom"
        />
      </div>
    </div>

    <ScrollTool
      v-if="!is_mobile && distanceToBottom != 0"
      @clickScrollTool="scrollToBottom"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, onUpdated, ref } from 'vue';
import { useStore } from 'vuex';
import _ from "lodash";
import Cast from "@/components/game/console/Cast.vue";
import Chat from '@/components/game/console/Chat.vue';
import CombatMessage from '@/components/game/console/CombatMessage.vue';
import Compare from '@/components/game/console/Compare.vue';
import DeathMessage from '@/components/game/console//DeathMessage.vue';
import Effect from '@/components/game/console/Effect.vue';
import Enquire from '@/components/game/console//Enquire.vue';
import Equipment from "@/components/game/console/Equipment.vue";
import EventBus from "@/core/eventbus";
import Exits from "@/components/game/console/Exits.vue";
import Factions from "@/components/game/console/Factions.vue";
import Feats from "@/components/game/console/Feats.vue";
import Help from "@/components/game/console/Help.vue";
import Inventory from "@/components/game/console/Inventory.vue";
import List from "@/components/game/console/List.vue";
import LookChar from "@/components/game/console/LookChar.vue";
import LookItem from "@/components/game/console/LookItem.vue";
import LookRoom from "@/components/game/console/LookRoom.vue";
import Message from "@/components/game/console/Message.vue";
import OfferInventory from "@/components/game/console/OfferInventory.vue";
import ScrollTool from "@/components/game/console/ScrollTool.vue";
import Stats from "@/components/game/console/Stats.vue";
import Upgrade from "@/components/game/console/Upgrade.vue";
import Who from "@/components/game/console/Who.vue";
import Whois from "@/components/game/console/Whois.vue";


const store = useStore();

const scrollHeight = ref(0);
const distanceToBottom = ref(0);

const consoleMessage = (message) => {
  const type = message.type;

  // Simple map from message type to console view
  const type_mapping = {
    "cmd.compare.success": Compare,
    "notification.death": DeathMessage,
    "effect.start": Effect,
    "cmd.equipment.success": Equipment,
    "cmd.enquire.success": Enquire,
    "cmd.exits.success": Exits,
    "cmd.factions.success": Factions,
    "cmd.feats.success": Feats,
    "cmd.help.success": Help,
    "cmd.inventory.success": Inventory,
    "cmd.list.success": List,
    "cmd.offer.success": OfferInventory,
    "cmd.stats.success": Stats,
    "cmd.who.success": Who,
    "cmd.whois.success": Whois,
    "cmd./whois.success": Whois,
  };

  if (type_mapping[type]) return type_mapping[type];

  if (type === "cmd.look.success" && message.data.target_type === "item") return LookItem;
  if (type === "cmd.look.success" && message.data.target_type === "char") return LookChar;
  if (type === "cmd.look.success" && message.data.target_type === "room_detail") return Message;

  if (type === "cmd.look.success" ||
      type === "cmd.move.success" ||
      type === "affect.flee.success" ||
      type === "system.connect.success" ||
      type === "cmd./jump.success" ||
      type === "affect.death") return LookRoom;

  if (type === "notification.cmd.chat.success" ||
      type === "cmd.chat.success" ||
      type === "cmd./chat.success" ||
      type === "cmd.cchat.success" ||
      type === "notification.cmd.cchat.success" ||
      type === "cmd.gossip.success" ||
      type === "notification.cmd.gossip.success") return Chat;

  if (type === "notification.combat.attack" ||
      type === "notification.combat.healing") return CombatMessage;

  if (type === "cmd.upgrade.success" && message.data.items) return Upgrade;

  if (message.data &&
      message.data.skill &&
      (message.data.method === "cast" || message.data.method === "channel") &&
      message.data.duration !== 0) return Cast;

  return Message;
}

const is_mobile = computed(() => {
  return store.state.game.is_mobile;
});
const messages = computed(() => {
  return store.getters["game/consoleMessages"];
});

const isGrouped = (message, prevMessage) => {
  if (prevMessage &&
      prevMessage.group &&
      prevMessage.group === message.group)
    return true;
  return false;
};

onMounted(() => {
  const el = document.getElementById("console") as HTMLElement;
  // const el = this.$refs.console as HTMLElement;
  scrollHeight.value = el.scrollHeight;
  scrollToBottom();
  EventBus.on("scroll-down", scrollToBottom);
});

onUnmounted(() => {
  EventBus.off("scroll-down", scrollToBottom);
});

onUpdated(() => {
  if (distanceToBottom.value < 5) {
    scrollToBottom();
  } else {
    updateScroll();
  }
});

const scrollToBottom = () => {
    const el = document.getElementById("console") as HTMLElement;
    if (!el) {
      return;
    }
    el.scrollTop = el.scrollHeight + 1000;
    distanceToBottom.value = 0;
  }

const updateScroll = () => {
    const el = document.getElementById("console") as HTMLElement;
    if (!el) {
      return;
    }
    distanceToBottom.value = el.scrollHeight - el.clientHeight - el.scrollTop;
}
const onScroll = _.debounce(updateScroll, 250);
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
      &.affect\.cmd\.look\.success,
      &.affect\.idle\.timeout,
      &.notification\.cmd\.say\.success,
      &.notification\.cmd\.yell\.success,
      &.notification\.cmd\.chat\.success,
      &.notification\.tell,
      &.notification\.cmd\.emote\.success,
      &.notification\.movement\.enter,
      &.notification\.movement\.exit,
      &.notification\.decay {
        margin-top: 1rem;
      }

      &.room_write,
      &.write\.send,
      &.write\.sendexcept,
      &.write\.game,
      &.write\.zone {
        &:not(.grouped) {
          margin-top: 1rem;
        }
      }

      &.notification\.combat\.attack:not(.grouped) {
        margin-top: 1em;
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

      &.notification\.cmd\.cchat\.success,
      &.notification\.cmd\.gossip\.success {
        margin-top: 1rem;
      }

      &.cmd\.cchat\.success,
      &.notification\.cmd\.cchat\.success {
        color: $color-blue-chat;
      }

      &.cmd\.gossip\.success,
      &.notification\.cmd\.gossip\.success {
        color: $color-green-chat;
      }

      &.notification\.broadcast {
        margin-top: 1em;
        margin-bottom: 1em;
        color: $color-primary;
        font-weight: bold;
        font-size: 1.2em;
      }

      .brief {
        @include font-mono;

        width: 100%;
        max-width: 400px;
        color: $color-text-70;
      }

      .interactive {
        @include font-text-regular;
        border-bottom: 1px dotted #888;
      }
    }
  }
}
</style>
