<template>
  <div class="top-region">
    <div class="inner">
      <div class="game-logo"></div>
      <div class="world-title">
        <span>{{ world.name }}</span>
      </div>
      <div class="game-menu">
        <button type="button" class="btn btn-small menu-button" @click.stop="onClickMenu">
          <div class="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
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

<style scoped lang='scss'>
@import "@/styles/colors.scss";

.menu-button {
  background: none;
  border: 1px solid $color-primary;
  display: flex;
  align-items: center;

  .menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 12px;
  height: 12px;

    span {
    display: block;
    width: 100%;
    height: 1px;
    background-color: $color-primary;
    }
  }
}
</style>