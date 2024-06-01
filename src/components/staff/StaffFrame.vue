<template>
  <div id="page" class="frame">
    <div class="staff-nav side-nav">
      <router-link :to="{name: 'staff_index'}" :class="{ 'router-link-active': isPanel}">Panel</router-link>
      <router-link :to="to_playing">Playing</router-link>
      <router-link :to="to_signups">Signups</router-link>
      <router-link :to="to_worlds">Worlds</router-link>
      <router-link :to="to_activity">Activity</router-link>
      <router-link :to="{ name: 'staff_reviews' }">Reviews</router-link>
    </div>

    <div class="staff-contents flex-grow">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useRoute } from "vue-router";

const to_playing = {
  name: "staff_playing"
};

const to_signups = {
  name: "staff_signups"
};

const to_worlds = {
  name: "staff_worlds"
};

const to_activity = {
  name: "staff_activity"
};

const isPanel = useRoute().name === "staff_index";
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
    padding: 20px;
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