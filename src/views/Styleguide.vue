<template>
  <div class="styleguide">
    <h1>H1 HEADER lowercase</h1>
    <h2>h2 HEADER lowercase</h2>
    <h3>H3 HEADER lowercase</h3>

    <p class="font-text-regular">Font-Text Regular</p>
    <p class="font-text-light">Font-Text Light</p>
    <p class="font-title-regular">Font-Title Regular</p>
    <p class="font-title-light">Font-Title Light</p>
    <div>
      <a href="#" @click.prevent="dummyPrevent">link</a>
    </div>

    <div>
      <button>PLAIN BUTTON</button>
    </div>

    <div>
      <button class="btn-small">BTN-SMALL</button>
    </div>

    <div>
      <button class="btn-medium">BTN-MEDIUM</button>
    </div>

    <div>
      <button class="btn-large">BTN-LARGE</button>
    </div>

    <div>
      <button class="btn-add">BTN-ADD</button>
    </div>

    <div>
      <button class="btn-thin">BTN-THIN</button>
      <button class="btn-thin">BUTTON #2</button>
    </div>

    <div class="panel-wrapper" style="width: 300px">
      <div class="panel panel-shadow">
        <div>.panel .panel-shadow</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
@import "@/styles/fonts.scss";
@import "@/styles/colors.scss";

.styleguide {
  padding: 20px;

  > div {
    margin: 5px 0;
  }
}
</style>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StyleVuide extends Vue {
  dummyPrevent(): void {}
}
</script>