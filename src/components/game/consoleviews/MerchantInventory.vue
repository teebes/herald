<template>
  <div>
    <div>{{ $capfirst(message.data.merchant.name) }} has for sale:</div>
    <ol class="list mt-4">
      <li class="inventory-item" v-for="item in message.data.inventory" :key="item.key">
        <span
          v-if="isLastMessage"
          class="interactable"
          :class="[item.quality]"
          v-interactive="{target: item}"
          :key="item.key + '-interactable'"
        >{{ item.name }}</span>
        <span v-else :class="[item.quality]" :key="item.key">{{ item.name }}</span>
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

  get isLastMessage() {
    return (
      this.$store.state.game.last_message[this.message.type] == this.message
    );
  }  
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>