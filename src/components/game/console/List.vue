<template>
  <div class='indented'>
    <div>{{ capfirst(message.data.merchant.name) }} has for sale:</div>
    <ol class="list mt-4">
      <li class="inventory-item" v-for="item in message.data.inventory" :key="item.key">
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

    <div class="gold-inv color-secondary mt-4">You have {{ message.data.gold }} gold.</div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { capfirst } from "@/core/utils";

const store = useStore();
const props = defineProps<{ message: any }>();

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