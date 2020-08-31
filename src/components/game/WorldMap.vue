<template>
  <ModalView :nomargin="true">
    <img src="https://assets.writtenrealms.com/ui/game/thera_map.jpg"/>
  </ModalView>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ModalView from "@/components/ModalView.vue";

@Component({
  components: {
    ModalView,
  },
})
export default class WorldMap extends Vue {}
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}
</style>