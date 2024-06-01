<template>
  <!-- <div class='test'>
    <div>Help tooltip test</div>
    <button v-tooltip="help">Hover Me</button>
  </div> -->
  <div class="test">
    This is some text that needs clarification
    <Help help="help" />
  </div>
  <!-- <div>
  <VTooltip>
    <a>Sponsor me</a>

    <template #popper>
      Help me fund my Open Source work!
    </template>
  </VTooltip>
  </div> -->

  <!-- <div class="flex gap=4">
  <VMenu :placement="'top'">
    <div style="margin-top: 200px"></div>
  <button>Documentation</button>

  <template #popper>
    <button>Guide</button>
    <button>API Reference</button>
  </template>
</VMenu>
</div> -->
</template>

<script type='ts' setup>
import Help from '@/components/Help.vue'

// const help = {
//   content: 'some help text'
// }
// const help = 'help text'
</script>

<style lang="scss">
.test {
  // margin-top: 200px;
}
</style>