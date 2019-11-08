<template>
  <div class="filter-group">
    <h3 class="filter-title">{{ title.toUpperCase() }}</h3>
    <ul class="filter-choices">
      <li @click="deselect" :class="{selected: !selectedValue}">All</li>
      <li
        v-for="value in values"
        :key="value.key"
        :class="{selected: value.key == selectedValue}"
        @click="select(value.key)"
      >{{ value.name }}</li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class FilterGroup extends Vue {
  @Prop() title!: string;
  @Prop() values!: Array<any>;
  @Prop() attr!: string;

  selectedValue: string = "";

  deselect() {
    this.$emit("clear-filter", this.attr);
    this.selectedValue = "";
  }

  select(value) {
    this.selectedValue = value;
    this.$emit("select-filter", this.attr, value);
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/fonts.scss";
@import "@/styles/colors.scss";
.filter-group {
  .filter-title {
    @include font-title-regular;
    color: $color-text-hex-50;
    border-bottom: 1px solid;
    padding-bottom: 0.5em;
    margin-bottom: 1em;
    margin-top: 1em;
    font-size: 13px;
    line-height: 16px;
    letter-spacing: 0.5px;
  }

  ul.filter-choices {
    padding: 0;
    li {
      @include font-text-light;
      letter-spacing: -0.5px;
      line-height: 19px;
      list-style-type: none;

      &:hover {
        color: $color-primary;
        text-decoration: underline;
        cursor: pointer;
      }

      &.selected {
        color: $color-secondary;
      }
    }
  }
}
</style>