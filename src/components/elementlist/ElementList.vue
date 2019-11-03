<template>
  <div class="element-list">
    <div class="resource-list">
      <div v-if="loading" class="loading-screen">Loading...</div>

      <div v-else-if="elements">
        <div class="list-header">
          <div class="left-side">
            <h2>{{ title.toUpperCase() }}</h2>

            <div class="pagination-or-search">
              <div class="form-group" v-if="showSearch">
                <input type="text" v-model="searchText" ref="search" />
              </div>
              <Pagination
                :pageNum="pageNum"
                :totalPages="totalPages"
                @set-page="onSetPage"
                v-else-if="totalPages > 1"
              />
            </div>
          </div>

          <div class="actions">
            <button class="btn-small search-button" @click="onToggleSearch">
              <div class="search-symbol">&#9906;</div>
            </button>
            <button class="btn-small add-button" @click="onAdd" v-if="!exclude_add">ADD</button>
          </div>
        </div>

        <ElementTable
          :title="title"
          :elements="elements"
          :totalPages="totalPages"
          :schema="schema"
          @show-details="onShowDetails"
          v-if="elements.length"
        />
        <div v-else class="no-records">No {{ title }} defined.</div>
      </div>
    </div>

    <div v-if="filters" class="resource-filters">
      <FilterGroup
        v-for="filter_group in filters"
        :key="filter_group.attr"
        :values="filter_group.filter_options"
        :title="filter_group.label"
        :attr="filter_group.attr"
        @select-filter="onSelectFilter"
        @clear-filter="onClearFilter"
      />
    </div>
  </div>
</template>


<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { UI_MUTATIONS, UI_MODALS } from "@/constants";
import ElementTable from "@/components/elementlist/ElementTable.vue";
import Pagination from "@/components/elementlist/Pagination.vue";
import FilterGroup from "@/components/elementlist/FilterGroup.vue";
import {
  ElementListSchema,
  ElementListFilterItem,
  ElementListFilterGroup
} from "@/core/interfaces.ts";
import axios from "axios";

@Component({
  components: {
    Pagination,
    FilterGroup,
    ElementTable
  }
})
export default class ElementList extends Vue {
  @Prop() title!: string;
  @Prop() schema!: Array<ElementListSchema>;
  @Prop() filters!: Array<ElementListFilterGroup>;
  @Prop() endpoint!: string;
  @Prop() resolve_route!: Function;
  @Prop() exclude_add!: boolean;

  pageNum: number = 1;
  loading: boolean = true;
  paginated_data: any = {};
  selectedFilter: string = "";
  appliedFilters: any = {};

  showSearch: boolean = false;
  searchText = "";

  fetchData() {
    const filters = {
      ...this.appliedFilters,
      page: this.pageNum
    };
    if (this.searchText) {
      filters.query = this.searchText;
      filters.page = 1;
    }
    axios.get(this.endpoint, { params: filters }).then(response => {
      this.loading = false;
      this.paginated_data = response.data;
    });
  }

  mounted() {
    this.fetchData();
  }

  get elements() {
    return this.paginated_data.results;
  }

  get totalPages() {
    return Math.ceil(this.paginated_data.count / 10);
  }

  // Search
  timeout: number | null = null;
  @Watch("searchText")
  onChangeSearchText(text) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.fetchData();
    }, 250);
  }

  // Pagination

  onSetPage(pageNum) {
    this.pageNum = pageNum;
    this.fetchData();
  }

  onSelectFilter(attr, value) {
    this.pageNum = 1;
    this.appliedFilters[attr] = value;
    this.fetchData();
  }

  onClearFilter(attr) {
    this.pageNum = 1;
    delete this.appliedFilters[attr];
    this.fetchData();
  }

  // Display details

  onShowDetails(element) {
    const route_data = this.resolve_route(element);
    this.$router.push(route_data);
  }

  onAdd() {
    this.$emit("add");
  }

  // search
  onToggleSearch() {
    if (this.showSearch) {
      this.showSearch = false;
      this.searchText = "";
    } else {
      this.showSearch = true;
      this.$nextTick(() => {
        const el = this.$refs.search as HTMLElement;
        el.focus();
      });
    }
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/fonts.scss";
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";

.element-list {
  flex-grow: 1;

  display: flex;
  flex-direction: row;

  .resource-list {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .loading-screen {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: center;
      align-items: center;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      min-height: 36px;
      align-items: center;
      //align-items: center;

      .left-side {
        display: flex;
        flex-grow: 1;

        @media ($mobile-site) {
          flex-direction: column;
        }
        @media ($desktop-site) {
          justify-content: space-between;
          align-items: center;
        }

        h2 {
          flex-grow: 1;
          display: block;
        }

        .pagination-or-search {
          @media ($mobile-site) {
            display: flex;
            min-height: 36px;
            align-items: center;
          }

          .form-group {
            margin: 0;
          }
        }
      }

      .actions {
        display: flex;

        @media ($mobile-site) {
          flex-direction: column;
          .add-buttom {
            order: 1;
          }
          .search-button {
            order: 2;
            margin-top: 5px;
          }
        }

        .search-button {
          @media ($desktop-site) {
            margin: 0 5px;
          }

          .search-symbol {
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
            font-size: 1em;
          }
        }
      }
    }

    .no-records {
      margin-top: 20px;
    }
  }

  .resource-filters {
    margin-left: 20px;
    //@media ($mobile-site) { margin-left: 10px; }
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>
