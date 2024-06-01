<template>
  <div class="hint-region">
    <div class="hint-view">
      <div
        class="box-shadow hint-box"
        :class="{ inverted: isInverted, southSpecial: isSouthSpecial}"
      >{{ hintText }}</div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const hintText = computed(() => {
  const parts = store.state.game.hint.split(":");
  const hintId = parts[0];
  let hintText = parts[1];

  if (store.state.game.is_mobile) {
    if (hintId === "6") {
      hintText = "Tap on the knife, then tap 'GET'";
    } else if (hintId === "8") {
      hintText = "Tap the SOUTH direction";
    } else if (hintId === "2") {
      hintText = "Tap on the 'Look' tab";
    } else if (hintId === "9") {
      hintText = "Tap on the spider, then tap 'KILL'";
    }
  }

  return hintText;
});

const hintID = computed(() => store.state.game.hint.split(":")[0]);

const isInverted = computed(() => {
  if (hintID.value === "6" || hintID.value === "8" || hintID.value === "9") {
    if (store.state.game.is_mobile) return true;
  }
  return false;
});

const isSouthSpecial = computed(() => {
  if (hintID.value === "8" && store.state.game.is_mobile) {
    return true;
  }
  return false;
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.hint-region,
.mobile-upper-hint-region,
.mobile-lower-hint-region {
  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    10% {
      transform: translateY(-10px);
    }
    15% {
      transform: translateY(0);
    }
    20% {
      transform: translateY(-5px);
    }
    25% {
      transform: translateY(0);
    }
  }

  @keyframes inverted-bounce {
    0% {
      transform: translateY(0);
    }
    10% {
      transform: translateY(10px);
    }
    15% {
      transform: translateY(0);
    }
    20% {
      transform: translateY(5px);
    }
    25% {
      transform: translateY(0);
    }
  }

  .hint-view {
    display: flex;
    padding: 0 20px 15px 20px;

    .hint-box {
      border-radius: 4px;
      position: relative;
      //display: inline-block;

      background: $color-background-light;
      padding: 10px 16px;
      border: 1px solid #333;
      animation: bounce 5s infinite;
      animation-delay: 3s;

      //margin: 0 0 15px 20px;

      &::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        position: absolute;

        border-top: 8px solid #333;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        left: 20px;
        bottom: -9px;
      }

      &.inverted {
        animation-name: inverted-bounce;

        &::before {
          border-top: 0;
          border-bottom: 8px solid #333;
          left: 20px;
          top: -9px;
        }
      }

      // Special styling for pointing to the east arrow
      &.east-special {
        margin: 0 auto;
        &::before {
          left: 55%;
        }
      }

      &.south-special,
      &.southSpecial {
        margin: 0 auto;
      }

      // Special styling for pointing to the type tab
      &.mobile-type {
        margin: 0 auto;
        &::before {
          left: 50%;
        }
      }
    }
  }
}
</style>