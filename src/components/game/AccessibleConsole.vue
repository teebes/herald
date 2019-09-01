<template>
  <div id="console">
    <div class="message" v-for="message in messages" :key="message.request_id" aria-live="polite">
      <div v-if="message" class="mt-4">
        <div v-for="(line, index) in getLines(message)" :key="index">{{ line }}</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Console extends Vue {
  @Prop() messages!: any;

  getLines(message) {
    return message.text.split("\n");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

#console {
  border: 1px solid #444;
  padding: 20px;

  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
}
</style>