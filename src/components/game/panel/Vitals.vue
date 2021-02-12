<template>
  <div class="vitals-view flex flex-grow flex-col">
    <div class="vitals-region">
      <div class="vitals">
        <div class="vital health">
          <div class="label-row">
            <div class="label">Health</div>
            <div class="amount">{{ player.health }}</div>
          </div>
          <div class="vital-bar">
            <div class="health-bar" :style="{ width: healthPerc }"></div>
          </div>
        </div>

        <div class="vital mana" v-if="hasMana">
          <div class="label-row">
            <div class="label">Mana</div>
            <div class="amount">{{ player.mana }}</div>
          </div>
          <div class="vital-bar">
            <div class="mana-bar" :style="{ width: manaPerc }"></div>
          </div>
        </div>

        <div class="vital stamina">
          <div class="label-row">
            <div class="label">Stamina</div>
            <div class="amount">{{ player.stamina }}</div>
          </div>
          <div class="vital-bar">
            <div class="stamina-bar" :style="{ width: staminaPerc }"></div>
          </div>
        </div>
      </div>
    </div>

    <Status />
    <div v-if="is_mobile" class="flex-grow flex flex-col justify-center">
      <Combat @taplook="$emit('taplook')" />
    </div>
    <div v-if="is_mobile" class="mobile-cast-region">
      <Cast
        :message="current_cast"
        v-if="current_cast"
        :key="current_cast.data.expires"
      />
    </div>
    <Skills v-if="$store.state.game.world.allow_combat" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Status from "./Status.vue";
import Skills from "./Skills.vue";
import Combat from "./Combat.vue";
import Cast from "../consoleviews/Cast.vue";

@Component({
  components: {
    Combat,
    Skills,
    Status,
    Cast
  }
})
export default class PanelVitals extends Vue {
  get is_mobile() {
    return this.$store.state.game.is_mobile;
  }

  get player() {
    return this.$store.state.game.player;
  }

  get world() {
    return this.$store.state.game.world;
  }

  get healthPerc() {
    return (this.player.health / this.player.health_max) * 100 + "%";
  }

  get manaPerc() {
    return (this.player.mana / this.player.mana_max) * 100 + "%";
  }

  get staminaPerc() {
    return (this.player.stamina / this.player.stamina_max) * 100 + "%";
  }

  get hasMana() {
    if (this.player.archetype == "mage" || this.player.archetype == "cleric" || this.world.classless)
      return true;
    return false;
  }

  get current_cast() {
    return this.$store.state.game.current_cast;
  }
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.vitals-region {
  padding: 0 20px;
  .vitals,
  .effects {
    border-bottom: 1px solid $color-background-light;
    padding-bottom: 12px;
    //padding: 12px 0;
  }

  .vitals {
    display: flex;

    .vital {
      flex-grow: 1;
      width: 100%;

      &:not(:last-child) {
        margin-right: 8px;
      }

      .label {
        @include font-title-light;
        font-size: 15px;
        line-height: 18px;
        color: $color-secondary;
        margin-bottom: 2px;
      }

      .vital-bar {
        background: $color-background-very-light;
        border-radius: 6px;
        height: 6px;
        width: 100%;

        > div {
          width: 0%;
          height: 100%;
          background: $color-secondary;
          border-radius: 6px;
        }
      }
    }
  }
}

.vital {
  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;

    .label {
      @include font-title-light;
      font-size: 15px;
      line-height: 18px;
      color: $color-secondary;
    }

    .amount {
      @include font-text-regular;
      font-size: 11px;
      line-height: 15px;
      //margin-top: 9px;
      margin-bottom: 1px;
      color: $color-text-hex-50;
    }
  }

  .vital-bar {
    background: $color-background-very-light;
    border-radius: 6px;
    height: 6px;
    width: 100%;

    > div {
      width: 0%;
      height: 100%;
      background: $color-secondary;
      border-radius: 6px;
    }
  }
}

.mobile-cast-region {
  margin: 10px 20px;
  height: 20px;

  .cast-message {
    margin: 0 auto;
    width: 33%;

    .progress-bar {
      width: 100%;
    }
  }
}
</style>
