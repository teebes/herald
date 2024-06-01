<template>
  <div class="look-char indented">
    <CharInfo :char="message.data.target" :isLastMessage="isLastMessage" :message="message" />
    <div v-if="isLastMessage && isInRoom && hasAction" class='mt-4'>
      <button
        class="btn-small mr-2"
        v-if="message.data.target.actions.enquire"
        @click="doAction(message.data.target, 'enquire')">ENQUIRE</button>
      <button
        class="btn-small mr-2"
        v-if="message.data.target.actions.completion_action"
        @click="doAction(message.data.target, message.data.target.actions.completion_action)"
      >{{ message.data.target.actions.completion_action.toUpperCase() }}</button>
      <button
        class="btn-small mr-2"
        v-else-if="message.data.target.actions.complete"
        @click="doAction(message.data.target, 'complete')">COMPLETE QUEST</button>
      <button
        class="btn-small mr-2"
        v-if="message.data.target.actions.list"
        @click="doAction(message.data.target, 'list')">LIST</button>
      <button
        class="btn-small mr-2"
        v-if="message.data.target.actions.offer"
        @click="doAction(message.data.target, 'offer')">OFFER</button>
      <button
        class="btn-small mr-2"
        v-if="message.data.target.actions.craft"
        @click="doAction(message.data.target, 'craft')">CRAFT</button>
      <button
        class="btn-small mr-2"
        v-if="message.data.target.actions.follow"
        @click="doAction(message.data.target, 'follow')">FOLLOW</button>
      <button
        class="btn-small mr-2"
        v-if="message.data.target.actions.unfollow"
        @click="doAction(message.data.target, 'unfollow')">UNFOLLOW</button>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, } from "vue";
import { useStore } from "vuex";
import CharInfo from "@/components/game/console/CharInfo.vue"
import { getTargetInGroup } from "@/core/utils.ts";

const store = useStore();

const props = defineProps<{
  message: any;
}>();

const hasAction = computed(() => {
  return Boolean(
    props.message.data.target.actions.complete ||
    props.message.data.target.actions.completion_action ||
    props.message.data.target.actions.list ||
    props.message.data.target.actions.offer ||
    props.message.data.target.actions.follow ||
    props.message.data.target.actions.unfollow
  );
});

const doAction = (char, action) => {
  const target = getTargetInGroup(char, store.state.game.room.chars);
  if (action === 'follow' || action === 'unfollow') {
    store.dispatch("game/cmd", `${action} ${target}`)
  } else if (target.indexOf(".") === -1)
    store.dispatch("game/cmd", `${action}`);
  else store.dispatch("game/cmd", `${action} ${target}`);

  store.commit("game/lookup_clear");
  store.commit("ui/modal_clear");
}

const isLastMessage = computed(() => {
  return (
    store.state.game.last_message[props.message.type] == props.message
  );
});

const isInRoom = computed(() => {
    return store.state.game.room.key === props.message.data.actor.room.key;
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>