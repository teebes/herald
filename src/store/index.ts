import { createStore } from 'vuex';
import auth from './modules/auth';
import forge from './modules/forge';
import game from './modules/game';
import lobby from './modules/lobby';
import ui from './modules/ui/index';
import builder from './modules/builder/index';
import staff from './modules/staff/index';
import silis from './modules/silis';

const store = createStore({
  modules: {
    auth,
    forge,
    game,
    lobby,
    ui,
    builder,
    staff,
    silis,
  },
  getters: {
    count: (state) => state.count,
    isAuthenticated: (rootState) => !!rootState.auth.accessToken
  }
});

export default store;
