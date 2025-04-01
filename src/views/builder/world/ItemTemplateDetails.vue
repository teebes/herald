<template>
  <div id="item-template-details" v-if="item_template" class="template-detail">
    <div class="template-data">
      <div class="template-info-and-descs">
        <div class="template-info">
          <h2 class="entity-title">{{ item_template.name }}</h2>

          <div v-if="store.state.builder.world.builder_info.builder_rank < 3 && item_template.has_assignment !== undefined" class="color-text-50 mb-4">
            <span v-if="item_template.has_assignment">This item template is assigned to you, you can edit it.</span>
            <span v-else>This item template is not assigned to you, you can view it but not edit it.</span>
          </div>

          <div class="item-summary text-base">
            Level {{ item_template.level }}
            <span
              v-if="item_template.quality != 'normal'"
              :class="item_template.quality"
            >{{ item_template.quality }}</span>
            {{ item_template.type }}
          </div>
          <div class="mb-2">ID: {{ item_template.id }}</div>

          <div class="notes" v-if="item_template.notes">
            <span class="color-text-70">Notes:</span> {{ item_template.notes }}
          </div>

          <div class="cost">
            <span class='color-text-70'>{{ currency_name }} Value:</span> {{ item_template.cost }}
          </div>

          <div class="info-actions mt-4">
            <button class="btn-small edit-mob" @click="editInfo">EDIT INFO</button>
            <button class="btn-small delete-mob delete-template" @click="deleteItem">DELETE ITEM</button>
          </div>
        </div>

        <div class="descriptions">
          <div class="room-description">
            <h3>DESCRIPTION IN ROOM</h3>
            <div v-if="item_template.ground_description">{{ item_template.ground_description }}</div>
            <div v-else class="color-text-70">
              <div>How this item is described when a room is looked at or moved into.</div>
              <div class="defaulting">
                None set. Defaulting to:
                <span
                  class="color-text"
                >{{ capfirst(item_template.name) }} lies here.</span>
              </div>
            </div>
            <button class="btn-thin" @click="editRoomDesc">EDIT</button>
          </div>

          <div class="look-description">
            <h3>LOOK DESCRIPTION</h3>
            <div v-if="item_template.description">
              <div class='description-line'
                   v-for="(line, index) in item_template.description.split('\n')"
                   :key="index">
                {{ line }}
              </div>
            </div>
            <div v-else class="color-text-70">
              <div>A look description is what a character sees when they look at this item.</div>
              <div class="defaulting">
                None set. Defaulting to:
                <span class="color-text">It is {{ item_template.name }}.</span>
              </div>
            </div>
            <button class="btn-thin" @click="editLookDesc">EDIT</button>
          </div>

          <div class="template-keywords">
            <h3>TARGETED BY KEYWORDS</h3>
            <div v-if="item_template.keywords">{{ item_template.keywords }}</div>
            <div v-else class="color-text-70">
              <div>
                Target keywords are how the item can be selected by commands such as
                look, get, drop, wear, etc.
              </div>
              <div class="defaulting">
                None set. Defaulting to:
                <span class="color-text">{{ item_template.empty_keywords }}</span>
              </div>
            </div>
            <button class="btn-thin" @click="editKeywords">EDIT</button>
          </div>

          <div class="template-currency">
            <h3>CURRENCY</h3>
            <FormField
              class="currency-select"
              :formErrors="formErrors"
              v-model="currency_id"
              :elementSchema="currency_schema"
            />
          </div>

        </div>
      </div>

      <div class="item-stats template-stats" v-if="item_template.type === 'equippable' || item_template.type === 'augment'">
        <div class="panel panel-shadow">
          <ItemTemplateStats />
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="half-panels">

      <div class="advanced">
        <h3>ADVANCED</h3>

        <div v-if="item_template.is_pickable" class="color-text-70">Item can be picked up.</div>
        <div v-else class="color-text-70">Item cannot be picked up.</div>

        <div class="mt-4 color-text-70" v-if="item_template.is_boat">Item allows to go on water.</div>

        <!-- <template v-if="store.state.builder.world.is_multiplayer">
          <div
            class="mt-4 color-text-70"
            v-if="item_template.is_persistent"
          >Items spawned by this template will persist over reboots even if left on the ground.</div>
          <div
            class="mt-4 color-text-70"
            v-else
          >Items spawned by this template will not persist over reboots if left on the ground.</div>
        </template> -->

        <!-- <div class='mt-4'><span class="color-text-70">Item currency:</span> {{ item_template.currency }}</div> -->

        <div class="mt-4" v-if="item_template.on_use_cmd">
          <div><span class="color-text-70">On Use command:</span> {{ item_template.on_use_cmd}}</div>
          <div class="mt-4" v-if="item_template.on_use_description"><span class="color-text-70">On Use Description:</span> {{ item_template.on_use_description }}</div>
        </div>
        <div v-else class="mt-4 color-text-70">No On Use command defined.</div>

        <button class="btn-thin edit-advanced" @click="editAdvanced">EDIT ADVANCED SETTINGS</button>
      </div>

      <ItemTemplateEquipment v-if="item_template.type === 'equippable'" />
      <ItemTemplateFood v-else-if="item_template.type === 'food'" />
      <ItemTemplateAugment v-else-if="item_template.type === 'augment'" />
      <div v-else></div>

      <ItemTemplateLoads />
      <ItemTemplateQuests />
      <ItemTemplateInventory v-if="item_template.type === 'container'" />
    </div>

    <div class="divider"></div>

    <div><ItemTemplateActionList/></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { BUILDER_FORMS } from "@/core/forms.ts";
