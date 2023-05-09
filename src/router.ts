import Vue from "vue";
import Router, { Route } from "vue-router";

// Views
import About from "./views/About.vue";
import Home from "./views/Home.vue";
import Lobby from "./views/Lobby.vue";
import Login from "./views/Login.vue";
import SignUp from "./views/SignUp.vue";
import ForgotPassword from "./views/ForgotPassword.vue";
import ResetPassword from "./views/ResetPassword.vue";
import ConfirmEmail from "./views/ConfirmEmail.vue";
import Styleguide from "./views/Styleguide.vue";
import Staff from "./views/Staff.vue";
import Test from "./views/Test.vue";
import Terms from "./views/Terms.vue";
import Privacy from "./views/Privacy.vue";

// Lobby
import WorldLobby from "@/components/lobby/WorldLobby.vue";
import CompleteSignup from "@/components/lobby/CompleteSignup.vue";
import Transfer from "@/components/lobby/Transfer.vue";
import LobbySection from "@/components/lobby/LobbySection.vue";

// Builder
import BuilderFrame from "@/components/builder/BuilderFrame.vue";
import ZoneDetails from "@/components/builder/zone/ZoneDetails.vue";
import RoomDetails from "@/components/builder/room/RoomDetails.vue";
import RoomPaths from "@/components/builder/room/RoomPaths.vue";
import RoomConfig from "@/components/builder/room/RoomConfig.vue";
import WorldIndex from "@/components/builder/world/WorldIndex.vue";
import ZoneList from "@/components/builder/world/ZoneList.vue";
import RoomList from "@/components/builder/zone/ZoneRoomList.vue";
import ZonePathList from "@/components/builder/zone/ZonePathList.vue";
import ZonePathDetails from "@/components/builder/zone/ZonePathDetails.vue";
import ZoneLoaderList from "@/components/builder/zone/LoaderList.vue";
import ZoneLoaderDetails from "@/components/builder/zone/LoaderDetails.vue";
import ZoneQuestList from "@/components/builder/zone/QuestList.vue";
import ZoneQuestDetail from "@/components/builder/zone/QuestDetail.vue";

// Room
import RoomLoads from "@/components/builder/room/RoomLoads.vue";
import RoomFlags from "@/components/builder/room/RoomFlags.vue";
import RoomDetailList from "@/components/builder/room/RoomDetailList.vue";

// World
import WorldCreate from "@/components/builder/world/Create.vue";
import WorldConfig from "@/components/builder/world/Config.vue";
import RandomItemProfiles from "@/components/builder/world/RandomItemProfileList.vue";
import TransformationTemplateList from "@/components/builder/world/TransformationTemplateList.vue";
import BuilderList from "@/components/builder/world/BuilderList.vue";
import BuilderWorldPlayerList from "@/components/builder/world/PlayerList.vue";
import BuilderWorldPlayerDetail from "@/components/builder/world/PlayerDetail.vue";
import ItemTemplateList from "@/components/builder/world/ItemTemplateList.vue";
import ItemTemplateDetails from "@/components/builder/world/ItemTemplateDetails.vue";
import MobTemplateList from "@/components/builder/world/MobTemplateList.vue";
import MobTemplateDetails from "@/components/builder/world/MobTemplateDetails.vue";
import WorldStatus from "@/components/builder/world/Status.vue";

// Game
import Game from "@/components/game/Game.vue";

// Help
import Help from "@/components/help/Help.vue";
import HelpClasses from "@/components/help/HelpClasses.vue";
import HelpFormulas from "@/components/help/HelpFormulas.vue";

import store from "./store";

Vue.use(Router);

const ifAuthenticated = (to: Route, from: Route, next: any) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  } else {
    next("/login");
  }
};

const ifAdmin = (to: Route, from: Route, next: any) => {
  next();
};

const ifStaff = (to: Route, from: Route, next: any) => {
  if (store.state.auth.user && store.state.auth.user.is_staff) {
    next();
    return;
  } else {
    store.commit("ui/notification_set_error", "Access denied.");
    next("/lobby");
  }
};

// Named routes
export const BUILDER_WORLD_CREATE = "builder_world_create";
export const BUILDER_WORLD_FRAME = "builder_world_frame";
export const BUILDER_WORLD_INDEX = "builder_world_index";
export const BUILDER_WORLD_CONFIG = "builder_world_config";
export const BUILDER_WORLD_RANDOM_PROFILES = "builder_world_random_profiles";
export const BUILDER_WORLD_TRANSFORMATION_TEMPLATE_LIST =
  "builder_world_transformation_templates_list";
