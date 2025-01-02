<template>
  <div class="loader-rule loader-rule-display" v-if="!edit_mode">
    <div class="rule-order"># {{ order }}</div>
    <div class="load-into">
      <div class="load-template">
        <div class="load">
          <span v-if="target_type == 'rule'">Apply</span>
          <span v-else>Load {{ num_copies }}x</span>
        </div>
        <div class="template">
          <router-link class="template" :to="template_link">{{ rule.template.name }}</router-link>
        </div>
      </div>
      <div class="into-target">
        <div class="into">
          <span v-if="target_type == 'rule'">To</span>
          <span v-else>Into</span>
        </div>
        <div class="target">
          <div
            v-if="target_type == 'rule' && target_rule"
          >{{ target_rule.template.name }} - from rule # {{ target_rule.order }}</div>
          <router-link
            v-else-if="rule.target"
            class="target"
            :to="target_link"
          >{{ rule.target.name }}</router-link>
        </div>
      </div>
    </div>
    <div class="actions">
      <div>
        <button class="btn-thin" @click="edit">EDIT</button>
      </div>
      <div>
        <button class="btn-thin" @click="remove">DELETE</button>
      </div>
    </div>
  </div>

  <div class="loader-rule loader-rule-edit" v-else>
    <div class="num-copies">
      <FormField :elementSchema="num_copies_schema" v-model="num_copies" :formErrors="formErrors" />
    </div>

    <div class="template-and-target-selections">
      <div class="template_type">
        <FormField
          :elementSchema="template_type_choice_schema"
          v-model="template_type"
          :formErrors="formErrors"
        />
      </div>

      <div class="target_type">
        <FormField
          :elementSchema="target_type_choice_schema"
          v-model="target_type"
          :formErrors="formErrors"
          :readonly="template_type == 'transformationtemplate'"
        />
      </div>
    </div>

    <div class="template-and-target-references">
      <div class="template">
        <FormField
          :elementSchema="template_schema"
          v-model="template_data"
          :formErrors="formErrors"
        />
      </div>

      <div class="target">
        <div v-if="target_type == 'zone'">Into a random room in {{ store.state.builder.zone.name }}</div>
        <FormField
          v-else
          :elementSchema="target_schema"
          v-model="target_data"
          :formErrors="formErrors"
        />
      </div>
    </div>
    <div class="actions">
      <button class="btn-medium" @click="save">SAVE</button>
      <button class="btn-thin" @click="cancel">CANCEL</button>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import FormField from "@/components/forms/FormField.vue";
import { Entity } from "@/core/interfaces.ts";
import { BUILDER_FORMS } from "@/core/forms.ts";
import axios from "axios";

const store = useStore();
const route = useRoute();

const props = withDefaults(defineProps<{
  rule?: any;
  rules: any[];
  new_rule?: boolean;
}>(), { new_rule: false });
const emit = defineEmits(["added", "input", "remove", "cancel"]);

const edit_mode = ref(false);
const order = ref(1);
const num_copies = ref(1);
const template_type = ref("mobtemplate");
const template_data = ref<Entity | null>(null);
const target_type = ref("room");
const target_data = ref<Entity | null>(null);
const formErrors = ref({});

// Constructor section
if (props.new_rule) {
  edit_mode.value = true;
  if (props.rules.length === 0) order.value = 1;
  else order.value = props.rules[props.rules.length - 1].order + 1;
  num_copies.value = 1;

  // Since we know the default is a zone, set target_data to the zone
  // target_data.value = store.state.builder.zone;

  // Since we know the default is a room, set target_data to the room
  target_data.value = store.state.builder.room;

} else if (props.rule) {
  num_copies.value = props.rule.num_copies;
  order.value = props.rule.order;
  if (props.rule.template) {
    template_data.value = props.rule.template;
    if (template_data.value && template_data.value.model_type)
      template_type.value = template_data.value.model_type;
  }
  if (props.rule.target) {
    target_data.value = props.rule.target;
    if (target_data.value && target_data.value.model_type)
      target_type.value = target_data.value.model_type;
  }
}

watch(template_type, (new_template_type) => {
  if (props.rule && new_template_type == props.rule.template.model_type) {
    template_data.value = props.rule.template;
  } else {
    template_data.value = null;
  }

  if (new_template_type == "transformationtemplate") {
    target_type.value = "rule";
  }
});


watch(target_type, (new_target_type) => {
  if (props.rule && props.rule.target && new_target_type == props.rule.target.model_type) {
    target_data.value = props.rule.target;
  } else {
    if (new_target_type === "room") {
      target_data.value = store.state.builder.room;
    } else {
      target_data.value = null;
    }
  }
});

