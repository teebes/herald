<template>
  <div class="upgrade">
    <template v-if="message.data.items.length">
      <div>You can attempt to upgrade:</div>
      <ol class="list mt-4">
        <li class="inventory-item" v-for="item in message.data.items" :key="item.key">
          <span
            class="interactive"
            :class="[item.quality]"
            v-interactive="{target: item}"
          >{{ item.name }}</span>
          for {{item.upgrade_cost}} gold
        </li>
      </ol>
    </template>

    <div v-else>You have nothing to upgrade.</div>

    <div class="gold-inv mt-4 color-secondary">You have {{ message.data.gold }} gold.</div>
  </div>
</template>

<script lang='ts' setup>
defineProps<{ message: any }>();
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>