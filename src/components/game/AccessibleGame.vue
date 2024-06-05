<template>
  <div class="flex-grow flex flex-col console-wrapper">
    <div id="console" ref="console" class="testing">
      <div class="message" v-for="message in messages" :key="message.request_id">
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
  request_id: string;
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

// Scroll to bottom when new message is added
let lastMessageID = '';
watch(() => messages.value, (newMessages: Message[]) => {
  const newMessage = newMessages[newMessages.length - 1];

  if (newMessage.request_id === lastMessageID) return;
  lastMessageID = newMessage.request_id;

  scrollToBottom();
},
{ deep: true });
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