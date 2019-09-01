<template>
  <div class="inventory indented">
    <template v-if="message.data.inventory.length">
      <div>You can sell:</div>
      <ol class="list mb-4">
        <li class="inventory-item" v-for="(item, index) in message.data.inventory" :key="item.key">
          <span
            class="interactable"
            :class="[item.quality]"
            v-interactive="{target: item}"
          >{{ item.name }}</span>
          for {{item.cost}} gold
        </li>
      </ol>
    </template>
    <template v-else>
      <div>You have nothing to sell.</div>
    </template>

    <div class="gold-inv color-secondary">You have {{ message.data.gold }} gold.</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class GameOfferInventory extends Vue {
  @Prop() message!: any;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>