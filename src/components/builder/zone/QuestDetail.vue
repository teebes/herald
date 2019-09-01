<template>
  <div v-if="quest && loaded" id="quest-details">
    <h2 class="entity-title">{{ quest.name }}</h2>

    <QuestSource class="source-and-requirements" />

    <div class="objectives-and-rewards">
      <div class="horizontal-list">
        <div class="horizontal-list-header">
          <h3>OBJECTIVES</h3>
          <div>
            <button class="btn-small" @click="add_objective = true">ADD</button>
          </div>
        </div>
        <div>
          <QuestObjective
            v-if="add_objective"
            :new_objective="true"
            @added="add_objective = false"
            @cancel="add_objective = false"
            class="horizontal-list-item"
          />

          <QuestObjective
            v-for="objective in quest.objectives"
            :key="objective.id"
            :objective="objective"
            class="horizontal-list-item"
          />
        </div>
      </div>

      <div class="horizontal-list">
        <div class="horizontal-list-header">
          <h3>REWARDS</h3>
          <div>
            <button class="btn-small" @click="add_reward = true">ADD</button>
          </div>
        </div>
        <div>
          <QuestReward
            v-if="add_reward"
            :new_reward="true"
            @added="add_reward = false"
            @cancel="add_reward = false"
            class="horizontal-list-item"
          />

          <QuestReward
            v-for="reward in quest.rewards"
            :key="reward.id"
            :reward="reward"
            class="horizontal-list-item"
          />
        </div>
      </div>
    </div>

    <div class="enquiring-and-completion">
      <QuestEnquiring />
      <QuestCompletion />
    </div>

    <QuestEntrance />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import ZoneView from "@/components/builder/ZoneView";
import {
  BUILDER_ACTIONS,
  BUILDER_MUTATIONS,
  UI_MODALS,
  UI_MUTATIONS
} from "@/constants";
import { FormElement, BUILDER_FORMS } from "@/core/forms";
import QuestObjective from "./QuestObjective.vue";
import QuestReward from "./QuestReward.vue";
import QuestEnquiring from "./QuestEnquiring.vue";
import QuestCompletion from "./QuestCompletion.vue";
import QuestEntrance from "./QuestEntrance.vue";
import QuestSource from "./QuestSource.vue";

@Component({
  components: {
    QuestObjective,
    QuestReward,
    QuestEnquiring,
    QuestCompletion,
    QuestEntrance,
    QuestSource
  }
})
export default class extends Mixins(ZoneView) {
  add_objective: boolean = false;
  add_reward: boolean = false;
  loaded: boolean = false;

  @Watch("quest.zone")
  onZoneChange(zone) {
    if (zone) this.selectZone(zone.id);
  }

  get quest() {
    return this.$store.state.builder.zones.quest;
  }

  async fetch() {
    const quest_id = this.$route.params.quest_id;
    const quest = await this.$store.dispatch(
      "builder/zones/quest_fetch",
      quest_id
    );
    this.loaded = true;
  }

  // Basic info
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";

#quest-details {
  //max-width: 600px;

  h3 {
    margin: 15px 0 5px 0;
  }

  .horizontal-list-header {
    margin-top: 15px;
    > h3 {
      margin: 0;
    }
  }

  .help-text {
    color: $color-text-hex-50;
  }

  .quest-source {
    width: 50%;
  }

  .objectives-and-rewards,
  .enquiring-and-completion,
  .entrance-messages,
  .source-and-requirements {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;

    @media ($desktop-site) {
      flex-direction: row;

      > div {
        flex: 1;

        &:not(:last-child) {
          margin-right: 10px;
        }
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>