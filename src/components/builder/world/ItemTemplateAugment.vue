<template>
  <div>
    <h3>AUGMENT OPTIONS</h3>

    <p class="color-text-70">Augments can be targeted to only work in specific equipment slots. To do so, select the appropriate augment equipment type below.</p>

    <div>Augment Equipment Type</div>

    <div class="item-equipment-info">
        <FormField
          class="equipment-type-select"
          :formErrors="formErrors"
          v-model="equipment_type"
          :elementSchema="equipment_type_schema"
        />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { FormElement } from "@/core/forms.ts";
import FormField from "@/components/forms/FormField.vue";
import axios from "axios";

const store = useStore();
const formErrors = ref({});

const item_template = computed(() => store.state.builder.worlds.item_template);
const equipment_type = ref(item_template.value.equipment_type);

const equipment_type_schema: FormElement = {
  attr: "equipment_type",
  label: "",
  widget: "select",
  options: [
    { value: null, label: "None"},
    { value: "weapon_1h", label: "1H Weapon" },
    { value: "weapon_2h", label: "2H Weapon" },
    { value: "shield", label: "Shield" },
    { value: "head", label: "Head" },
    { value: "body", label: "Body" },
    { value: "arms", label: "Arms" },
    { value: "hands", label: "Hands" },
    { value: "waist", label: "Waist" },
    { value: "legs", label: "Legs" },
    { value: "feet", label: "Feet" },
    { value: "accessory", label: "Accessory" },
  ],
};

watch(equipment_type, async (newValue) => {
  const resp = await axios.patch(
    `builder/worlds/${store.state.builder.world.id}/itemtemplates/${item_template.value.id}/`,
    {
      equipment_type: newValue,
    }
  );
  store.commit("builder/worlds/item_template_set", resp.data);
});
</script>