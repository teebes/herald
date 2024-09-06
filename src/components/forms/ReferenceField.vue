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
          :placeholder="schema.label"
          readonly="true"
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

<script lang="ts" setup>
import { ref, watch, nextTick, computed } from 'vue';
import axios from "axios";
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps<{
  schema: any;
  value?: any;
  modelValue?: any;
  endpoint?: string;
}>();
const emit = defineEmits(['update']);

const edit_mode = ref(false);
const user_input = ref('');
const validated_id = ref(props.modelValue ? props.modelValue.id : null);
const validated_data = ref(props.modelValue || null);
const search_results = ref<any[]>([]);
const inputEl = ref<HTMLInputElement | null>(null);

watch(edit_mode, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (inputEl.value) inputEl.value.focus();
      lookupReference();
    });
  }
});

watch(() => props.modelValue, (newValue) => {
  user_input.value = '';
  if (newValue) {
    validated_id.value = newValue.id;
    validated_data.value = newValue;
  } else {
    validated_id.value = null;
    validated_data.value = null;
  }
});

const inputField = computed(() => {
  if (validated_id.value) return validated_id.value;
  return user_input.value || '';
});

const readOnlyValue = computed(() => {
  return validated_data.value ? `${validated_data.value.name} (${validated_data.value.id})` : '';
});

const model_type = computed(() => props.schema.references);

const onBlur = () => {
  if (search_results.value.length === 1 &&
      !validated_id.value) {
      selectSearchResult(search_results.value[0]);
  }

  setTimeout(() => {
    store.commit("ui/editing_field_clear");
    if (search_results.value.length) {
      search_results.value = [];
    }
  }, 250);
};


let timeout: ReturnType<typeof setTimeout> | null = null;
const onUserReferenceChange = (event) => {

  store.commit("ui/editing_field_set");
  user_input.value = event.target.value;

  if (!user_input.value) {
    validated_id.value = null;
    validated_data.value = null;
    search_results.value = [];
    emit('update', null);
    return;
  }

  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    validated_id.value = null;
    validated_data.value = null;
    lookupReference();
  }, 200);
};

const lookupReference = async () => {
  const endpoint: string = determineEndpoint();
  if (!endpoint) return;

  const params = { query: user_input.value };
  const context = props.schema.context;
  if (context === 'zone') {
    params['zone'] = store.state.builder.zone.id;
  } else if (context) {
    params["context"] = context;
  }

  const resp = await axios.get(endpoint, { params: params });
  search_results.value = resp.data.results || resp.data.data || resp.data;
};

const selectSearchResult = (result) => {
  validated_id.value = result.id;
  validated_data.value = result;
  search_results.value = [];
  edit_mode.value = false;
  emit('update', result);
};

const determineEndpoint = () => {
  if (props.endpoint) return props.endpoint;

  const world_id = store.state.builder.world.id;
  if (model_type.value === "item_template" || model_type.value === "itemtemplate") {
    return `builder/worlds/${world_id}/itemtemplates/`;
  } else if (model_type.value === "mobtemplate" || model_type.value === "mob_template") {
    return `builder/worlds/${world_id}/mobtemplates/`;
  } else if (model_type.value === "transformationtemplate" || model_type.value === "transformation_template") {
    return `builder/worlds/${world_id}/transformationtemplates/`;
  } else if (model_type.value === "zone") {
    return `builder/worlds/${world_id}/zones/`;
  } else if (model_type.value === "faction") {
    let endpoint = `builder/worlds/${world_id}/factions/`;
    if (props.schema.context === "mob_factions" || props.schema.context === "quest_reward") {
      endpoint += "?is_core=false";
    }
    return endpoint;
  } else if (model_type.value === "room") {
    return `builder/worlds/${world_id}/rooms/`;
  } else if (model_type.value === "randomitemprofile" || model_type.value === "random_item_profile") {
    return `builder/worlds/${world_id}/randomitemprofiles/`;
  } else if (model_type.value === "quest") {
    return `builder/worlds/${world_id}/quests/`;
  } else if (model_type.value === "rule") {
    const loader_id = store.state.builder.zones.loader.id;
    return `builder/worlds/${world_id}/loaders/${loader_id}/rules/`;
  } else if (model_type.value === "path") {
    const zone_id = store.state.builder.zone.id;
    return `builder/worlds/${world_id}/zones/${zone_id}/paths/`;
  } else if (model_type.value === "user") {
    return `builder/worlds/${world_id}/users/`;
  }
  return '';
}

const onClickReadonly = () => {
  edit_mode.value = true;  // Toggle edit mode to enable editing
};
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