<template>
  <div class="world-card">

    <router-link
      :to="{ name: LOBBY_WORLD_DETAIL, params: { world_id: world.id } }"
      :class="{ ['world-' + world.id]: true }"
      :style="backgroundImage(world)"
    >
      <div class="overlay">
        <div class="title">{{ world.name.toUpperCase() }}</div>

        <div class="num-characters">{{ world.num_characters }} characters</div>
      </div>
    </router-link>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  LOBBY_WORLD_DETAIL,
} from "@/router";

@Component
export default class WorldCard extends Vue {

  @Prop() world!: any;

  LOBBY_WORLD_DETAIL = LOBBY_WORLD_DETAIL;


  backgroundImage(world) {
    // Custom world background images can be set provided that the assets
    // have been installed.

    let imagePath = world && world.small_background,
      imageUrl;

    if (/http(s)?:\/\//.test(imagePath)) {
      imageUrl = imagePath;
    } else if (imagePath) {
      // legacy method, where the full (but relative) path was specified to find
      // the asset. New way is either just set filename, or supply a url. THis branch
      // handles the 'just set the filename', including stripping its old (and likely
      // obsolete) path.
      const pathElements = imagePath.split("/");
      const fileName = pathElements[pathElements.length - 1];
      imageUrl = `/ui/lobby/${fileName}`;
    } else {
      imageUrl = `/ui/lobby/world-home-bg.jpg`;
    }

    return {
      backgroundImage: `url(${imageUrl})`
    };
  }

}
</script>

<style lang="scss" scoped>
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";

.world-card {
  width: 370px;
  height: 166px;
  display: block;

  a {
    background: url("/ui/lobby/world-card-horizontal-bg@2x.jpg");
    background-size: 370px 166px;
    
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    display: block;

    &:hover { 
      cursor: pointer; 
      .title {
        color: $color-primary;
        text-decoration: underline;
      }
    }

    .title {
      @include font-title-regular;
      text-align: center;
      font-size: 22px;
      letter-spacing: 1.14px;
      line-height: 27px;
      color: $color-text;
      padding-top: 40px;
    }

    .num-characters {
      color: $color-text-hex-50;
      line-height: 16px;
      font-size: 12px;
      position: absolute;
      bottom: 15px;
      text-align: center;
      width: 100%;
    }

    .overlay {
      // width: 354px;
      // height: 150px;
      // top: 8px;
      // left: 8px;

      width: 95%;
      height: 90%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 5%;
      left: 2.5%;

    }
  }
}
</style>