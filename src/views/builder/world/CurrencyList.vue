<template>
  <EditableCollection
    title="Currency"
    registration_name="currencies"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
    :page_size="100">
  </EditableCollection>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CurrencyDetails from "@/components/builder/world/CurrencyDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement } from "@/core/forms.ts";

const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/currencies/`;

const display_component = CurrencyDetails;

const schema = computed<any[]>(() => {
  const code: FormElement = {
    attr: "code",
    label: "Code",
    required: true,
    help: `The currency code that commands (for example /award) and conditions will refer to.`
  }
  const name: FormElement = {
    attr: "name",
    label: "Name",
    required: true,
    help: `The name of the currency.`
  }
  // const is_default: FormElement = {
  //   attr: "is_default",
  //   label: "Default",
  //   widget: "checkbox",
  //   default: false,
  //   help: `If this currency is the default currency for the world.`
  // }

  return [
    code,
    name,
    // is_default,
  ];
});
</script>