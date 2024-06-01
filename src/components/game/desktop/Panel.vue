<template>
  <div id="desktop-panel">
    <div class="panel flex flex-col">
      <Top />
      <Summary />
      <div class="desktop-combat">
        <Combat />
      </div>
      <GameMap :radius="5"/>
      <RoomInfo />
      <Tabs class='desktop-tabs'/>
    </div>
    <div class="combat-region"></div>
  </div>
</template>

<script lang='ts' setup>
import Top from "@/components/game/desktop/Top.vue";
import Summary from "@/components/game/desktop/Summary.vue";
import GameMap from "@/components/game/panel/Map.vue";
import Combat from "@/components/game/panel/Combat.vue";
import RoomInfo from "@/components/game/panel/RoomInfo.vue";
import Tabs from "@/components/game/panel/Tabs.vue";
</script>

<style lang='scss'>
@import "@/styles/colors.scss";

#desktop-panel {
  background: $color-background-black;
  width: 310px;
  height: 100%;
  flex-shrink: 0;

  .panel {
    // TODO: rename to side-panel so there is no conflict with panel
    height: 100%;

    // Reset effects from world builder panel, remove once we rename to side-panel
    border: 0;
    background: inherit;
    padding: 0;

    .top-region {
      .inner {
        padding: 15px 20px 0px 20px;
        display: flex;

        .game-logo {
          width: 23px;
          height: 23px;
          background: url("@/assets/logo/logo-black.svg");
          background-size: 23px;
        }

        .world-title {
          color: $color-text-hex-50;
          font-size: 13px;
          line-height: 18px;
          flex-grow: 1;
          flex-wrap: wrap;
          display: flex;
          flex-direction: column;
          justify-content: center;

          margin-left: 8px;

          span {
            border-left: 1px solid #333;
            padding-left: 8px;
          }
        }
      }
    }

    .desktop-combat {
      position: relative;
      .combat-view {
        position: absolute;
        left: 310px;
        top: -20px;
      }
    }
  }

  .desktop-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    .tab-contents-region {
      overflow-y: auto;
    }
  }
}
</style>