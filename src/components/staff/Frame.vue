<template>
  <div class="frame">
    <div class="staff-nav side-nav">
      <router-link :to="to_playing">Playing</router-link>
      <router-link :to="to_signups">Signups</router-link>
      <router-link :to="to_worlds">Worlds</router-link>
      <router-link :to="to_activity">Activity</router-link>
    </div>

    <div class="staff-contents flex-grow">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  STAFF_PLAYING,
  STAFF_SIGNUPS,
  STAFF_WORLDS,
  STAFF_ACTIVITY
} from "@/router";

@Component
export default class extends Vue {
  get to_playing() {
    return {
      name: STAFF_PLAYING
    };
  }

  get to_signups() {
    return {
      name: STAFF_SIGNUPS
    };
  }

  get to_worlds() {
    return {
      name: STAFF_WORLDS
    };
  }

  get to_activity() {
    return {
      name: STAFF_ACTIVITY
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
    .staff-nav {
      flex-direction: column;
      justify-content: start;
      padding: 65px 20px 20px 20px;
      // a:not(:last-child) {
      //   margin-bottom: 1em;
      // }
    }
  }
}
</style>