import axios from "axios";
import { generate_crud_actions } from "@/store/crud.ts";
import router from "@/router";

const quest_crud_actions = generate_crud_actions("quest", {
  create_callback: (quest, { rootState }) => {
    router.push({
      name: 'builder_zone_quest_details',
      params: {
        world_id: rootState.builder.world.id,
        quest_id: quest.id
      }
    });
  },

  delete_callback: ({ rootState }) => {
    router.push({
      name: 'builder_zone_quest_list',
      params: {
        world_id: rootState.builder.world.id
      }
    });
  }
});

const quest_objective_actions = {
  quest_objective_create: async ({ commit, state, rootState }, payload) => {
    const resp = await axios.post(
      `builder/worlds/${rootState.builder.world.id}/quests/${
        state.quest.id
      }/objectives/`,
      payload
    );
    commit("quest_objective_add", resp.data);
    return resp.data;
  },

  quest_objective_save: async (
    { commit, rootState },
    { objective_id, data }
  ) => {
    const resp = await axios.put(
      `builder/worlds/${
        rootState.builder.world.id
      }/objectives/${objective_id}/`,
      data
    );
    commit("quest_objective_update", resp.data);
    return resp.data;
  },
  quest_objective_delete: async ({ commit, rootState }, objective_id) => {
    await axios.delete(
      `builder/worlds/${rootState.builder.world.id}/objectives/${objective_id}/`
    );
    commit("quest_objective_delete", objective_id);
  }
};

const quest_reward_actions = {
  quest_reward_create: async ({ commit, state, rootState }, payload) => {
    const resp = await axios.post(
      `builder/worlds/${rootState.builder.world.id}/quests/${
        state.quest.id
      }/rewards/`,
      payload
    );
    commit("quest_reward_add", resp.data);
    return resp.data;
  },

  quest_reward_save: async (
    { commit, rootState },
    { reward_id, data }
  ) => {
    const resp = await axios.put(
      `builder/worlds/${rootState.builder.world.id}/rewards/${reward_id}/`,
      data
    );
    commit("quest_reward_update", resp.data);
    return resp.data;
  },
  quest_reward_delete: async ({ commit, rootState }, reward_id) => {
    await axios.delete(
      `builder/worlds/${rootState.builder.world.id}/rewards/${reward_id}/`
    );
    commit("quest_reward_delete", reward_id);
  }
};

export const quest_actions = {
  ...quest_crud_actions,

  ...quest_objective_actions,
  ...quest_reward_actions
};

export const quest_mutations = {
  quest_set: (state, quest) => {
    state.quest = quest;
  },

  quest_clear: state => {
    state.quest = null;
  },

  quest_objective_add: (state, objective) => {
    state.quest.objectives.push(objective);
  },

  quest_objective_update: (state, objective) => {
    const index = state.quest.objectives.findIndex(o => o.id == objective.id);
    if (index === -1) return;
    state.quest.objectives.splice(index, 1, objective);
  },

  quest_objective_delete: (state, objective_id) => {
    const index = state.quest.objectives.findIndex(o => o.id == objective_id);
    if (index === -1) return;
    state.quest.objectives.splice(index, 1);
  },

  quest_reward_add: (state, reward) => {
    state.quest.rewards.push(reward);
  },

  quest_reward_update: (state, reward) => {
    const index = state.quest.rewards.findIndex(o => o.id == reward.id);
    if (index === -1) return;
    state.quest.rewards.splice(index, 1, reward);
  },

  quest_reward_delete: (state, reward_id) => {
    const index = state.quest.rewards.findIndex(o => o.id == reward_id);
    if (index === -1) return;
    state.quest.rewards.splice(index, 1);
  }
};
