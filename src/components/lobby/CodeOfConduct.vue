<template>
  <div id="code-of-conduct-modal">
    <CodeOfConduct/>
    <p class="mt-4">By clicking 'Accept,' you acknowledge that you have read, understood, and agree to abide by the above Code of Conduct.</p>
    <div class="action-bar">
        <button class="btn-large action-cancel" type="button" @click="$emit('close')">DECLINE</button>
        <button class="btn-large action-save" @click="accept">{{ 'ACCEPT' }}</button>
      </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CodeOfConduct from "@/views/CodeOfConduct.vue";

@Component({
  components: {
    CodeOfConduct,
  },
})
export default class extends Vue {
  async accept() {
    await this.$store.dispatch('auth/accept_code_of_conduct');
    this.$store.commit("ui/notification_set", `Code of Conduct accepted.`);
    this.$store.commit("ui/modal_clear");
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
#code-of-conduct-modal {
  padding: 1rem;
  #code-of-conduct {
    padding: 0
  }
  .single-page {
    margin-top: 0;
  }
}
</style>