import { FormElement } from "@/core/forms.ts";
import FormField from "@/components/forms/FormField.vue";
import ItemTemplateAugment from "@/components/builder/world/ItemTemplateAugment.vue";
import ItemTemplateStats from "@/components/builder/world/ItemTemplateStats.vue";
import ItemTemplateInventory from "@/components/builder/world/ItemTemplateInventory.vue";
import ItemTemplateEquipment from "@/components/builder/world/ItemTemplateEquipment.vue";
import ItemTemplateLoads from "@/components/builder/world/ItemTemplateLoads.vue";
import ItemTemplateQuests from "@/components/builder/world/ItemTemplateQuests.vue";
import ItemTemplateFood from "@/components/builder/world/ItemTemplateFood.vue";
import ItemTemplateActionList from "@/components/builder/world/ItemTemplateActionList.vue";
import { capfirst } from "@/core/utils.ts";
import axios from "axios";

const store = useStore();
const route = useRoute();

const formErrors = ref({});

const item_template = computed(() => store.state.builder.worlds.item_template);
const currency_name = computed(() => {
  const currency = store.state.builder.world.currencies.find(c => c.id == item_template.value.currency);
  return currency ? currency.name : "Unknown";
});
const currency_id = ref(0);

watch(item_template, (newItemTemplate) => {
  currency_id.value = newItemTemplate.currency;
});

watch(currency_id, async (newCurrencyId, oldCurrencyId) => {

  if (!oldCurrencyId) return;

  const resp = await axios.patch(
    `builder/worlds/${store.state.builder.world.id}/itemtemplates/${item_template.value.id}/`,
    {
      currency: newCurrencyId,
    }
  );
  store.commit("builder/worlds/item_template_set", resp.data);
});

const currency_schema: FormElement = {
  attr: "currency",
  label: "Currency",
  options: store.state.builder.world.currencies.map(c => ({
    value: c.id,
    label: c.name
  }))
};

onMounted(() => {
  store.dispatch("builder/worlds/item_template_fetch", route.params.item_template_id);
});

const editInfo = () => {
  const entity = item_template.value;
  const modal = {
    title: `Item Template ${entity.id}`,
    data: entity,
    schema: BUILDER_FORMS.ITEM_TEMPLATE_INFO,
    action: "builder/worlds/item_template_save"
  };
  store.commit("ui/modal/open_form", modal);
};

const editAdvanced = () => {
  const entity = item_template.value;
  const schema: any[] = [
    {
      attr: "is_pickable",
      label: "Can be picked up",
      widget: "checkbox"
    },
    {
      attr: "is_boat",
      label: "Allows to go on water",
      widget: "checkbox"
    },
  ];
  // if (store.state.builder.world.is_multiplayer) {
  //   schema.push({
  //     attr: "is_persistent",
  //     label: "Is Persistent",
  //     widget: "checkbox"
  //   });
  // }
  // schema.push({
  //   attr: "currency",
  //   label: "Currency",
  //   options: [
  //     {
  //       value: "gold",
  //       label: "Gold"
  //     },
  //     {
  //       value: "medal",
  //       label: "Medals"
  //     }
  //   ]
  // });
  schema.push(...[{
    attr: "on_use_cmd",
    label: "On Use Command",
    help: "Command to be executed when the item is used by a player."
  },
  {
    attr: "on_use_description",
    label: "On Use Description",
    help: "Help entry for the item's on use command, shown on the item lookup screens."
  },
  {
    attr: "on_use_equipped",
    label: "Only Usable Equipped",
    widget: "checkbox",
    help: "If checked, the item can only be used if it is equipped."
  }]);
  const modal = {
    title: `Item Template ${entity.id}`,
    data: entity,
    schema: schema,
    action: "builder/worlds/item_template_save"
  };
  store.commit("ui/modal/open_form", modal);
};

const deleteItem = async () => {
  const item_template_id = item_template.value.id;
  const c = confirm(`Are you sure you want to delete Item Template ${item_template_id}?`);
  if (!c) return;
  await store.dispatch("builder/worlds/item_template_delete");
  store.commit("ui/notification_set", `Deleted Item Template ${item_template_id}`);
};

const editLookDesc = () => {
  const modal = {
    class: "description-modal",
    data: item_template.value,
    schema: [BUILDER_FORMS.DESCRIPTION],
    action: "builder/worlds/item_template_save"
  };
  store.commit("ui/modal/open_form", modal);
};

const editRoomDesc = () => {
  const modal = {
    data: item_template.value,
    schema: [
      {
        attr: "ground_description",
        label: "Room Description"
      }
    ],
    action: "builder/worlds/item_template_save"
  };
  store.commit("ui/modal/open_form", modal);
};

const editKeywords = () => {
  const modal = {
    data: item_template.value,
    schema: [
      {
        attr: "keywords",
        label: "Keywords"
      }
    ],
    action: "builder/worlds/item_template_save"
  };
  store.commit("ui/modal/open_form", modal);
};
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
#item-template-details {
  .item-equipment-info {
    > div {
      margin-bottom: 10px;

      .field-desc {
        color: $color-text-hex-70;
      }
    }

  }

  .look-description {
    .description-line {
      min-height: 14px;
    }
  }

  .template-currency {
    max-width: 250px;
  }
}
</style>