<!--
  Component usage:

  elementSchema = {}
  elementSchema.help = `The mob's class determine how its stats are calculated. For
                 example, warriors will roll more strength and thieves will roll
                 more dexterity.<br/>
                 If abilities are enabled, also determines which skills are used.`,

  <Help v-if="elementSchema.help" :help="elementSchema.help"></Help>
-->
<template>

  <VMenu
    class="flex help-icon"
    placement="top"
    :distance="10"
    :skidding="20"
    :delay="200">
    <img alt="help" src="@/assets/ui/help_icon_2x.png"/>

    <template #popper>
      <div v-html="help" class="help-popper"></div>
    </template>
  </VMenu>

</template>

<script lang="ts" setup>
defineProps<{
  help: string;
}>();
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.vmenutst { display: inline; }

.help-popper {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
