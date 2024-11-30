<template>
  <div class="inventory indented">
    <template v-if="message.data.inventory.length">
      <div>You can sell:</div>
      <ol class="list mb-4">
        <li class="inventory-item" v-for="(item) in message.data.inventory" :key="item.key">
          <span
            v-if="isLastMessage"
            class="interactive"
            :class="[item.quality]"
            v-interactive="{target: item}"
            :key="item.key + '-interactive'"
          >{{ item.name }}</span>
          <span v-else :class="[item.quality]" :key="item.key">{{ item.name }}</span>
          for {{item.cost}} {{ currencyDisplay(item.currency, item.cost) }}
        </li>
      </ol>
    </template>
    <template v-else>
      <div>You have nothing to sell.</div>
    </template>

    <div class="gold-inv color-secondary">You have {{ message.data.gold }} gold.</div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const props = defineProps<{message: any}>();

const isLastMessage = computed(() => store.state.game.last_message[props.message.type] == props.message);
const currencyDisplay = (currency, cost) => {
  if (cost == 1) {
    if (currency[currency.length - 1] === "s") {
      return currency.slice(0, -1);
    }
  }
  return currency;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>