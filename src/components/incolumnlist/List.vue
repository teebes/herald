<template>
  <div>
    <Element
      v-for="(element, index) in elements"
      :key="element.attr"
      :endpoint="endpoint"
      :endpoint_filters="endpoint_filters"
      :element="element"
      :schema="schema"
      :selected="selected"
      :editable="editable"
      @update="$set(elements, index, $event)"
      @click.native="onClick(element)"
      @remove="onRemove(index)"
    />

    <Element
      v-if="adding"
      isNew="true"
      :endpoint="endpoint"
      :endpoint_filters="endpoint_filters"
      :element="newData"
      :schema="schema"
      @create="onCreate"
      @cancel="adding = false"
    />

    <button class="btn-add" @click="add" v-if="!adding">ADD {{ title.toUpperCase() }}</button>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import Element from "./Element.vue";

@Component({
  components: {
    Element
  }
})
export default class InColumnList extends Vue {
  @Prop() endpoint!: string;
  @Prop() endpoint_filters!: {};
  @Prop() schema!: Array<any>;
  @Prop() title!: string;
  @Prop() initial_new_data!: {};
  @Prop() selected!: any;
  @Prop({ default: true }) editable!: boolean;

  adding: boolean = false;

  elements: Array<Object> = [];

  get newData() {
    let data = {};

    if (this.initial_new_data) return this.initial_new_data;

    for (let elementSchema of this.schema) {
      data[elementSchema.attr] = elementSchema.default || "";
    }
    return data;
  }

  async fetch() {
    let endpoint = this.endpoint;

    let filters: string[] = [];
    if (this.endpoint_filters) {
      for (const filter_name in this.endpoint_filters) {
        const filter_value = this.endpoint_filters[filter_name];
        filters.push(`${filter_name}=${filter_value}`);
      }
      if (filters.length) endpoint += "?" + filters.join("&");
    }

    const resp = await axios.get(endpoint);
    if (resp.data.data) this.elements = resp.data.data;
    else if (resp.data.results) this.elements = resp.data.results;
    else this.elements = resp.data;
  }

  async mounted() {
    await this.fetch();
  }

  add() {
    this.adding = true;
  }

  onCreate(element) {
    this.elements.push(element);
    this.adding = false;
    this.$emit("add", element);
  }

  onRemove(index) {
    const removed = this.elements.splice(index, 1);
    this.$emit("remove", removed[0]);
  }

  onClick(element) {
    this.$emit("clickElement", element);
  }
}
</script>