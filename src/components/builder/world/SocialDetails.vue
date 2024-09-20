<template>
  <div>
    <h3 class="cmd">{{ resource.cmd.toUpperCase() }}</h3>

    <p v-if="resource.priority">Priority: {{ resource.priority }}</p>

    <div class="social-message" v-if="resource.msg_targetless_self">
      <div class='color-text-50'>Displayed to self when used without an argument:</div>
      <div>{{ resource.msg_targetless_self }}</div>
    </div>

    <div class="social-message" v-if="resource.msg_targetless_other">
      <div class='color-text-50'>Displayed to others when used without an argument:</div>
      <div>{{ resource.msg_targetless_other }}</div>
    </div>

    <div class="social-message" v-if="resource.msg_targeted_self">
      <div class='color-text-50'>Displayed to self when used with a target argument:</div>
      <div>{{ resource.msg_targeted_self }}</div>
    </div>

    <div class="social-message" v-if="resource.msg_targeted_target">
      <div class='color-text-50'>Displayed to the target when used with a target argument:</div>
      <div>{{ resource.msg_targeted_target }}</div>
    </div>

    <div class="social-message" v-if="resource.msg_targeted_other">
      <div class='color-text-50'>Displayed to others when used with a target argument:</div>
      <div>{{ resource.msg_targeted_other }}</div>
    </div>

  </div>
</template>

<script lang='ts' setup>
defineProps<{
  resource: any;
}>();
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.cmd { margin-bottom: 10px; }
.social-message { margin-top: 10px; }
</style>