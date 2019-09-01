<template>
  <div v-if="playerTarget">
    <div class="combat-view">
      <div class="combat-header">You're in a fight</div>
      <div class="combat-box">
        <div class="target-name">{{ playerTarget.name }}</div>
        <div class="target-summary color-text-50">Level {{ playerTarget.level }}</div>
        <div class="target-info">
          <div class="target-health-region">
            <div class="target-health">
              <div class="vital health">
                <div class="label-row">
                  <div class="label">Health</div>
                  <div class="amount">{{ playerTarget.health }}</div>
                </div>
                <div class="vital-bar">
                  <div class="health-bar" :style="{width: healthPerc + '%'}"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="target-effects-region">
            <div class="effects-collection">
              <ProgressBar
                v-for="effect in target_effects"
                :key="effect.expires"
                :duration="effect.duration"
                :label="effect.code"
                :expires="effect.expires"
                :start="effect.start"
                method="channel"
              />
            </div>
          </div>
        </div>
        <div class="actions">
          <div
            class="action primary"
            action="flee"
            v-if="playerTarget.health"
            @click="doAction('flee')"
          >FLEE</div>
          <div class="action primary" action="loot" v-else @click="doAction('loot')">LOOT</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ProgressBar from "@/components/game/ProgressBar.vue";

@Component({
  components: {
    ProgressBar
  }
})
export default class PanelCombat extends Vue {
  // Since we sometimes want to keep displaying the charater's target even after
  // they died, we track this in a separate variable.
  playerTarget = this.target;
  // playerTarget = {
  //   health: 10,
  //   health_max: 100,
  //   name: "an enemy",
  //   level: 2
  // };

  timeout: any = null;

  playerRoomKey: string | null = null;

  doAction(action) {
    this.$store.dispatch("game/cmd", action);
    this.playerTarget = null;
  }

  @Watch("target")
  onTargetChange() {
    if (this.target) {
      this.playerTarget = { ...this.target };
      this.playerRoomKey = this.$store.state.game.player.room;
    } else {
      if (
        this.playerTarget &&
        this.playerTarget.key === this.$store.state.game.last_death
      ) {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.playerTarget = null;
        }, 7000);
        this.playerTarget.health = 0;
      }
    }
  }

  @Watch("player_room")
  onPlayerRoomChange(room) {
    if (this.playerTarget && room != this.playerRoomKey) {
      this.playerTarget = null;
    }
  }

  destroyed() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  get target() {
    return this.$store.state.game.player.target;
  }

  get player_room() {
    return this.$store.state.game.player.room;
  }

  get healthPerc() {
    return (this.playerTarget.health / this.playerTarget.health_max) * 100;
  }

  get target_effects() {
    return this.$store.state.game.effects[this.playerTarget.key];
    return [
      {
        active: true,
        actor: "player.128",
        code: "wrack",
        duration: 18,
        expires: 1565625865.473659,
        key: "1565625865.473659wrack",
        metadata: null,
        stack: 1,
        target: "mob.559776",
        value: 0
      },
      {
        active: true,
        actor: "player.128",
        code: "wrack",
        duration: 18,
        expires: 1565625865.473659,
        key: "1565625865.473659wrack",
        metadata: null,
        stack: 1,
        target: "mob.559776",
        value: 0
      },
      {
        active: true,
        actor: "player.128",
        code: "wrack",
        duration: 18,
        expires: 1565625865.473659,
        key: "1565625865.473659wrack",
        metadata: null,
        stack: 1,
        target: "mob.559776",
        value: 0
      }
    ];
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.combat-view {
  width: 285px;
  z-index: 1000;

  .combat-header {
    background: $color-red;
    height: 31px;

    color: $color-text;
    @include font-text-regular;
    font-size: 12px;
    line-height: 26px;

    display: flex;
    align-items: center;
    padding-left: 10px;
  }

  .combat-box {
    background: $color-background-light;
    border: 3px solid #333333;
    border-top: 0;
    padding: 10px;
    line-height: 21px;

    .target-name {
      @include font-text-regular;
      color: $color-red;
    }

    .target-info {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;

      .target-health {
        width: 100px;
        margin-top: 10px;
      }

      .effect {
        margin-top: 10px;
      }

      .effects-collection {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

        .progress-bar {
          //margin: 5px;
        }
      }
    }

    .actions {
      margin-top: 10px;
    }
  }
}
</style>