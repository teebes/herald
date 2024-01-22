import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import builder from "./modules/builder";
import ui from "./modules/ui";
import game from "./modules/game";
import lobby from "./modules/lobby/index";
import staff from "./modules/staff/index";
import forge from "./modules/forge";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

const getters = {
  isAuthenticated: state => !!state.auth.token
};

export default new Vuex.Store({
  getters,
  modules: {
    auth,
    builder,
    ui,
    game,
    lobby,
    staff,
    forge
  },
  strict: debug
});
