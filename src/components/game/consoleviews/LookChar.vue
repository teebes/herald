<template>
  <div class="look-char indented">
    <CharInfo :char="message.data.target" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CharInfo from "../CharInfo.vue";

@Component({
  components: {
    CharInfo
  }
})
export default class LookChar extends Vue {
  @Prop() message!: any;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>