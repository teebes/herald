<template>
  <div class="frame">
    <div class="staff-nav">
      <router-link :to="to_playing">Playing</router-link>
      <router-link :to="to_playing">Signups</router-link>
      <router-link :to="to_playing">Worlds</router-link>
    </div>

    <div class="staff-contents flex-grow">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { STAFF_PLAYING } from "@/router";

@Component
export default class extends Vue {
  get to_playing() {
    return {
      name: STAFF_PLAYING
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";

.frame {
  display: flex;
  flex-direction: column;

  .staff-nav {
    display: flex;
    justify-content: space-around;
    margin: 10px 0;
  }

  .staff-contents {
    padding: 0 20px;
  }

  @media ($desktop-site) {
    flex-direction: row;
  }
}
</style>