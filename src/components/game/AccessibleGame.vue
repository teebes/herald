<template>
  <div class="flex-grow flex flex-col console-wrapper">
    <div id="console" ref="console" class="testing">
      <div class="message" v-for="message in messages" :key="message.request_id">
        <div v-if="message" class="mt-4">
          <div v-for="(line, index) in getLines(message)" :key="index">{{ line }}</div>
        </div>
      </div>
      <div ref="bottom"></div>
    </div>
    <Input @input="onInput" />
  </div>
</template>

<script lang='ts'>
import axios from "axios";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Input from "./Input.vue";
import _ from "lodash";

@Component({
  components: {
    Input
  }
})
export default class AccessibleGame extends Vue {
  @Prop() messages: any;

  getLines(message) {
    return message.text.split("\n");
  }

  /*
  @Watch("messages")
  onMessageChange() {
    this.scrollToBottom();
  }
  */

  updated() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    console.log("scrolling to bottom");

    // const c = this.$refs.console as HTMLElement;
    // c.scrollTop = c.scrollHeight;

    const bottom = this.$refs.bottom as HTMLElement;
    bottom && bottom.scrollIntoView();
  }

  onInput(args) {
    this.$emit("input", args);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.console-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 0;
  padding: 10px;
}

#console {
  border: 1px solid #444;
  padding: 20px;

  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
}
</style>