<template>
  <div class="single-page" id="help">
    <div class="help-header">
      <div class="help-title">HELP</div>
      <div class="help-sections">
        <router-link :to="{name: 'help_formulas'}">Formulas</router-link>
        <router-link :to="{name: 'help_classes'}">Classes</router-link>
      </div>
    </div>

    <router-view class="help-contents-region"></router-view>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Help extends Vue {}
</script>

<style lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

#help {
  .help-header {
    display: flex;

    margin-bottom: 60px;
    @media ($mobile-site) {
      margin-bottom: 30px;
    }

    .help-title {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      color: $color-secondary;

      @include font-title-light;
      font-size: 18px;
      //color: $color-text-hex-30;
      line-height: 18px;
    }

    .help-sections {
      flex-grow: 2;

      display: flex;
      justify-content: space-evenly;

      a {
        @include font-title-light;
        font-size: 18px;
        color: $color-text-hex-30;
        line-height: 18px;

        &:hover {
          color: $color-primary;
          text-decoration: underline;
        }

        &.selected,
        &.router-link-active {
          color: $color-text;
          opacity: 1;

          &:hover {
            text-decoration: none;
          }
        }
      }
    }
  }

  .help-contents-region {
    em {
      @include font-text-regular;
      font-style: normal;
    }

    .formula {
      background: $color-background-light;
      border: 1px solid $color-background-light-border;
      color: $color-text-gray;
      padding: 10px;
    }

    .defined-item {
      margin-bottom: 0;
    }

    .item-definition {
      color: $color-text-hex-60;
    }
  }
}
</style>