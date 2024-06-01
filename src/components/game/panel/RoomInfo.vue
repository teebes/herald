<template>
  <div class="room-info-region hover" @click="onClick">
    <div class="room-name">{{ room.name }}</div>
    <div class="room-status">
      <div class="room-items" title="# items in room">
        <img src="@/assets/game/room-items.png" />
        <span>{{ room.inventory.length }}</span>
      </div>
      <div class="room-chars" title="# characters in room">
        <img src="@/assets/game/room-chars.svg" />
        <span>{{ room.chars.length }}</span>
      </div>
    </div>
  </div>
</template>

<script type='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const room = computed(() => store.state.game.room);

const onClick = () => {
  store.dispatch("game/cmd", "look");
};
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.room-info-region {
  display: flex;
  padding: 10px 20px;
  @include font-text-regular;

  .room-name {
    flex-grow: 1;
    font-size: 13px;
  }

  .room-status {
    display: flex;
    padding-top: 3px;

    .room-items,
    .room-chars {
      font-size: 11px;
      display: flex;
      margin-left: 5px;
      align-items: top;
    }

    .room-items,
    .room-chars {
      img {
        width: 12px;
        height: 12px;
        margin-top: 2px;
        margin-right: 3px;
      }
    }

    img {
      margin-right: 2px;
    }
  }
}
</style>