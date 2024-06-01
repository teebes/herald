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

<script lang='ts' setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import QuestObjective from "@/components/builder/zone/QuestObjective.vue";
import QuestReward from "@/components/builder/zone/QuestReward.vue";
import QuestEnquiring from "@/components/builder/zone/QuestEnquiring.vue";
import QuestCompletion from "@/components/builder/zone/QuestCompletion.vue";
import QuestEntrance from "@/components/builder/zone/QuestEntrance.vue";
import QuestSource from "@/components/builder/zone/QuestSource.vue";

const store = useStore();
const route = useRoute();

const add_objective = ref(false);
const add_reward = ref(false);
const loaded = ref(false);

const quest: any = computed(() => store.state.builder.zones.quest);

// Shouldn't be needed? When would that ever happen?
// watch(() => quest.value.zone, (zone) => {
//   if (zone) selectZone(zone.id);
// });

onMounted(async () => {
  const quest_id = route.params.quest_id;
  await store.dispatch("builder/zones/quest_fetch", quest_id);
  loaded.value = true;
});
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