<template>
  <div v-if="template" id="mob_template_details" class="template-detail">
    <div class="template-data">
      <div class="template-info-and-descs">
        <div class="template-info">
          <h2 class="entity-title">{{ template.name }}</h2>

          <div v-if="store.state.builder.world.builder_info.builder_rank < 3 && template.has_assignment !== undefined" class="color-text-50 mb-4">
            <span v-if="template.has_assignment">This mob template is assigned to you, you can edit it.</span>
            <span v-else>This mob template is not assigned to you, you can view it but not edit it.</span>
          </div>

          <div class="mob-summary text-base">
            Level {{ template.level }} {{ template.type }}
            <template v-if="template.gender == 'non_binary'">non-binary</template>
            <template v-else>{{ template.gender }}</template>
            {{ template.archetype}}
            <span
              v-if="template.is_invisible"
              class="color-text-50 ml-2"
            >[ Invisible ]</span>
          </div>

          <div class="mb-2">ID: {{ template.id }}</div>

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
                >{{ capfirst(template.name) }} is here.</span>
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
      <MobTemplateUpgrades class="upgrades" />
      <MobTemplateCrafting class="crafting" />
      <MobTemplateSkills class="skills" />
      <MobTemplateTraits class="traits" />
      <MobTemplateQuests class="quests" />
      <MobTemplateAdvanced class="advanced" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { BUILDER_FORMS, GET_MOB_TEMPLATE_INFO } from "@/core/forms";
import { capfirst } from "@/core/utils";
import MobTemplateReactions from "@/components/builder/world/MobTemplateReactions.vue";
import MobTemplateStats from "@/components/builder/world/MobTemplateStats.vue";
import MobTemplateInventory from "@/components/builder/world/MobTemplateInventory.vue";
import MobTemplateFactions from "@/components/builder/world/MobTemplateFactions.vue";
import MobTemplateMerchant from "@/components/builder/world/MobTemplateMerchant.vue";
import MobTemplateLoads from "@/components/builder/world/MobTemplateLoads.vue";
import MobTemplateQuests from "@/components/builder/world/MobTemplateQuests.vue";
import MobTemplateCrafting from "@/components/builder/world/MobTemplateCrafting.vue";
import MobTemplateSkills from "@/components/builder/world/MobTemplateSkills.vue";
import MobTemplateTraits from "@/components/builder/world/MobTemplateTraits.vue";
import MobTemplateUpgrades from "@/components/builder/world/MobTemplateUpgrades.vue";
import MobTemplateAdvanced from "@/components/builder/world/MobTemplateAdvanced.vue";

const store = useStore();
const route = useRoute();

const template = computed(() => store.state.builder.worlds.mob_template);

onMounted(() => {
  store.dispatch("builder/worlds/mob_template_fetch", route.params.mob_template_id);
});


const editInfo = () => {
  let schema = GET_MOB_TEMPLATE_INFO();
  const modal = {
    title: `Mob Template ${template.value.id}`,
    data: template.value,
    schema: schema,
    action: "builder/worlds/mob_template_save"
  };
  store.commit('ui/modal/open_form', modal);
};
const deleteMob = async () => {
  const mob_template_id = template.value.id;
  const c = confirm(`Are you sure you want to delete Mob Template ${mob_template_id}?`);
  if (!c) return;
  await store.dispatch("builder/worlds/mob_template_delete");
  store.commit('ui/notification_set', `Deleted Mob Template ${mob_template_id}`);
};

const editLookDesc = () => {
  const modal = {
    class: "description-modal",
    data: template.value,
    schema: [BUILDER_FORMS.DESCRIPTION],
    action: "builder/worlds/mob_template_save"
  };
  store.commit('ui/modal/open_form', modal);
};

const editRoomDesc = () => {
  const modal = {
    data: template.value,
    schema: [
      {
        attr: "room_description",
        label: "Room Description"
      }
    ],
    action: "builder/worlds/mob_template_save"
  };
  store.commit('ui/modal/open_form', modal);
};

const editKeywords = () => {
  const modal = {
    data: template.value,
    schema: [
      {
        attr: "keywords",
        label: "Keywords"
      }
    ],
    action: "builder/worlds/mob_template_save"
  };
  store.commit('ui/modal/open_form', modal);
};

const editGold = () => {
  const modal = {
    data: template.value,
    schema: [
      {
        attr: "gold",
        label: "Gold"
      }
    ],
    action: "builder/worlds/mob_template_save"
  };
  store.commit('ui/modal/open_form', modal);
};
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