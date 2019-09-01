<template>
  <div>
    <div>{{ $capfirst(message.data.merchant.name) }} has for sale:</div>
    <ol class="list mt-4">
      <li class="inventory-item" v-for="item in message.data.inventory" :key="item.key">
        <span
          class="interactable"
          :class="[item.quality]"
          v-interactive="{target: item}"
        >{{ item.name }}</span>
        for {{item.cost}} gold
      </li>
    </ol>

    <div class="gold-inv color-secondary mt-4">You have {{ message.data.gold }} gold.</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class GameMerchantInventory extends Vue {
  @Prop() message!: any;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>