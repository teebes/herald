<template>
  <div v-if="template" id="mob_template_details" class="template-detail">
    <div class="template-data">
      <div class="template-info-and-descs">
        <div class="template-info">
          <h2 class="entity-title">{{ template.name }}</h2>

          <div class="mob-summary mb-2 text-base">
            Level {{ template.level }} {{ template.type }}
            <template v-if="template.gender == 'non_binary'">non-binary</template>
            <template v-else>{{ template.gender }}</template>
            {{ template.archetype}}
            <span
              v-if="template.is_invisible"
              class="color-text-50 ml-2"
            >[ Invisible ]</span>
          </div>
          <div v-if="template.notes" class="mob-note">Notes: {{ template.notes }}</div>

          <div class="info-elements">
            <div class="mob-hit-message my-2">
              <div class="color-text-70">Hit Message</div>
              <div>{{ template.hit_msg_first }} / {{ template.hit_msg_third }}</div>
            </div>

            <div class="mob-aggression my-2">
              <div class="color-text-70">Aggression</div>
              <div>{{ template.aggression }}</div>
            </div>
          </div>

          <div class="info-actions">
            <button class="btn-small" @click="editInfo">EDIT INFO</button>
            <button class="btn-small delete-template" @click="deleteMob">DELETE MOB</button>
          </div>
        </div>

        <div class="descriptions">
          <div class="room-description">
            <h3>DESCRIPTION IN ROOM</h3>
            <div
              v-if="template.room_description"
              class="mob-room-description"
            >{{ template.room_description }}</div>
            <div v-else class="color-text-70">
              <div>How this mob is described when a room is looked at or moved into.</div>
              <div class="defaulting">
                None set. Defaulting to:
                <span
                  class="color-text"
                >{{ $capfirst(template.name) }} is here.</span>
              </div>
            </div>
            <button class="btn-thin" @click="editRoomDesc">EDIT</button>
          </div>

          <div class="look-description">
            <h3>LOOK DESCRIPTION</h3>
            <div v-if="template.description">
              <div v-for="(line, index) in template.description.split('\n')" :key="index">
                {{ line || "&nbsp;" }}
              </div>
            </div>
            <div v-else class="color-text-70">
              <div>
                A look description is what a character sees when they look
                at this mob.
              </div>
              <div class="defaulting">None set.</div>
            </div>
            <button class="btn-thin" @click="editLookDesc">EDIT</button>
          </div>

          <div class="mob-keywords">
            <h3>TARGETED BY KEYWORDS</h3>
            <div v-if="template.keywords" class="keywords">{{template.keywords}}</div>
            <div v-else class="color-text-70">
              <div>
                Target keywords are how the mob can be selected by commands such as
                look, give, enquire, kill, etc.
              </div>
              <div class="defaulting">
                None set. Defaulting to:
                <span class="color-text">{{ template.empty_keywords }}</span>
              </div>
            </div>
            <button class="btn-thin" @click="editKeywords">EDIT</button>
          </div>

          <div class="mob-gold">
            <h3>GOLD DROPS</h3>
            <div class="color-text-70">
              Gold received by players slaying this mob:
              <span
                class="color-text"
              >{{ template.gold }} gold</span>.
            </div>
            <button class="btn-thin" @click="editGold">EDIT</button>
          </div>
        </div>
      </div>

      <div class="mob-stats template-stats">
        <div class="panel panel-shadow">
          <MobTemplateStats />
          <MobTemplateFactions />
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="related-panels">
      <MobTemplateReactions class="reactions" />
      <MobTemplateInventory class="inventory" />
      <MobTemplateMerchant class="merchant" />
      <MobTemplateLoads class="loads" />
      <MobTemplateQuests class="quests" />
      <MobTemplateCrafting class="crafting" />
      <MobTemplateSkills class="skills" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import axios from "axios";
