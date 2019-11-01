<template>
  <div id="item-template-details" v-if="item_template" class="template-detail">
    <div class="template-data">
      <div class="template-info-and-descs">
        <div class="template-info">
          <h2 class="entity-title">{{ item_template.name }}</h2>

          <div class="item-summary mb-2">
            Level {{ item_template.level }}
            <span
              v-if="item_template.quality != 'normal'"
              :class="item_template.quality"
            >{{ item_template.quality }}</span>
            {{ item_template.type }}
          </div>

          <div class="notes" v-if="item_template.notes">Notes: {{ item_template.notes }}</div>

          <div class="cost">
            <div class="color-text-70">Cost</div>
            <!-- <div>{{ item_template.cost }} ({{ item_template.cost_budget }})</div> -->
            <div>{{ item_template.cost }}</div>
          </div>

          <div>
            <button class="btn-thin edit-mob" @click="editInfo">EDIT INFO</button>
            <button class="btn-thin delete-mob" @click="deleteItem">DELETE ITEM</button>
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
                >{{ $capfirst(item_template.name) }} is here.</span>
              </div>
            </div>
            <button class="btn-thin" @click="editRoomDesc">EDIT</button>
          </div>

          <div class="look-description">
            <h3>LOOK DESCRIPTION</h3>
            <div v-if="item_template.description">{{ item_template.description }}</div>
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
        </div>
      </div>

      <div class="item-stats template-stats" v-if="item_template.type === 'equippable'">
        <div class="panel panel-shadow">
          <ItemTemplateStats />
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="half-panels">
      <div class="equipment" v-if="item_template.type === 'equippable'">
        <h3>EQUIPMENT</h3>

        <div class="item-equipment-info">
          <div>
            <div class="field-desc">Equipment Slot</div>
            <div>{{ item_template.equipment_type }}</div>
          </div>

          <div
            v-if="item_template.equipment_type !== 'weapon_1h' && item_template.equipment_type !== 'weapon_2h'"
          >
            <div class="field-desc">Armor class</div>
            <div>{{ item_template.armor_class }}</div>
          </div>

          <template
            v-if="item_template.equipment_type === 'weapon_1h' || item_template.equipment_type === 'weapon_2h'"
          >
            <div>
              <div class="field-desc">First person hit</div>
              <div>You {{ item_template.hit_msg_first }} your target</div>
            </div>

            <div>
              <div class="field-desc">Third person hit</div>
              <div>Someone {{ item_template.hit_msg_third }} their target</div>
            </div>
          </template>
        </div>

        <button class="btn-thin edit-mob" @click="editEquipment">EDIT EQUIPMENT</button>
      </div>

      <ItemTemplateInventory />

      <div class="advanced">
        <h3>ADVANCED</h3>

        <div v-if="item_template.is_pickable">Item can be picked up.</div>
        <div v-else>Item cannot be picked up.</div>

        <div class="mt-4" v-if="item_template.is_boat">Item allows to go on water.</div>

        <template v-if="$store.state.builder.world.is_multiplayer">
          <div
            class="mt-4"
            v-if="item_template.is_persistent"
          >Items spawned by this template will persist over reboots even if left on the ground.</div>
          <div
            class="mt-4"
            v-else
          >Items spawned by this template will not persist over reboots if left on the ground.</div>
        </template>

        <button class="btn-thin edit-advanced" @click="editAdvanced">EDIT ADVANCED SETTINGS</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import WorldView from "@/components/builder/world/WorldView.ts";
import { BUILDER_FORMS } from "@/core/forms.ts";
import ItemTemplateStats from "./ItemTemplateStats.vue";
import ItemTemplateInventory from "./ItemTemplateInventory.vue";
import {
  BUILDER_ACTIONS,
  BUILDER_MUTATIONS,
  UI_MUTATIONS,
  UI_MODALS
} from "@/constants";

@Component({
  components: {
    ItemTemplateStats,
    ItemTemplateInventory
  }
})
export default class ItemTemplateDetails extends Mixins(WorldView) {
  get item_template() {
    return this.$store.state.builder.worlds.item_template;
  }

  async fetch() {
    await this.$store.dispatch(
      "builder/worlds/item_template_fetch",
      this.$route.params.item_template_id
    );
  }

  editInfo() {
    const entity = this.item_template;
    const modal = {
      title: `Item Template ${entity.id}`,
      data: entity,
      schema: BUILDER_FORMS.ITEM_TEMPLATE_INFO,
      action: "builder/worlds/item_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  editEquipment() {
    const entity = this.item_template;
    const modal = {
      title: `Item Template ${entity.id}`,
      data: entity,
      schema: BUILDER_FORMS.ITEM_TEMPLATE_EQUIPMENT,
      action: "builder/worlds/item_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  editAdvanced() {
    const entity = this.item_template;
    const schema: {}[] = [
      {
        attr: "is_pickable",
        label: "Can be picked up",
        widget: "checkbox"
      },
      {
        attr: "is_boat",
        label: "Allows to go on water",
        widget: "checkbox"
      }
    ];
    if (this.$store.state.builder.world.is_multiplayer) {
      schema.push({
        attr: "is_persistent",
        label: "Is Persistent",
        widget: "checkbox"
      });
    }
    const modal = {
      title: `Item Template ${entity.id}`,
      data: entity,
      schema: schema,
      action: "builder/worlds/item_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  async deleteItem() {
    const item_template_id = this.item_template.id;

    // Crude confirm dialog
    const c = confirm(
      `Are you sure you want to delete Item Template ${item_template_id}?`
    );
    if (!c) return;

    await this.$store.dispatch("builder/worlds/item_template_delete");
    this.$store.commit(
      UI_MUTATIONS.SET_NOTIFICATION,
      `Deleted Mob Template ${item_template_id}`
    );
  }

  editLookDesc() {
    const modal = {
      class: "description-modal",
      data: this.item_template,
      schema: [BUILDER_FORMS.DESCRIPTION],
      action: "builder/worlds/item_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  editRoomDesc() {
    const modal = {
      data: this.item_template,
      schema: [
        {
          attr: "ground_description",
          label: "Room Description"
        }
      ],
      action: "builder/worlds/item_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  editKeywords() {
    const modal = {
      data: this.item_template,
      schema: [
        {
          attr: "keywords",
          label: "Keywords"
        }
      ],
      action: "builder/worlds/item_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
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
}
</style>