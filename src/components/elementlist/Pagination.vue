<template>
  <ul class="pagination">
    <li @click="selectPage(1)" class="page" :class="{active:isPageNum(1)}">1</li>

    <li v-if="pageNum > 3">...</li>

    <li
      v-for="page in pages"
      :key="page"
      class="page"
      :class="{active:isPageNum(page)}"
      @click="selectPage(page)"
    >{{ page }}</li>

    <li v-if="pageNum < totalPages - 3">...</li>

    <li
      @click="selectPage(totalPages)"
      class="page"
      :class="{active:isPageNum(totalPages)}"
      v-if="totalPages != 1"
    >{{ totalPages }}</li>
  </ul>
</template>

<style scoped lang='scss'>
@import "@/styles/colors.scss";
ul.pagination {
  list-style-type: none;
  color: $color-text-hex-70;
  padding: 0;
  //margin: 5px 0 0 0;
  margin: 0;
  li {
    display: inline-block;
    padding: 0 5px;

    width: 1em;
    text-align: center;

    border: 1px solid transparent;

    &.page:hover {
      cursor: pointer;
    }

    &.active {
      border: 1px solid $color-text-hex-70;
      &:hover {
        cursor: default;
      }
    }
  }
}

.pagination-item {
  display: inline-block;
}
</style>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Pagination extends Vue {
  @Prop() pageNum!: number;
  @Prop() totalPages!: number;

  selectPage(page) {
    this.$emit("set-page", page);
  }

  isPageNum(pageNum) {
    return this.pageNum == pageNum;
  }

  get pages() {
    let range: Array<number> = [];
    for (let i: number = this.pageNum - 1; i <= this.pageNum + 1; i += 1) {
      if (i <= 1 || i >= this.totalPages) {
        continue;
      }
      range.push(i);
    }
    if (this.pageNum == 1 && this.totalPages > 3) {
      range.push(3);
    }

    if (
      this.pageNum == this.totalPages &&
      this.pageNum != 1 &&
      this.totalPages < 2
    ) {
      range.push(this.totalPages - 2);
    }

    return range;
  }
}
</script>