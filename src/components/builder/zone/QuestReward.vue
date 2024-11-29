<template>
  <div v-if="!edit_mode" class="display-mode">
    <div v-if="reward.type == 'item'">
      Receive {{ reward.qty }} copies of
      <router-link
        :to="get_profile_link(reward.profile)"
        class="reference-link"
      >{{ reward.profile.name }}</router-link>.
    </div>
    <div v-if="reward.type == 'exp'">Receive {{ reward.qty }} experience.</div>
    <div v-if="reward.type == 'gold'">Receive {{ reward.qty }} gold.</div>
    <div v-if="reward.type == 'glory'">Receive {{ reward.qty }} glory.</div>
    <div
      v-if="reward.type == 'faction'"
    >Receive {{ reward.qty }} standing with {{ reward.profile.name }}.</div>
    <div v-if="reward.type == 'currency'">
      Receive {{ reward.qty }} {{ currency_name }}.
    </div>

    <div class="actions">
      <button class="btn-thin" @click="edit">EDIT</button>
      <button class="btn-thin" @click="remove">DELETE</button>
    </div>
  </div>
  <div v-else class="edit-mode">
    <div class="reward-selection">
      <div class="reward-type-selection">
        <FormField
          :elementSchema="reward_type_selection_schema"
          v-model="reward_type"
          :formErrors="formErrors"
        />
      </div>

      <div class="reward-data">
        <FormField
          v-if="reward_type === 'item'"
          :elementSchema="item_template_schema"
          v-model="reward_data"
          :formErrors="formErrors"
        />

        <FormField
          v-else-if="reward_type === 'profile'"
          :elementSchema="profile_schema"
          v-model="reward_data"
          :formErrors="formErrors"
        />

        <FormField
          v-else-if="reward_type === 'faction'"
          :elementSchema="faction_schema"
          v-model="reward_data"
          :formErrors="formErrors"
        />

        <FormField
          v-else-if="reward_type == 'currency'"
          class="currency"
          :elementSchema="currency_schema"
          v-model="currency_id"
          :formErrors="formErrors"/>

        <FormField :elementSchema="quantity_schema" v-model="quantity" :formErrors="formErrors" />
      </div>
    </div>

    <div class="actions">
      <button class="btn-medium" @click="save">SAVE</button>
      <button class="btn-thin" @click="cancel">CANCEL</button>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import FormField from "@/components/forms/FormField.vue";
import { Entity } from "@/core/interfaces.ts";
import { FormElement, BUILDER_FORMS } from "@/core/forms";
/*
  Reward types:
      REWARD_TYPE_ITEM = 'item'
      REWARD_TYPE_EXP = 'exp'
      REWARD_TYPE_GOLD = 'gold'
      REWARD_TYPE_FACTION = 'faction'
*/

const store = useStore();
const route = useRoute();

const edit_mode = ref(false);
const reward_type = ref("gold");
const reward_data = ref<Entity | null>(null);
const formErrors = ref({});
const quantity = ref(1);
const currency_id = ref(0);

const props = defineProps<{
  reward?: any;
  new_reward?: boolean;
}>();
const emit = defineEmits(["cancel", "added"]);

// Constructor
if (props.reward !== undefined) {
  reward_type.value = props.reward.type;
  // For random item profiles, we create a frontend-only 'profile' type so
  // it can be differentiated from templated items.
  if (props.reward.type === "item") {
    if (props.reward.profile.model_type === "randomitemprofile") {
      reward_type.value = "profile";
    }
  }

  quantity.value = props.reward.qty;
  reward_data.value = props.reward.profile;
  if (props.reward.currency) {
    currency_id.value = props.reward.currency;
  }
} else if (props.new_reward) {
  edit_mode.value = true;
}

if (!currency_id.value) {
  const currency = store.state.builder.world.currencies.find(c => c.is_default === true);
  if (currency) currency_id.value = currency.id;
}

watch(reward_type, () => {
  reward_data.value = null;
});

const get_profile_link = (profile: Entity) => {
  if (profile.model_type === "randomitemprofile") {
    return {
      name: 'builder_world_random_profile_list',
      params: {
        world_id: route.params.world_id
      }
    };
  } else if (profile.model_type === "itemtemplate") {
    return {
      name: 'builder_item_template_details',
      params: {
        world_id: route.params.world_id,
        item_template_id: profile.id
      }
    };
  }
  return "";
}

const quantity_schema: FormElement = {
  attr: "qty",
  label: "Quantity"
};

const item_template_schema = BUILDER_FORMS.ITEM_TEMPLATE;

const faction_schema: FormElement = {
  attr: "faction",
  label: "Faction Standing",
  widget: "reference",
  references: "faction",
  context: "quest_reward"
};

const profile_schema: FormElement = {
  attr: "profile",
  label: "Random Profile",
  widget: "reference",
  references: "randomitemprofile"
};

const reward_type_selection_schema: FormElement = {
  attr: "type",
  label: "Reward Type",
  widget: "select",
  options: [
    {
      value: "item",
      label: "Item"
    },
    {
      value: "profile",
      label: "Random Item"
    },
    {
      value: "exp",
      label: "Experience"
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
      value: "faction",
      label: "Faction Standing"
    },
    {
      value: "currency",
      label: "Currency",
    },
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
  if (!props.new_reward) edit_mode.value = false;
  emit("cancel");
};

const save = async () => {
  const save_data = {
    qty: quantity.value,
    profile: reward_data.value,
    type: reward_type.value,
    currency: null as number | null
  };
  if (reward_type.value === "profile") save_data.type = "item";
  if (reward_type.value === "currency") save_data.currency = currency_id.value;

  if (props.new_reward) {
    await store.dispatch("builder/zones/quest_reward_create", save_data);
    emit("added");
  } else {
    await store.dispatch("builder/zones/quest_reward_save", {
      reward_id: props.reward.id,
      data: save_data
    });
    edit_mode.value = false;
  }
};
const remove = () => {
  store.dispatch("builder/zones/quest_reward_delete", props.reward.id);
};
</script>

<style lang='scss' scoped>
.reward-selection {
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