import {
  BUILDER_ACTIONS,
  BUILDER_MUTATIONS,
  UI_MUTATIONS,
  UI_MODALS
} from "@/constants";
import { BUILDER_FORMS, GET_MOB_TEMPLATE_INFO } from "@/core/forms";
import MobTemplateReactions from "./MobTemplateReactions.vue";
import MobTemplateStats from "./MobTemplateStats.vue";
import MobTemplateInventory from "./MobTemplateInventory.vue";
import MobTemplateFactions from "./MobTemplateFactions.vue";
import MobTemplateMerchant from "./MobTemplateMerchant.vue";
import MobTemplateLoads from "./MobTemplateLoads.vue";
import MobTemplateQuests from "./MobTemplateQuests.vue";
import MobTemplateCrafting from "./MobTemplateCrafting.vue";
import MobTemplateSkills from "./MobTemplateSkills.vue";
import WorldView from "@/components/builder/world/WorldView";

@Component({
  components: {
    MobTemplateReactions,
    MobTemplateStats,
    MobTemplateInventory,
    MobTemplateFactions,
    MobTemplateMerchant,
    MobTemplateLoads,
    MobTemplateQuests,
    MobTemplateCrafting,
    MobTemplateSkills,
  }
})
export default class MobTemplateDetails extends Mixins(WorldView) {
  reactions: Array<Object> = [];

  async fetch() {
    await this.$store.dispatch(
      "builder/worlds/mob_template_fetch",
      this.$route.params.mob_template_id
    );
  }

  get template() {
    return this.$store.state.builder.worlds.mob_template;
  }

  editInfo() {
    let schema = GET_MOB_TEMPLATE_INFO();
    const modal = {
      title: `Mob Template ${this.template.id}`,
      data: this.template,
      schema: schema,
      action: "builder/worlds/mob_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  async deleteMob() {
    const mob_template_id = this.template.id;

    // Crude confirm dialog
    const c = confirm(
      `Are you sure you want to delete Mob Template ${mob_template_id}?`
    );
    if (!c) return;

    await this.$store.dispatch("builder/worlds/mob_template_delete");
    this.$store.commit(
      UI_MUTATIONS.SET_NOTIFICATION,
      `Deleted Mob Template ${mob_template_id}`
    );
  }

  editLookDesc() {
    const modal = {
      class: "description-modal",
      data: this.template,
      schema: [BUILDER_FORMS.DESCRIPTION],
      action: "builder/worlds/mob_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  editRoomDesc() {
    const modal = {
      data: this.template,
      schema: [
        {
          attr: "room_description",
          label: "Room Description"
        }
      ],
      action: "builder/worlds/mob_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  editKeywords() {
    const modal = {
      data: this.template,
      schema: [
        {
          attr: "keywords",
          label: "Keywords"
        }
      ],
      action: "builder/worlds/mob_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  editGold() {
    const modal = {
      data: this.template,
      schema: [
        {
          attr: "gold",
          label: "Gold"
        }
      ],
      action: "builder/worlds/mob_template_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

#mob_template_details {
  .template-info {
    .info-elements {
      max-width: 320px;
      display: flex;
      flex-wrap: wrap;
      > div {
        flex-basis: 50%;
      }
    }
    .info-actions {
      margin-top: 10px;
    }
  }

  .related-panels {
    display: flex;

    max-width: 800px;
    margin: 0 auto;

    @media ($desktop-site) {
      flex-wrap: wrap;
      > div {
        flex-basis: 50%;
        flex-shrink: 0;
        flex-grow: 0;

        margin-bottom: 20px;

        //&:not(:first-child) {
        &:nth-child(even) {
          padding-left: 20px;
        }
        //&:not(:last-child) {
        &:nth-child(odd) {
          padding-right: 20px;
        }
      }
    }

    @media ($mobile-site) {
      flex-direction: column;
      > div {
        margin-bottom: 20px;
      }
    }
  }
}
</style>