<template>
  <div class="look-char indented">
    <CharInfo :char="message.data.target" :isLastMessage="isLastMessage" />
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
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CharInfo from "../CharInfo.vue";
import { getTargetInGroup } from "@/core/utils.ts";

@Component({
  components: {
    CharInfo
  }
})
export default class LookChar extends Vue {
  @Prop() message!: any;

  hasAction() {
    return Boolean(
      this.message.data.target.actions.complete ||
        this.message.data.target.actions.completion_action ||
        this.message.data.target.actions.list ||
        this.message.data.target.actions.offer
    );
  }

  doAction(char, action) {
    const target = getTargetInGroup(char, this.$store.state.game.room.chars);
    if (target.indexOf(".") === -1)
      this.$store.dispatch("game/cmd", `${action}`);
    else this.$store.dispatch("game/cmd", `${action} ${target}`);

    this.$store.commit("game/lookup_clear");
    this.$store.commit("ui/modal_clear");
  }

  get isLastMessage() {
    return (
      this.$store.state.game.last_message[this.message.type] == this.message
    );
  }

  get isInRoom() {
    return this.$store.state.game.room.key === this.message.data.actor.room.key;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>