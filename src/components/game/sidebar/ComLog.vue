<template>
  <ModalView id="coms_log">
    <h1 class="mb-6">Communication Log</h1>
    <template v-if="log_entries.length">
      <div v-for="(entry, index) in log_entries" :key="index">{{ entry.text }}</div>
    </template>
    <div v-else>No communication entries. Try chatting something!</div>

    <form @submit.prevent="onSubmit" class="mt-4">
      <div class="form-group">
        <input type="text" v-model="chat_input" />
      </div>
    </form>
  </ModalView>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ModalView from "@/components/ModalView.vue";

@Component({
  components: {
    ModalView
  }
})
export default class CommunicationLog extends Vue {
  chat_input: string = "";

  get log_entries() {
    console.log(this.$store.state.game.com_list.slice().reverse());
    return this.$store.state.game.com_list.slice().reverse();
  }

  onSubmit() {
    if (this.chat_input) {
      this.$store.dispatch("game/cmd", `chat ${this.chat_input}`);
      this.chat_input = "";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>
