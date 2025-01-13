<template>
  <div class="char-line">
    <div class="char-desc inline-block" @click="handleClick">
      <span
        :class="{interactive: isLastMessage}"
        v-interactive="{ target: char, isLastMessage: isLastMessage }">
        <template v-if="char.target">
          <span :class="{ hostile: isHostile }">{{ capfirst(char.name) }}</span>
          is here, fighting
          <span v-if="targetsYou">YOU!</span>
          <template v-else>
            <span v-if="isHostile">*</span><span :class="{ hostile: isHostile }">{{ char.target.name }}</span><span
              v-if="isHostile">*</span>
            .
          </template>
        </template>

        <template v-else-if="isHostile">
          <span v-if="isHostile">*</span><span :class="{ hostile: isHostile }">{{ capfirst(char.name) }}</span><span
            v-if="isHostile">*</span>
          is here.
        </template>

        <span v-else>{{ char.room_description }}</span>
      </span>
    </div>

    <div class="quest-indicator-wrapper" @click="handleClick" v-if="quest_indicator && isLastMessage">
      <span class='whitespace-nowrap'>[ <span class='quest-indicator'>{{ quest_indicator }}</span> ]</span>
    </div>

    <span v-if="char.is_invisible" class="ml-2 color-text-50">[invisible]</span>
    <span v-if="char.is_linkless" class="ml-2">[<span class="color-text-red">LINKLESS</span>]</span>

  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { capfirst } from "@/core/utils.ts";
/*
  When fighting, want to just show name + fighting target / you
  When not fighting, if not hostile should show room desc
    if hostile, show
*/

const store = useStore();
const emit = defineEmits(["click"]);

const props = defineProps<{
  char: any,
  isLastMessage?: boolean
}>();
const player = computed(() => store.state.game.player);

const isHostile = computed(() => {
  if (player.value.core_faction != props.char.core_faction && props.char.char_type === "player") return true;
  return false;
});

const targetsYou = computed(() => {
  if (props.char.target && props.char.target.key == player.value.key) return true;
  return false;
});

const handleClick = () => {
  emit('click');
}

const quest_indicator = computed(() => {
  if (props.char.quest_data.complete) return '?';
  else if (props.char.quest_data.enquire) return '!';
  return null;
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.hostile {
  color: $color-red;
}

.char-line {
  display: flex;
  position: relative;
  overflow: hidden;

  .quest-indicator-wrapper {
    &:hover {
      cursor: pointer;
    }
    color: $color-text-gray;
    margin-left: 10px;
    .quest-indicator {
      color: $color-secondary;
      font-weight: bold;
      position: relative;
    }
  }
}
</style>
