import axios from 'axios';
import { GameContext } from '@/types/silis';

interface SilisState {
  context: GameContext | null;

  map: any;

  loading: boolean;
  error: string | null;
  cmd_sent: string | null;
  cmd_response: string | null;

  player: any;
  inventory: any[];
  room: any;

}

const state: SilisState = {
  context: null,

  map: null,

  player: null,
  inventory: [],
  room: null,


  loading: false,
  error: null,

  cmd_sent: null,
  cmd_response: null
};

const getters = {
  getContext: (state: SilisState) => state.context,
  getPlayer: (state: SilisState) => state.context?.actor,
  getRoom: (state: SilisState) => state.context?.room,
  getMap: (state: SilisState) => state.map,
  getMobs: (state: SilisState) => state.context?.room_mobs,

  getInventory: (state: SilisState) => state.inventory,
  isLoading: (state: SilisState) => state.loading,
  getError: (state: SilisState) => state.error
};

const actions = {
  async bootstrap({ commit, }, playerId: string) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      const response = await axios.get(`/silis/players/${playerId}/bootstrap/`);

      commit('SET_CONTEXT', response.data.context);
      commit('SET_MAP', response.data.map);
    } catch (error) {
      commit('SET_ERROR', 'Failed to bootstrap');
      console.error('Error bootstrapping:', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async cmd({ commit, state }, cmd: string) {
    const playerId = state.context?.actor.id;
    if (!playerId) {
      commit('SET_ERROR', 'Player not found');
      throw new Error('Player not found');
    }

    commit('SET_CMD_SENT', cmd);

    try {
      console.log('Sending command:', cmd);

      const response = await axios.post(`/silis/players/${playerId}/cmd/`, {
        cmd
      });

      if (response.status === 200 && response.data.status === 'success') {
        commit('SET_CONTEXT', response.data.context);
      }

      console.log('Response:', response.data);
      console.log('--------------------------------');

      commit('SET_CMD_RESPONSE', response.data.response);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', 'Failed to send command');
      console.error('Error sending command:', error);
      throw error;
    }
  },

};

const mutations = {
  SET_CONTEXT(state: SilisState, context: GameContext) {
    state.context = context;
  },
  SET_PLAYER(state: SilisState, player: any) {
    state.player = player;
  },
  SET_INVENTORY(state: SilisState, inventory: any[]) {
    state.inventory = inventory;
  },
  SET_ROOM(state: SilisState, room: any) {
    state.room = room;
  },
  SET_MAP(state: SilisState, map: any) {
    state.map = map;
  },
  SET_LOADING(state: SilisState, loading: boolean) {
    state.loading = loading;
  },
  SET_ERROR(state: SilisState, error: string | null) {
    state.error = error;
  },
  SET_CMD_SENT(state: SilisState, cmd: string | null) {
    state.cmd_sent = cmd;
    state.cmd_response = null;
  },
  SET_CMD_RESPONSE(state: SilisState, response: string | null) {
    state.cmd_response = response;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
