<template>
  <div class="reference-field">
    <div class="reference-input">
      <input
        v-if="edit_mode == true"
        :id="'field-' + schema.attr"
        :placeholder="schema.label"
        :value="inputField"
        @input="onUserReferenceChange"
        @focus="onUserReferenceChange"
        @blur="onBlur"
        autocomplete="off"
        ref="inputEl"
      />
      <div v-else>
        <input
          class="readonly-input"
          :value="readOnlyValue"
          readonly="true"
          ref="inputEl"
          @click="onClickReadonly"
        />
      </div>
    </div>

    <div class="search-results-wrapper">
      <div class="search-results">
        <div
          class="search-result"
          v-for="result in search_results"
          :key="result.id"
          @click="selectSearchResult(result)"
        >{{ result.name }} ({{result.id}})</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Debounce } from "lodash-decorators";
import axios from "axios";
import _ from "lodash";
import { Entity } from "@/core/interfaces.ts";
import { UI_MUTATIONS } from "@/constants";

@Component
export default class ReferenceField extends Vue {
  @Prop() schema!: any;
  @Prop() value!: any;

  edit_mode: boolean = false;

  user_input: string | number | null = "";
  validated_id: number | null = null;
  validated_data: Entity | null = null;

  search_results: Array<Object> = [];

  constructor() {
    super();

    if (this.value) {
      this.validated_id = this.value.id;
      this.validated_data = this.value;
    }
  }

  @Watch("edit_mode")
  onEditModeChange(edit_mode) {
    if (edit_mode) {
      this.$nextTick(() => {
        let el = this.$refs.inputEl as HTMLElement;
        el.focus();
        this.lookupReference(this.inputField);
      });
    }
  }

  @Watch("value")
  onValueChange(value) {
    this.user_input = "";
    if (this.value) {
      this.validated_id = this.value.id;
      this.validated_data = this.value;
    } else {
      this.validated_id = null;
      this.validated_data = null;
    }
  }

  get inputField() {
    if (this.validated_id) {
      return this.validated_id;
    } else if (this.user_input) {
      return this.user_input;
    }
    return "";
  }

  get elementName() {
    return this.validated_data ? this.validated_data.name : "";
  }

  get readOnlyValue() {
    if (this.validated_data)
      return this.validated_data.name + " (" + this.validated_data.id + ")";
    return "";
  }

  get model_type() {
    return this.schema.references;
  }

  // Endpoint to do the query lookups
  get endpoint() {
    const world_id = this.$store.state.builder.world.id;
    if (
      this.model_type === "item_template" ||
      this.model_type === "itemtemplate"
    ) {
      return `builder/worlds/${world_id}/itemtemplates/`;
    } else if (
      this.model_type === "mobtemplate" ||
      this.model_type === "mob_template"
    ) {
      return `builder/worlds/${world_id}/mobtemplates/`;
    } else if (
      this.model_type === "transformationtemplate" ||
      this.model_type === "transformation_template"
    ) {
      return `builder/worlds/${world_id}/transformationtemplates/`;
    } else if (this.model_type === "zone") {
      return `builder/worlds/${world_id}/zones/`;
    } else if (this.model_type === "faction") {
      return `builder/worlds/${world_id}/factions/`;
    } else if (this.model_type === "room") {
      return `builder/worlds/${world_id}/rooms/`;
    } else if (
      this.model_type === "randomitemprofile" ||
      this.model_type === "random_item_profile"
    ) {
      return `builder/worlds/${world_id}/randomitemprofiles/`;
    } else if (this.model_type === "quest") {
      return `builder/worlds/${world_id}/quests/`;
    } else if (this.model_type === "rule") {
      const loader_id = this.$store.state.builder.zones.loader.id;
      return `builder/worlds/${world_id}/loaders/${loader_id}/rules/`;
    } else if (this.model_type === "path") {
      const zone_id = this.$store.state.builder.zone.id;
      return `builder/worlds/${world_id}/zones/${zone_id}/paths/`;
    } else if (this.model_type === "user") {
      return `builder/worlds/${world_id}/users/`;
    }
  }

  onClickReadonly(event) {
    this.edit_mode = true;
  }

  onBlur(event) {
    setTimeout(() => {
      this.$store.commit(UI_MUTATIONS.EDITING_FIELD_CLEAR);
    }, 250);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      if (this.search_results.length) {
        this.search_results = [];
      }
    }, 250);

    if (
      this.user_input &&
      this.validated_id &&
      this.user_input == this.validated_id
    ) {
      this.edit_mode = false;
    }
  }

  // Debounce and trigger lookupReference
  timeout: number | null = null;
  onUserReferenceChange(event) {
    this.$store.commit(UI_MUTATIONS.EDITING_FIELD_SET);

    this.user_input = event.target.value;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.validated_id = null;
      this.validated_data = null;
      this.lookupReference(this.user_input);
    }, 250);
  }

  async lookupReference(user_input) {
    //this.user_input = user_input;

    if (this.endpoint) {
      const params = { query: user_input };
      const context = this.schema.context;
      if (context == "zone") {
        params["zone"] = this.$store.state.builder.zone.id;
      } else if (context) {
        params["context"] = context;
      }
      const resp = await axios.get(this.endpoint, { params: params });
      if (resp.data.results) {
        this.search_results = resp.data.results;
      } else if (resp.data.data) {
        this.search_results = resp.data.data;
      } else {
        this.search_results = resp.data;
      }
    }
  }

  selectSearchResult(result) {
    this.validated_id = result.id;
    this.validated_data = result;

    this.search_results = [];
    this.edit_mode = false;
    this.$emit("update", result);
    if (this.validated_id) {
      this.$emit("input", this.validated_data);
    }
  }
}
</script>


<style lang='scss' scoped>
@import "@/styles/colors.scss";

.reference-field {
  //display: flex;
  position: relative;

  .reference-input {
    position: relative;
    // .selected-element {
    //   flex-basis: 100%;
    //   flex-shrink: 0;
    //   flex-grow: 0;

    .readonly-input {
      background: $color-form-background;
    }
  }
  .selected-element {
    display: flex;
    margin-left: 10px;
    align-items: center;
  }

  .search-results-wrapper {
    position: absolute;
    width: 100%;
    .search-results {
      position: absolute;
      width: 100%;
      top: -1px;
      z-index: 10000;
      .search-result {
        border: 1px solid $color-form-border;
        background: $color-background;
        padding: 5px;
        width: 100%;

        &:not(:last-child) {
          border-bottom: 0;
        }

        &:hover {
          cursor: pointer;
          background: $color-background-light;
        }
      }
    }
  }
}
</style>