<template>
  <ul class="pagination">
    <li @click="selectPage(1)" class="page" :class="{ active: isPageNum(1) }">1</li>

    <li v-if="pageNum > 3">...</li>

    <li v-for="page in pages" :key="page" class="page" :class="{ active: isPageNum(page) }" @click="selectPage(page)">{{
      page }}</li>

    <li v-if="pageNum < totalPages - 3">...</li>

    <li @click="selectPage(totalPages)" class="page" :class="{ active: isPageNum(totalPages) }" v-if="totalPages != 1">{{
      totalPages }}</li>
  </ul>
</template>


<script lang='ts' setup>
import { computed } from 'vue';
const props = defineProps<{
  pageNum: number;
  totalPages: number;
}>();
const emit = defineEmits(['set-page']);


const selectPage = (page: number) => {
  emit('set-page', page);
};

const isPageNum = (pageNum: number) => {
  return pageNum == props.pageNum;
};

const pages = computed(() => {
  let range: Array<number> = [];
  for (let i: number = props.pageNum - 1; i <= props.pageNum + 1; i += 1) {
    if (i <= 1 || i >= props.totalPages) {
      continue;
    }
    range.push(i);
  }
  if (props.pageNum == 1 && props.totalPages > 3) {
    range.push(3);
  }

  if (props.pageNum == props.totalPages && props.pageNum != 1 && props.totalPages < 2) {
    range.push(props.totalPages - 2);
  }

  return range;
});
</script>

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