export const BUILDER_WORLD_BUILDERS = "builder_world_builders";
export const BUILDER_WORLD_PLAYER_LIST = "builder_world_player_list";
export const BUILDER_WORLD_PLAYER_DETAIL = "builder_world_player_detail";
export const BUILDER_WORLD_STATUS = "builder_world_status";
export const BUILDER_WORLD_FACTIONS = "builder_world_factions";
export const BUILDER_WORLD_FACTION_RANK_LIST = "builder_world_faction_ranks";
export const BUILDER_WORLD_FACTS = "builder_world_facts";
export const BUILDER_WORLD_SKILLS = "builder_world_skills";
export const BUILDER_WORLD_STARTING_EQ = "builder_world_starting_eq";
export const BUILDER_ROOM_INDEX = "builder_room_index";
export const BUILDER_ROOM_CHECKS = "builder_room_checks";
export const BUILDER_ROOM_ACTIONS = "builder_room_actions";
export const BUILDER_ROOM_LOADS = "builder_room_loads";
export const BUILDER_ROOM_PATHS = "builder_room_paths";
export const BUILDER_ROOM_CONFIG = "builder_room_config";
export const BUILDER_ROOM_FLAGS = "builder_room_flags";
export const BUILDER_ROOM_DETAIL_LIST = "builder_room_detail_list";
export const BUILDER_ZONE_LIST = "builder_zone_list";
export const BUILDER_ZONE_INDEX = "builder_zone_index";
export const BUILDER_ZONE_ROOM_LIST = "builder_zone_room_list";
export const BUILDER_ZONE_PATH_LIST = "builder_zone_path_list";
export const BUILDER_ZONE_PATH_DETAILS = "builder_zone_path_details";
export const BUILDER_ZONE_LOADER_LIST = "builder_zone_loader_list";
export const BUILDER_ZONE_LOADER_DETAILS = "builder_zone_loader_details";
export const BUILDER_ZONE_QUEST_LIST = "builder_zone_quest_list";
export const BUILDER_ZONE_QUEST_DETAIL = "builder_zone_quest_detail";
export const BUILDER_ZONE_CONFIG = "builder_zone_config";
export const BUILDER_ZONE_PROCESSION_LIST = "builder_zone_procession_list";
export const BUILDER_ZONE_PROCESSION_DETAIL = "builder_zone_procession_detail";
export const BUILDER_MOB_TEMPLATE_LIST = "builder_mob_template_list";
export const BUILDER_MOB_TEMPLATE_DETAILS = "builder_mob_template_details";
export const BUILDER_ITEM_TEMPLATE_LIST = "builder_item_template_list";
export const BUILDER_ITEM_TEMPLATE_DETAILS = "builder_item_template_details";
export const BUILDER_TRANSFORMATION_LIST = "builder_transformation_list";
export const BUILDER_TRANSFORMATION_DETAIL = "builder_transformation_details";

export const LOBBY_WORLD_DETAIL = "lobby_world_detail";
export const LOBBY_WORLD_COMPLETE_SIGNUP = "lobby_world_complete_signup";
export const LOBBY_WORLD_TRANSFER = "lobby_world_transfer";
export const LOBBY = "lobby";

export const STAFF_HOME = "staff_home";
export const STAFF_PLAYING = "staff_playing";
export const STAFF_SIGNUPS = "staff_signups";
export const STAFF_WORLDS = "staff_worlds";
export const STAFF_ACTIVITY = "staff_activity";
export const STAFF_USER_INFO = "staff_user_info";

