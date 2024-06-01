<template>
  <div class="top-region">
    <div class="inner">
      <div class="game-logo"></div>
      <div class="world-title">
        <span>{{ world.name }}</span>
      </div>
      <div class="game-menu">
        <button type="button" class="btn btn-small" @click.stop="onClickMenu">&#9776;</button>
      </div>
    </div>
    <Menu v-if="showMenu" @close="onClickMenu" />
    <img class="game-divider" src="~@/assets/ui/divider.svg" />
  </div>
</template>

<script lang='ts' setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import Menu from "@/components/game/desktop/Menu.vue";

const store = useStore();

const showMenu = ref(false);
const world: any = computed(() => store.state.game.world);

const onClickMenu = () => {
  showMenu.value = !showMenu.value;
}
</script>