<template>
  <div class="filter-group">
    <h3 class="filter-title">{{ title.toUpperCase() }}</h3>
    <ul class="filter-choices">
      <li @click="deselect" :class="{ selected: !selectedValue }">All</li>
      <li v-for="value in values" :key="value.key" :class="{ selected: value.key == selectedValue }"
        @click="select(value.key)">{{ value.name }}</li>
    </ul>
  </div>
</template>

<script lang='ts' setup>
import { ref } from "vue";

const props = defineProps<{
  title: string;
  values: Array<any>;
  attr: string;
}>();
const emit = defineEmits(['select-filter', 'clear-filter']);

const selectedValue = ref("");

const select = (value: string) => {
  selectedValue.value = value;
  emit('select-filter', props.attr, value);
};

const deselect = () => {
  selectedValue.value = "";
  emit('clear-filter', props.attr);
};
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