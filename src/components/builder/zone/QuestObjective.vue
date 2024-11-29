<template>
  <div v-if="!edit_mode" class="display-mode">
    <div v-if="objective.type == 'item'">
      Turn in {{ objective.qty }} copies of
      <router-link
        :to="get_item_link(objective.template.id)"
        class="reference-link"
      >{{ objective.template.name }}</router-link>.
    </div>

    <div v-if="objective.type == 'mob'">
      Kill {{ objective.qty }}
      <router-link
        :to="get_mob_link(objective.template.id)"
        class="reference-link"
      >{{ objective.template.name }}</router-link>.
    </div>
    <div v-if="objective.type == 'gold'">Turn in {{ objective.qty }} Gold.</div>
    <div v-if="objective.type == 'glory'">Turn in {{ objective.qty }} Glory.</div>
    <div v-if="objective.type === 'medals'">Turn in {{ objective.qty }} Medals.</div>
    <div v-if="objective.type === 'currency'">Turn in {{ objective.qty }} {{ currency_name }}</div>

    <div class="actions">
      <button class="btn-thin" @click="edit">EDIT</button>
      <button class="btn-thin" @click="remove">DELETE</button>
    </div>
  </div>
  <div v-else class="edit-mode">
    <div class="objective-selection">
      <div class="objective-type-selection">
        <FormField
          :elementSchema="objective_type_selection_schema"
          v-model="objective_type"
          :formErrors="formErrors"
        />
      </div>

      <div class="objective-target">
        <FormField
          v-if="objective_type == 'item'"
          class="template"
          :elementSchema="item_template_schema"
          v-model="objective_data"
          :formErrors="formErrors"
        />

        <FormField
          v-else-if="objective_type == 'mob'"
          class="template"
          :elementSchema="mob_template_schema"
          v-model="objective_data"
          :formErrors="formErrors"
        />

        <FormField
          v-else-if="objective_type == 'currency'"
          class="currency"
          :elementSchema="currency_schema"
          v-model="currency_id"
          :formErrors="formErrors"/>

        <FormField
          class="quantity"
          :elementSchema="quantity_schema"
          v-model="quantity"
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
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import FormField from "@/components/forms/FormField.vue";
import { Entity } from "@/core/interfaces.ts";
import { FormElement, BUILDER_FORMS } from "@/core/forms";

/*
  Objective types:
      OBJECTIVE_TYPE_ITEM = 'item'
      OBJECTIVE_TYPE_MOB = 'mob'
      OBJECTIVE_TYPE_GOLD = 'gold'
*/

const store = useStore();

const edit_mode = ref(false);
const objective_type = ref("gold");
const objective_data = ref<Entity | null>(null);
const currency_id = ref(0);
const formErrors = ref({});
const quantity = ref(1);

const props = defineProps<{
  new_objective?: boolean;
  objective?: any;
}>();
const emit = defineEmits(["cancel", "added"]);

// Constructor
if (props.objective !== undefined) {
  objective_type.value = props.objective.type;
  quantity.value = props.objective.qty;
  objective_data.value = props.objective.template;
  if (props.objective.currency) {
    currency_id.value = props.objective.currency;
  }
} else if (props.new_objective) {
  edit_mode.value = true;
}

if (!currency_id.value) {
  const currency = store.state.builder.world.currencies.find(c => c.is_default === true);
  if (currency) currency_id.value = currency.id;
}

const get_item_link = (item_template_id: number) => {
  return {
    name: 'builder_item_template_details',
    params: {
      world_id: useRoute().params.world_id,
      item_template_id: item_template_id
    }
  };
}

const get_mob_link = (mob_template_id: number) => {
  return {
    name: 'builder_mob_template_details',
    params: {
      world_id: useRoute().params.world_id,
      mob_template_id: mob_template_id
    }
  };
}

const quantity_schema: FormElement = {
  attr: "qty",
  label: "Quantity"
};

const item_template_schema = BUILDER_FORMS.ITEM_TEMPLATE;
const mob_template_schema = BUILDER_FORMS.MOB_TEMPLATE;
const objective_type_selection_schema: FormElement = {
  attr: "type",
  label: "Objective Type",
  widget: "select",
  options: [
    {
      value: "item",
      label: "Item Turned In"
    },
    {
      value: "mob",
      label: "Mob Killed"
    },
    {
      value: "gold",
      label: "Gold"
    },
    {
      value: "glory",
      label: "Glory"
    },
    {
      value: "medals",
      label: "Medals"
    },
    {
      value: "currency",
      label: "Currency",
    }
  ]
};

const currency_schema = {
  attr: "currency",
  label: "Currency",
  options: store.state.builder.world.currencies.map(c => ({
    value: c.id,
    label: c.name
  }))
};

const currency_name = computed(() => {
  const currency = store.state.builder.world.currencies.find(c => c.id === currency_id.value);
  return currency ? currency.name : "";
});

const edit = () => { edit_mode.value = true; };
const cancel = () => {
  if (!props.new_objective) edit_mode.value = false;
  emit("cancel");
};

const save = async () => {
  const save_data = {
    qty: quantity.value,
    template: objective_data.value,
    type: objective_type.value,
    currency: null as number | null,
  };
  if (objective_type.value === 'currency') {
    save_data.currency = currency_id.value;
  }

  if (props.new_objective) {
    await store.dispatch("builder/zones/quest_objective_create", save_data);
    emit("added");
  } else {
    await store.dispatch("builder/zones/quest_objective_save", {
      objective_id: props.objective.id,
      data: save_data
    });
    edit_mode.value = false;
  }
};

const remove = () => {
  store.dispatch("builder/zones/quest_objective_delete", props.objective.id);
};
</script>

<style lang='scss' scoped>
.objective-selection {
  display: flex;
  > div {
    flex: 1;
    &.quantity {
      flex: 0.2;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
}
</style>