export const ABOUT = "about";
export const TERMS = "terms";
export const PRIVACY = "privacy";
export const LOGIN = "login";
export const SIGNUP = "signup";
export const FORGOTPASSWORD = "forgotpassword";
export const RESETPASSWORD = "resetpassword";
export const CONFIRMEMAIL = "confirmemail";

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },

    {
      // Identical to the home route, but with a different name & path so that
      // users can visit that page without being redirected to the lobby if
      // they are logged in.
      path: "/home",
      name: "homedirect",
      component: Home,
    },

    {
      path: "/test",
      name: "test",
      component: Test,
    },

    {
      path: "/game",
      name: "game",
      component: Game,
      beforeEnter: ifAuthenticated,
    },

    {
      path: "/lobby",
      name: LOBBY,
      component: Lobby,
      beforeEnter: ifAuthenticated,
    },

    {
      path: "/lobby/:section",
      name: "lobby_section",
      component: LobbySection,
    },

    {
      path: "/login",
      name: "login",
      component: Login,
    },

    {
      path: "/signup",
      name: "signup",
      component: SignUp,
    },

    {
      path: "/forgot-password",
      name: FORGOTPASSWORD,
      component: ForgotPassword,
    },

    {
      path: "/reset-password/:code",
      name: RESETPASSWORD,
      component: ResetPassword,
    },

    {
      path: "/emailconfirm/:code",
      name: CONFIRMEMAIL,
      component: ConfirmEmail,
    },

    {
      path: "/staff",
      beforeEnter: ifStaff,
      component: () => import("@/components/staff/Frame.vue"),
      // redirect: "/staff/playing",
      children: [
        {
          path: "",
          name: "staff_index",
          component: () => import("@/components/staff/Index.vue"),
        },
        {
          path: "playing",
          name: STAFF_PLAYING,
          component: () => import("@/components/staff/Playing.vue"),
        },
        {
          path: "signups",
          name: STAFF_SIGNUPS,
          component: () => import("@/components/staff/SignUps.vue"),
        },
        {
          path: "worlds",
          name: STAFF_WORLDS,
          component: () => import("@/components/staff/Worlds.vue"),
        },
        {
          path: "activity",
          name: STAFF_ACTIVITY,
          component: () => import("@/components/staff/Activity.vue"),
        },
        {
          path: "users/:user_id",
          name: STAFF_USER_INFO,
          component: () => import("@/components/staff/UserInfo.vue"),
        },
        {
          path: "reviews",
          name: 'staff_reviews',
          component: () => import("@/components/staff/Reviews.vue"),
        },
      ],
    },

    {
      path: "/worlds/1/uniques",
      component: () => import("@/components/lobby/EdeusUniques.vue"),
      name: "edeus_unique_bearers",
    },

    {
      path: "/worlds/:world_id/:slug?",
      component: WorldLobby,
      name: LOBBY_WORLD_DETAIL,
    },

    {
      path: "/worlds/:world_id/complete/:player_id",
      component: CompleteSignup,
      name: LOBBY_WORLD_COMPLETE_SIGNUP,
      beforeEnter: ifAuthenticated,
    },

    {
      path: "/worlds/transfer/:player_id",
      component: Transfer,
      name: LOBBY_WORLD_TRANSFER,
      beforeEnter: ifAuthenticated,
    },

    {
      path: "/create/",
      component: WorldCreate,
      name: BUILDER_WORLD_CREATE,
    },

    {
      path: "/help",
      component: Help,
      name: "help",
      redirect: "/help/formulas",
      children: [
        {
          path: "formulas",
          component: HelpFormulas,
          name: "help_formulas",
        },
        {
          path: "classes",
          component: HelpClasses,
          name: "help_classes",
        },
      ],
    },

    {
      path: "/build/worlds/:world_id",
      component: BuilderFrame,
      beforeEnter: ifAdmin,
      children: [
        {
          path: "",
          name: BUILDER_WORLD_INDEX,
          component: WorldIndex,
        },
        {
          path: "config",
          component: WorldConfig,
          name: BUILDER_WORLD_CONFIG,
        },
        {
          path: "randomprofiles",
          component: RandomItemProfiles,
          name: BUILDER_WORLD_RANDOM_PROFILES,
        },

        {
          path: "facts",
          component: () => import("@/components/builder/world/Facts.vue"),
          name: BUILDER_WORLD_FACTS,
        },

        {
          path: "skills",
          component: () => import("@/components/builder/world/SkillList.vue"),
          name: BUILDER_WORLD_SKILLS,
        },

        {
          path: "startingeq",
          component: () => import("@/components/builder/world/StartingEq.vue"),
          name: BUILDER_WORLD_STARTING_EQ,
        },

        {
          path: "mobs",
          component: MobTemplateList,
          name: BUILDER_MOB_TEMPLATE_LIST,
        },
        {
          path: "mobs/:mob_template_id",
          component: MobTemplateDetails,
          name: BUILDER_MOB_TEMPLATE_DETAILS,
        },
        {
          path: "items",
          component: ItemTemplateList,
          name: BUILDER_ITEM_TEMPLATE_LIST,
        },
        {
          path: "items/:item_template_id",
          component: ItemTemplateDetails,
          name: BUILDER_ITEM_TEMPLATE_DETAILS,
        },

        {
          path: "transformations/",
          component: TransformationTemplateList,
          name: BUILDER_WORLD_TRANSFORMATION_TEMPLATE_LIST,
        },
        {
          path: "builders/",
          component: BuilderList,
          name: BUILDER_WORLD_BUILDERS,
        },

        {
          path: "players/",
          name: BUILDER_WORLD_PLAYER_LIST,
          component: BuilderWorldPlayerList,
        },

        {
          path: "players/:player_id",
          name: BUILDER_WORLD_PLAYER_DETAIL,
          component: BuilderWorldPlayerDetail,
        },

        {
          path: "factions/",
          name: BUILDER_WORLD_FACTIONS,
          component: () => import("@/components/builder/world/FactionList.vue"),
        },

        {
          path: "factions/:faction_id/ranks/",
          name: BUILDER_WORLD_FACTION_RANK_LIST,
          component: () =>
            import("@/components/builder/world/FactionRankList.vue"),
        },

        { path: "status", name: BUILDER_WORLD_STATUS, component: WorldStatus },

        {
          path: "rooms/:room_id",
          component: RoomDetails,
          name: BUILDER_ROOM_INDEX,
        },
        {
          path: "rooms/:room_id/checks",
          name: BUILDER_ROOM_CHECKS,
          component: () =>
            import("@/components/builder/room/RoomCheckList.vue"),
        },
        {
          path: "rooms/:room_id/actions",
          name: BUILDER_ROOM_ACTIONS,
          component: () =>
            import("@/components/builder/room/RoomActionList.vue"),
        },
        {
          path: "rooms/:room_id/loads",
          name: BUILDER_ROOM_LOADS,
          component: RoomLoads,
        },
        {
          path: "rooms/:room_id/paths",
          name: BUILDER_ROOM_PATHS,
          component: RoomPaths,
        },
        {
          path: "rooms/:room_id/config",
          name: BUILDER_ROOM_CONFIG,
          component: RoomConfig,
        },
        {
          path: "rooms/:room_id/flags",
          name: BUILDER_ROOM_FLAGS,
          component: RoomFlags,
        },
        {
          path: "rooms/:room_id/details",
          name: BUILDER_ROOM_DETAIL_LIST,
          component: RoomDetailList,
        },

        {
          path: "zones/:zone_id",
          component: ZoneDetails,
          name: BUILDER_ZONE_INDEX,
        },
        {
          path: "zones",
          component: ZoneList,
          name: BUILDER_ZONE_LIST,
        },

        {
          path: "zones/:zone_id/rooms",
          component: RoomList,
          name: BUILDER_ZONE_ROOM_LIST,
        },

        {
          path: "zones/:zone_id/paths",
          component: ZonePathList,
          name: BUILDER_ZONE_PATH_LIST,
        },

        {
          path: "zones/:zone_id/paths/:path_id",
          component: ZonePathDetails,
          name: BUILDER_ZONE_PATH_DETAILS,
        },

        {
          path: "zones/:zone_id/loaders",
          component: ZoneLoaderList,
          name: BUILDER_ZONE_LOADER_LIST,
        },

        {
          path: "zones/:zone_id/loaders/:loader_id",
          component: ZoneLoaderDetails,
          name: BUILDER_ZONE_LOADER_DETAILS,
        },

        {
          path: "zones/:zone_id/quests",
          component: ZoneQuestList,
          name: BUILDER_ZONE_QUEST_LIST,
        },

        {
          path: "zones/:zone_id/quests/:quest_id",
          component: ZoneQuestDetail,
          name: BUILDER_ZONE_QUEST_DETAIL,
        },

        {
          path: "zones/:zone_id/config",
          component: () => import("@/components/builder/zone/ZoneConfig.vue"),
          name: BUILDER_ZONE_CONFIG,
        },

        {
          path: "zones/:zone_id/processions",
          component: () =>
            import("@/components/builder/zone/ZoneProcessionList.vue"),
          name: BUILDER_ZONE_PROCESSION_LIST,
        },

        {
          path: "zones/:zone_id/processions/:procession_id",
          component: () =>
            import("@/components/builder/zone/ZoneProcessionDetail.vue"),
          name: BUILDER_ZONE_PROCESSION_DETAIL,
        },
      ],
    },

    {
      path: "/styleguide",
      name: "styleguide",
      component: Styleguide,
    },

    {
      path: "/about",
      name: ABOUT,
      component: About,
    },

    {
      path: "/terms",
      name: TERMS,
      component: Terms,
    },

    {
      path: "/privacy",
      name: PRIVACY,
      component: Privacy,
    },
    {
      path: "/404",
      name: "404",
      component: () => import("@/views/NotFound.vue"),
    },
    { path: "*", redirect: "/404" },
  ],
});

router.afterEach(async () => {
  const parseJwt = function(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  const getUnixTS = function() {
    return Math.round(new Date().getTime() / 1000);
  };

  if (localStorage.jwtToken) {
    const exp = parseJwt(localStorage.jwtToken)["exp"],
      ts = getUnixTS(),
      delta = exp - ts;

    // If the token is more than an hour old, refresh it.
    // This assumes a 24 hour expiration renewal.
    if (delta > 0 && delta < 60 * 60 * 23) {
      // Renew the token
      try {
        await store.dispatch("auth/renew", localStorage.jwtToken);
      } catch (error) {
        store.commit("auth/auth_clear");
        router.push({ name: "login" });
      }
    }
  }
});

export default router;
