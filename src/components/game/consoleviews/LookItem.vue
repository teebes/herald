<template>
  <div class="look-item indented">
    <ItemInfo :item="message.data.target" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ItemInfo from "../ItemInfo.vue";

@Component({
  components: {
    ItemInfo
  }
})
export default class LookItem extends Vue {
  @Prop() message!: any;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>