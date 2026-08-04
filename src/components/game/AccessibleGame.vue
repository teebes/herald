<template>
  <div class="flex-grow flex flex-col console-wrapper">
    <div
      id="console"
      ref="console"
      class="testing"
      role="log"
      aria-label="Game output"
      aria-live="polite"
      aria-relevant="additions"
      aria-atomic="false"
    >
      <div class="message" v-for="message in messages" :key="message.message_id">
        <div v-if="message" class="mt-4">
          <div v-for="(line, index) in getLines(message)" :key="index">{{ line }}</div>
        </div>
      </div>
      <div id="console-bottom"></div>
    </div>
    <Input />
  </div>
</template>

<script setup lang="ts">
import { watch, nextTick, computed } from 'vue';
import { useStore } from 'vuex';
import Input from './Input.vue';

const store = useStore();

const messages = computed(() => {
  return store.state.game.messages.filter(message => message.type !== 'notification.regen');
});


interface Message {
  type: string;
  message_id: string;
  text: string;
}

const getLines = (message: Message) => {
  return message.text.split("\n");
};

const scrollToBottom = async () => {
  await nextTick();
  const bottomRef = document.getElementById('console-bottom');
  bottomRef?.scrollIntoView();
};

// Scroll to bottom when a new message is added. The live log announces the
// appended message without moving keyboard focus away from the command input.
watch(
  () => messages.value[messages.value.length - 1]?.message_id,
  (messageID) => {
    if (!messageID) return;
    scrollToBottom();
  },
);
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
