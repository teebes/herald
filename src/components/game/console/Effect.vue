<template>
  <div class='effect' :class="{ friendly: isFriendly, hostile: isHostile}">
    <div v-if="store.state.game.player_config.combat_brief" class='brief flex'>

      <div class='effect-code flex-grow'>
        [ {{ effectLabel }} ]
        <span v-if="message.data.target === player_key">Effect Start</span>
        <span v-else>{{ capfirst(message.data.target_data.keyword) }} Effect Start</span>
      </div>
      <div class='duration nowrap mr-2'>{{ message.data.duration}} sec</div>
    </div>
    <div class='effect' v-else>
        {{ message.text }}
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { capfirst } from "@/core/utils.ts";

const store = useStore();
const props = defineProps<{ message: any, previousMessage: any, index: number }>();

const player_id = store.state.game.player_id;
const player_key = `player.${player_id}`;

const isFriendly = computed(() => {
  return props.message.data.friendly && props.message.data.target === player_key;
});

const isHostile = computed(() => {
  return !props.message.data.friendly && props.message.data.target === player_key;
});

const effectLabel = computed(() => {
  if (props.message.data.custom) {
    return props.message.data.name;
  }
  // if (store.state.game.world.is_classless) {
  //   return props.message.data.name;
  // }
  return store.state.game.world.labels.effects[props.message.data.code];
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
.effect {
  &.friendly {
    color: $color-green;
    @include font-text-regular;
    .brief {
      color: $color-green !important;
    }
  }

  &.hostile {
    color: $color-red;
    @include font-text-regular;
    .brief {
      color: $color-red !important;
    }
  }
}
</style>