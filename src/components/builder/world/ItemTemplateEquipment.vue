<template>
  <div class="equipment" v-if="item_template.type === 'equippable'">
    <h3>EQUIPMENT</h3>

    <div class="item-equipment-info">
      <FormField
        class="equipment-type-select"
        :formErrors="formErrors"
        v-model="equipment_type"
        :elementSchema="equipment_type_schema"
      />

      <template v-if="equipment_type === 'weapon_1h' || equipment_type === 'weapon_2h'">
        <div v-if="item_template.weapon_type">
          <div><span class="color-text-70">Weapon Type:</span> {{ item_template.weapon_type }}</div>
        </div>

        <div class="mt-4">
          <div class="field-desc">First person hit message:</div>
          <div>You {{ item_template.hit_msg_first }} your target</div>
        </div>

        <div class="mt-4">
          <div class="field-desc">Third person hit message:</div>
          <div>Someone {{ item_template.hit_msg_third }} their target</div>
        </div>
      </template>
      <div v-else-if="equipment_type != 'accessory'">
        <div class="field-desc">Armor class</div>
        <div>{{ item_template.armor_class }}</div>
      </div>
    </div>

    <div>
      <button class="btn-thin edit-mob" @click="editEquipment">EDIT EQUIPMENT</button>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { FormElement } from "@/core/forms.ts";
import FormField from "@/components/forms/FormField.vue";
import axios from "axios";

const store = useStore();

const formErrors = ref({});

const item_template = computed(() => store.state.builder.worlds.item_template);
const equipment_type = ref(item_template.value.equipment_type);

watch(equipment_type, async (newValue) => {
  const resp = await axios.patch(
    `builder/worlds/${store.state.builder.world.id}/itemtemplates/${item_template.value.id}/`,
    {
      equipment_type: newValue,
    }
  );
  store.commit("builder/worlds/item_template_set", resp.data);
});

const editWeapon = () => {
  const hit_msg_first: FormElement = {
    attr: "hit_msg_first",
    label: "First Person",
  };
  const hit_msg_third: FormElement = {
    attr: "hit_msg_third",
    label: "Third Person",
  };

  const weapon_type: FormElement = {
    attr: "weapon_type",
    label: "Weapon Type",
    widget: "select",
    options: [
      { value: null, label: "None" },
      { value: "sword", label: "Sword" },
      { value: "axe", label: "Axe" },
      { value: "club", label: "Club" },
      { value: "staff", label: "Staff" },
      { value: "spear", label: "Spear" },
      { value: "dagger", label: "Dagger" },
      { value: "polearm", label: "Polearm" },
      { value: "bow", label: "Bow" },
      { value: "gun", label: "Gun" },
    ],
  };

  const modal = {
    title: `Edit Weapon`,
    data: item_template.value,
    schema: [
      weapon_type,
      {
        row_name: "hit message",
        children: [hit_msg_first, hit_msg_third],
      },
    ],
    action: "builder/worlds/item_template_save",
  };
  store.commit("ui/modal/open_form", modal);

};

const editArmor = () => {
  const armor_class: FormElement = {
    attr: "armor_class",
    label: "Armor Class",
    widget: "select",
    options: [
      { value: "light", label: "Light" },
      { value: "heavy", label: "Heavy" },
    ],
  };
  const modal = {
    title: `Edit Armor`,
    data: item_template.value,
    schema: [armor_class],
    action: "builder/worlds/item_template_save",
  };
  store.commit("ui/modal/open_form", modal);
};

const editEquipment = () => {
  if (equipment_type.value === "weapon_1h" || equipment_type.value === "weapon_2h") {
    editWeapon();
  } else {
    editArmor();
  }
};

const equipment_type_schema: FormElement = {
  attr: "equipment_type",
  label: "",
  widget: "select",
  options: [
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
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

.equipment-type-select {
  width: 200px;
}
</style>