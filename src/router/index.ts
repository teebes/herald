import { createRouter, createWebHistory } from 'vue-router';
import store from "@/store";

const ifAuthenticated = () => {
  if (store.getters.isAuthenticated) {
    return true;
  } else {
    return "/login";
  }
};

const ifStaff = () => {
  if (store.state.auth.user && store.state.auth.user.is_staff) {
    return true;
  } else {
    store.commit("ui/notification_set_error", "Access denied.");
    return "/lobby";
  }
};

// Define route components.
// These can be imported from other files
const routes = [

  { path: '/test', name: 'test', component: () => import('@/views/tests/Index.vue') },

  // Home
  { path: '/', name: 'home', component: () => import('@/views/Home.vue') },
  { path: '/home', name: 'homedirect', component: () => import('@/views/Home.vue') },
  { path: '/about', name: 'about', component: () => import('@/views/About.vue') },
  { path: '/terms', name: 'terms', component: () => import('@/views/Terms.vue') },
  { path: '/privacy', name: 'privacy', component: () => import('@/views/Privacy.vue') },
  { path: '/conduct', name: 'conduct', component: () => import('@/views/Conduct.vue') },
  { path: '/styleguide', name: 'styleguide', component: () => import('@/views/StyleGuide.vue') },


  // Auth
  { path: '/login', name: 'login', component: () => import('@/views/auth/Login.vue') },
  { path: '/signup', name: 'signup', component: () => import('@/views/auth/SignUp.vue') },
  { path: '/forgot-password', name: 'forgot-password', component: () => import('@/views/auth/ForgotPassword.vue') },
  { path: '/reset-password/:code', name: 'resetpassword', component: () => import('@/views/auth/ResetPassword.vue') },
  { path: '/emailconfirm/:code', name: 'confirmemail', component: () => import('@/views/auth/ConfirmEmail.vue') },

  // Lobby
  { path: '/lobby', name: 'lobby', component: () => import('@/views/lobby/Lobby.vue'), beforeEnter: ifAuthenticated },
  { path: '/lobby/:section', name: 'lobby_section', component: () => import('@/views/lobby/LobbySection.vue'), beforeEnter: ifAuthenticated },
  { path: '/create', name: 'world-create', component: () => import('@/views/lobby/WorldCreate.vue'), beforeEnter: ifAuthenticated },

  // World Lobby
  { path: '/worlds/:world_id/:slug?', 'name': 'lobby_world_details', component: () => import('@/views/lobby/WorldLobby.vue') },
  { path: '/worlds/1/uniques', name: 'edeus_unique_bearers', component: () => import('@/views/lobby/EdeusUniques.vue') },
  { path: '/world/transfer/:player_id', name: 'lobby_world_transfer', component: () => import('@/views/auth/Transfer.vue') },

  // Game
  { path: '/game', name: 'game', component: () => import('@/views/Game.vue'), beforeEnter: ifAuthenticated },
  { path: '/worlds/:world_id/complete/:player_id', name: 'lobby_world_complete_signup', component: () => import('@/views/auth/CompleteSignup.vue') },

  // Builder
  {
    path: '/build/worlds/:world_id',
    component: () => import('@/components/builder/BuilderFrame.vue'),
    beforeEnter: ifAuthenticated,
    children: [
      // World Views
      { path: '', name: 'builder_world_index', component: () => import('@/views/builder/world/World.vue') },
      { path: 'zones', name: 'builder_zone_list', component: () => import('@/views/builder/world/ZoneList.vue') },
      { path: 'mobs', name: 'builder_mob_template_list', component: () => import('@/views/builder/world/MobTemplateList.vue') },
      { path: 'mobs/:mob_template_id', name: 'builder_mob_template_details', component: () => import('@/views/builder/world/MobTemplateDetails.vue') },
      { path: 'items', name: 'builder_item_template_list', component: () => import('@/views/builder/world/ItemTemplateList.vue') },
      { path: 'items/:item_template_id', name: 'builder_item_template_details', component: () => import('@/views/builder/world/ItemTemplateDetails.vue') },
      { path: 'config', name: 'builder_world_config', component: () => import('@/views/builder/world/Config.vue') },
      { path: 'admin', name: 'builder_world_admin', component: () => import('@/views/builder/world/Admin.vue') },
      { path: 'admin/:instance_id', name: 'builder_world_admin_instance', component: () => import('@/views/builder/world/AdminInstance.vue') },
      { path: 'randomprofiles', name: 'builder_world_random_profile_list', component: () => import('@/views/builder/world/RandomProfileList.vue') },
      { path: 'transformations', name: 'builder_world_transformation_template_list', component: () => import('@/views/builder/world/TransformationTemplateList.vue') },
      { path: 'facts', name: 'builder_world_fact_list', component: () => import('@/views/builder/world/Facts.vue') },
      { path: 'builders', name: 'builder_world_builder_list', component: () => import('@/views/builder/world/BuilderList.vue') },
      { path: 'builders/:builder_id/assignments', name: 'builder_world_builder_assignment_list', component: () => import('@/views/builder/world/BuilderAssignmentList.vue') },
      { path: 'players', name: 'builder_world_player_list', component: () => import('@/views/builder/world/PlayerList.vue') },
      { path: 'players/:player_id', name: 'builder_world_player_details', component: () => import('@/views/builder/world/PlayerDetails.vue') },
      { path: 'factions', name: 'builder_world_faction_list', component: () => import('@/views/builder/world/FactionList.vue') },
      { path: 'factions/:faction_id/ranks', name: 'builder_world_faction_rank_list', component: () => import('@/views/builder/world/FactionRankList.vue') },
      { path: 'skills', name: 'builder_world_skill_list', component: () => import('@/views/builder/world/SkillList.vue') },
      { path: 'startingeq', name: 'builder_world_starting_eq_list', component: () => import('@/views/builder/world/StartingEqList.vue') },

      // Zone Views
      { path: 'zones/:zone_id', name: 'builder_zone_index', component: () => import('@/views/builder/zone/Zone.vue') },
      { path: 'zones/:zone_id/rooms', name: 'builder_zone_room_list', component: () => import('@/views/builder/zone/RoomList.vue') },
      { path: 'zones/:zone_id/paths', name: 'builder_zone_path_list', component: () => import('@/views/builder/zone/PathList.vue') },
      { path: 'zones/:zone_id/paths/:path_id', name: 'builder_zone_path_details', component: () => import('@/views/builder/zone/PathDetails.vue') },
      { path: 'zones/:zone_id/loaders', name: 'builder_zone_loader_list', component: () => import('@/views/builder/zone/LoaderList.vue') },
      { path: 'zones/:zone_id/loaders/:loader_id', name: 'builder_zone_loader_details', component: () => import('@/views/builder/zone/LoaderDetails.vue') },
      { path: 'zones/:zone_id/quests/', name: 'builder_zone_quest_list', component: () => import('@/views/builder/zone/QuestList.vue') },
      { path: 'zones/:zone_id/quests/:quest_id', name: 'builder_zone_quest_details', component: () => import('@/views/builder/zone/QuestDetails.vue') },
      { path: 'zones/:zone_id/config', name: 'builder_zone_config', component: () => import('@/views/builder/zone/Config.vue') },
      { path: 'zones/:zone_id/processions', name: 'builder_zone_procession_list', component: () => import('@/views/builder/zone/ProcessionList.vue') },
      { path: 'zones/:zone_id/processions/:procession_id', name: 'builder_zone_procession_details', component: () => import('@/views/builder/zone/ProcessionDetails.vue') },

      // Room Views
      { path: 'rooms/:room_id', name: 'builder_room_index', component: () => import('@/views/builder/room/Room.vue') },
      { path: 'rooms/:room_id/checks', name: 'builder_room_check_list', component: () => import('@/views/builder/room/RoomCheckList.vue') },
      { path: 'rooms/:room_id/actions', name: 'builder_room_action_list', component: () => import('@/views/builder/room/RoomActionList.vue') },
      { path: 'rooms/:room_id/loads', name: 'builder_room_load_list', component: () => import('@/views/builder/room/Loads.vue') },
      { path: 'rooms/:room_id/flags', name: 'builder_room_flags', component: () => import('@/views/builder/room/RoomFlags.vue') },
      { path: 'rooms/:room_id/config', name: 'builder_room_config', component: () => import('@/views/builder/room/Config.vue') },
      { path: 'rooms/:room_id/details', name: 'builder_room_details_list', component: () => import('@/views/builder/room/RoomDetailsList.vue') },
    ]
  },

  {
    path: '/staff',
    component: () => import('@/components/staff/StaffFrame.vue'),
    beforeEnter: ifStaff,
    children: [
      { path: 'panel', name: 'staff_index', component: () => import('@/views/staff/Staff.vue') },
      { path: 'playing', name: 'staff_playing', component: () => import('@/views/staff/Playing.vue') },
      { path: 'signups', name: 'staff_signups', component: () => import('@/views/staff/Signups.vue') },
      { path: 'worlds', name: 'staff_worlds', component: () => import('@/views/staff/Worlds.vue') },
      { path: 'activity', name: 'staff_activity', component: () => import('@/views/staff/Activity.vue') },
      { path: 'users/:user_id', name: 'staff_user_info', component: () => import('@/views/staff/UserInfo.vue') },
      { path: 'reviews', name: 'staff_reviews', component: () => import('@/views/staff/Reviews.vue') },
      { path: 'nexus/:nexus_id', name: 'staff_nexus_details', component: () => import('@/views/staff/NexusDetails.vue') },
    ],
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;
