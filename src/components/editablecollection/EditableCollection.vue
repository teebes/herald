<template>
  <div class="editable-collection">
    <h2>{{ title.toUpperCase() }}S</h2>

    <div class="my-4">
      <slot></slot>
    </div>

    <div v-if="collection" class="collection-element-list">
      <div
        class="collection-element"
        v-for="resource in collection"
        :key="resource.id"
      >
        <component
          class="display-view"
          :is="display_component"
          :resource="resource"
          @addToCollection="addToCollection"
        />
        <div class="actions" v-if="show_actions != false">
          <div>
            <button class="btn-thin" @click="edit(resource)">EDIT</button>
          </div>
          <div v-if="show_delete != false">
            <button class="btn-thin" @click="remove(resource)">DELETE</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="fetched">No {{ title.toLowerCase() }}</div>

    <div v-if="fetched && show_add != false" class="collection-add">
      <button class="btn-small add-button" @click="add">
        ADD {{ title.toUpperCase() }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
/*
    The display-edit component aims to expose a display view
    that is customizable and an edit link done via schema / modal.
*/
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
// import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { FormElement } from "@/core/forms.ts";
// import { UI_MUTATIONS } from "@/constants.ts";

const store = useStore();

const props = withDefaults(defineProps<{
  display_component: any;
  registration_name: string;
  title: string;
  endpoint: string;
  schema: FormElement[];
  action_add?: string;
  action_edit?: string;
  action_delete?: string;
  page_size?: number;
  show_add?: boolean;
  show_actions?: boolean;
  show_delete?: boolean;
}>(), {
  show_add: true,
  show_actions: true,
  show_delete: true,

});

const fetched = ref(false);

const collection = computed(() => {
  if (store.state.builder[props.registration_name])
    return store.state.builder[props.registration_name].collection;
  return [];
});

onMounted(async () => {
  store.commit("builder/register_collection", {
    name: props.registration_name,
    endpoint: props.endpoint,
  });
  const options: any = {};
  if (props.page_size) options.page_size = props.page_size;
  await store.dispatch(
    `builder/${props.registration_name}/fetch`,
    options
  );
  fetched.value = true;
});

onUnmounted(() => {
  store.commit("builder/unregister_collection", props.registration_name);
});


const add = () => {
  let new_data = {};
  for (const field of props.schema) {
    if (field.children) {
      for (const child of field.children) {
        if (child.default !== undefined) new_data[child.attr] = child.default;
        else new_data[child.attr] = "";
      }
    }
    else {
      if (field.default !== undefined) new_data[field.attr] = field.default;
      else new_data[field.attr] = "";
    }
  }
  const modal = {
    data: new_data,
    schema: props.schema,
    action: props.action_add || `builder/${props.registration_name}/create`,
    title: `Add ${props.title}`,
  };
  store.commit('ui/modal/open_form', modal);
};

const addToCollection = (resource) => {
  store.commit(`builder/${props.registration_name}/add_instance`, resource);
};

const edit = (resource) => {
  const schema: FormElement[] = [];
  for (let schemaElement of props.schema) {
    if (!schemaElement.create_only) {
      schema.push(schemaElement);
    }
  }

  const modal = {
    title: `EDIT ${props.title}`,
    data: resource,
    schema: schema,
    action: props.action_edit || `builder/${props.registration_name}/edit`,
  };
  store.commit('ui/modal/open_form', modal);
};

const remove = (resource) => {
  store.dispatch(
    props.action_delete || `builder/${props.registration_name}/delete`,
    resource.id
  );
};
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