const save = async () => {
  const save_data = {
    num_copies: num_copies.value,
    template: template_data.value,
    target: target_data.value
  };

  if (!target_data.value) {
    save_data.target = store.state.builder.zone;
  }

  const world_id = route.params.world_id;
  const loader_id = route.params.loader_id;
  if (props.new_rule) {
    const resp = await axios.post(
      `builder/worlds/${world_id}/loaders/${loader_id}/rules/`,
      save_data
    );
    emit("added", resp.data);
  } else {
    const rule_id = props.rule.id;
    const resp = await axios.put(
      `builder/worlds/${world_id}/loaders/${loader_id}/rules/${rule_id}/`,
      save_data
    );
    edit_mode.value = false;
    emit("input", resp.data);
  }
};

const num_copies_schema = {
  attr: "num_copies",
  label: "Number of Copies"
};

const template_link = computed(() => {
  if (!props.rule) return { name: '', params: {} };

  let world_id = store.state.builder.world.id;
  if (store.state.builder.world.instance_of.id) {
    world_id = store.state.builder.world.instance_of.id;
  }

  if (props.rule.template.model_type == "mobtemplate") {
    return {
      name: 'builder_mob_template_details',
      params: {
        world_id: world_id,
        mob_template_id: props.rule.template.id
      }
    };
  } else if (props.rule.template.model_type == "itemtemplate") {
    return {
      name: 'builder_item_template_details',
      params: {
        world_id: world_id,
        item_template_id: props.rule.template.id
      }
    };
  } else if (props.rule.template && props.rule.template.model_type == "transformationtemplate") {
    return {
      name: 'builder_world_transformation_template_list',
      params: {
        world_id: world_id,
      }
    };
  }
  return { name: '', params: {} }
});

const template_schema = computed(() => {
  return BUILDER_FORMS.LOADER_RULE.TEMPLATE_SCHEMAS[template_type.value];
});

const target_schema = computed(() => {
  return BUILDER_FORMS.LOADER_RULE.TARGET_SCHEMAS[target_type.value];
});

const template_type_choice_schema = BUILDER_FORMS.LOADER_RULE.TEMPLATE_TYPE_SCHEMA;

const target_link = computed(() => {
  if (!props.rule || !props.rule.target) return { name: '', params: {} };
  const world_id = route.params.world_id;
  if (props.rule.target.model_type == "room") {
    return {
      name: 'builder_room_index',
      params: {
        world_id: world_id,
        room_id: props.rule.target.id
      }
    };
  } else if (props.rule.target.model_type == "path") {
    return {
      name: 'builder_zone_path_details',
      params: {
        world_id: world_id,
        path_id: props.rule.target.id
      }
    };
  } else if (props.rule.target.model_type == "zone") {
    return {
      name: 'builder_zone_index',
      params: {
        world_id: world_id,
        zone_id: props.rule.target.id
      }
    };
  }
  return { name: '', params: {} }
});

const target_rule = computed(() => {
  if (!props.rule) return;
  if (target_type.value == "rule") {
    return props.rules.find(r => r.id == props.rule.target.id);
  }
});

const target_type_choice_schema = BUILDER_FORMS.LOADER_RULE.TARGET_TYPE_SCHEMA;

const edit = () => {
  edit_mode.value = true;
};

const remove = async () => {
  await axios.delete(
    `builder/worlds/${route.params.world_id}/loaders/${route.params.loader_id}/rules/${props.rule.id}`
  );
  emit("remove", props.rule);
};

const cancel = () => {
  if (props.new_rule) {
    emit("cancel");
  } else {
    edit_mode.value = false;
  }
};
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
.loader-rule {
  //border-top: 1px solid $color-text-hex-60;
  padding: 20px 5px;

  &.loader-rule-display {
    display: flex;

    .rule-order {
      width: 40px;
      white-space: nowrap;
    }

    .load-into {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      .load,
      .into {
        width: 70px;
      }
      .load-template,
      .into-target {
        display: flex;
        flex-grow: 1;
      }
      .template,
      .target {
        a {
          color: $color-secondary;
        }
      }
    }
  }

  &.loader-rule-edit {
    .num-copies {
      input {
        width: 50px;
      }
    }

    .template-and-target-selections,
    .template-and-target-references {
      display: flex;
      > div {
        flex: 1;
        &:not(:last-child) {
          margin-right: 10px;
        }
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }

    .actions {
      margin-top: 15px;
    }
  }
}
</style>
