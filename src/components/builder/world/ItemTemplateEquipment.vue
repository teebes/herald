<template>
  <div class="equipment" v-if="item_template.type === 'equippable'">
    <h3>EQUIPMENT</h3>

    <div class="item-equipment-info">
      <FormField
        class="equipment-type-select"
        :formErrors="formErrors"
        :value="equipment_type"
        :elementSchema="equipment_type_schema"
        @update="onEquipmentTypeUpdate"
      />

      <template v-if="equipment_type === 'weapon_1h' || equipment_type === 'weapon_2h'">
        <div v-if="item_template.weapon_type">
          <div class="field-desc">Weapon Type</div>
          <div>{{ item_template.weapon_type }}</div>
        </div>

        <div class="mt-4">
          <div class="field-desc">First person hit</div>
          <div>You {{ item_template.hit_msg_first }} your target</div>
        </div>

        <div class="mt-4">
          <div class="field-desc">Third person hit</div>
          <div>Someone {{ item_template.hit_msg_third }} their target</div>
        </div>
      </template>
      <div v-else>
        <div class="field-desc">Armor class</div>
        <div>{{ item_template.armor_class }}</div>
      </div>
    </div>

    <div>
      <button class="btn-thin edit-mob" @click="editEquipment">EDIT EQUIPMENT</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { BUILDER_FORMS, FormElement } from "@/core/forms.ts";
import FormField from "@/components/forms/FormField.vue";
import axios from "axios";

@Component({
  components: {
    FormField
  }
})
export default class ItemTemplateEquipment extends Vue {
  formErrors: any = {};
  equipment_type: string;

  constructor() {
    super();
    this.equipment_type = this.$store.state.builder.worlds.item_template.equipment_type;
  }

  get item_template() {
    return this.$store.state.builder.worlds.item_template;
  }

  editEquipment() {
    if (
      this.equipment_type === "weapon_1h" ||
      this.equipment_type === "weapon_2h"
    ) {
      this.editWeapon();
    } else {
      this.editArmor();
    }
  }

  editWeapon() {
    const hit_msg_first: FormElement = {
      attr: "hit_msg_first",
      label: "First Person"
    };
    const hit_msg_third: FormElement = {
      attr: "hit_msg_third",
      label: "Third Person"
    };

    const weapon_type: FormElement = {
      attr: "weapon_type",
      label: "Weapon Type",
      widget: "select",
      options: [
        {
          value: null,
          label: "None"
        },
        {
          value: "sword",
          label: "Sword"
        },
        {
          value: "axe",
          label: "Axe"
        },
        {
          value: "club",
          label: "Club"
        },
        {
          value: "staff",
          label: "Staff"
        },
        {
          value: "spear",
          label: "Spear"
        },
        {
          value: "dagger",
          label: "Dagger"
        },
        {
          value: "polearm",
          label: "Polearm"
        }
      ]
    };

    const modal = {
      title: `Edit Weapon`,
      data: this.item_template,
      schema: [
        weapon_type,
        {
          row_name: "hit message",
          children: [hit_msg_first, hit_msg_third]
        }
      ],
      action: "builder/worlds/item_template_save"
    };
    this.$store.commit("ui/modal_set", modal);
  }

  editArmor() {
    const armor_class: FormElement = {
      attr: "armor_class",
      label: "Armor Class",
      widget: "select",
      options: [
        {
          value: "light",
          label: "Light"
        },
        {
          value: "heavy",
          label: "Heavy"
        }
      ]
    };
    const modal = {
      title: `Edit Armor`,
      data: this.item_template,
      schema: [armor_class],
      action: "builder/worlds/item_template_save"
    };
    this.$store.commit("ui/modal_set", modal);
  }

  get equipment_type_schema() {
    const equipmentType: FormElement = {
      attr: "equipment_type",
      label: "",
      widget: "select",
      options: [
        {
          value: "weapon_1h",
          label: "1H Weapon"
        },
        {
          value: "weapon_2h",
          label: "2H Weapon"
        },
        {
          value: "shield",
          label: "Shield"
        },
        {
          value: "head",
          label: "Head"
        },
        {
          value: "body",
          label: "Body"
        },
        {
          value: "arms",
          label: "Arms"
        },
        {
          value: "hands",
          label: "Hands"
        },
        {
          value: "waist",
          label: "Waist"
        },
        {
          value: "legs",
          label: "Legs"
        },
        {
          value: "feet",
          label: "Feet"
        }
      ]
    };
    return equipmentType;
  }

  async onEquipmentTypeUpdate(attr, value) {
    const resp = await axios.patch(
      `builder/worlds/${this.$store.state.builder.world.id}/itemtemplates/${this.item_template.id}/`,
      {
        equipment_type: value
      }
    );
    this.$store.commit("builder/worlds/item_template_set", resp.data);
    this.equipment_type = value;
  }
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

.equipment-type-select {
  width: 200px;
}
</style>