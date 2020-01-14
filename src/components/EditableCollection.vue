<template>
  <div class="editable-collection">
    <h2>{{ title.toUpperCase() }}S</h2>

    <div class="my-4">
      <slot></slot>
    </div>

    <div v-if="collection" class="collection-element-list">
      <div class="collection-element" v-for="resource in collection" :key="resource.id">
        <component class="display-view" :is="display_component" :resource="resource" />
        <div class="actions">
          <div>
            <button class="btn-thin" @click="edit(resource)">EDIT</button>
          </div>
          <div>
            <button class="btn-thin" @click="remove(resource)">DELETE</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="fetched">No {{ title.toLowerCase() }}</div>

    <div v-if="fetched" class="collection-add">
      <button class="btn-small add-button" @click="add">ADD {{ title.toUpperCase() }}</button>
    </div>
  </div>
</template>

<script lang='ts'>
/*
    The display-edit component aims to expose a display view
    that is customizable and an edit link done via schema / modal.
*/
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { FormElement } from "@/core/forms.ts";
import { UI_MUTATIONS } from "@/constants.ts";

@Component
export default class extends Vue {
  @Prop() display_component!: any;
  @Prop() registration_name!: string;
  @Prop() title!: string;
  @Prop() endpoint!: string;
  @Prop() schema!: FormElement[];
  @Prop() action_add!: string;
  @Prop() action_edit!: string;
  @Prop() action_delete!: string;

  fetched: boolean = false;

  get collection() {
    if (this.$store.state.builder[this.registration_name])
      return this.$store.state.builder[this.registration_name].collection;
    return [];
  }

  async mounted() {
    this.$store.commit("builder/register_collection", {
      name: this.registration_name,
      endpoint: this.endpoint
    });
    await this.$store.dispatch(`builder/${this.registration_name}/fetch`);
    this.fetched = true;
  }

  destroyed() {
    this.$store.commit("builder/unregister_collection", this.registration_name);
  }

  add() {
    let new_data = {};
    for (const field of this.schema) {
      if (field.default !== undefined) new_data[field.attr] = field.default;
      else new_data[field.attr] = "";
    }
    const modal = {
      data: new_data,
      schema: this.schema,
      action: this.action_add || `builder/${this.registration_name}/create`,
      title: `Add ${this.title}`
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  edit(resource) {
    // Support for create-only elements, references that we want
    // to show on create but not on edit. Example is world buidlers.
    // When we create one, we want to set which user it is but when
    // we edit the association, we don't want to be able to change the
    // user.
    const schema: FormElement[] = [];
    for (let schemaElement of this.schema) {
      if (!schemaElement.create_only) {
        schema.push(schemaElement);
      }
    }

    const modal = {
      title: `EDIT ${this.title}`,
      data: resource,
      schema: schema,
      action: this.action_edit || `builder/${this.registration_name}/edit`
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  remove(resource) {
    this.$store.dispatch(
      this.action_delete || `builder/${this.registration_name}/delete`,
      resource.id
    );
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.editable-collection {
  width: 100%;
  max-width: 600px;

  .collection-element-list {
    margin-top: 20px;

    .collection-element {
      padding: 15px;
      border-top: 1px solid $color-text-hex-30;

      display: flex;

      .display-view {
        flex-grow: 1;
      }

      .actions > button {
        //display: block;
      }
    }
  }
  .collection-add {
    margin: 20px 0 100px 0;
  }
}
</style>