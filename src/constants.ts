import { BUILDER_MOB_TEMPLATE_LIST } from "./router";

export const DIRECTIONS = {
  north: "north",
  east: "east",
  south: "south",
  west: "west",
  up: "up",
  down: "down"
};

export const REVERSE_DIRECTIONS = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
  up: "down",
  down: "up"
};

/* Auth */

export const AUTH_ACTIONS = {
  LOGIN: "auth_login",
  LOGOUT: "auth_logout"
};

export const AUTH_MUTATIONS = {
  SET_AUTH: "auth_set_authenticated",
  SET_UNAUTH: "auth_set_unauthenticated"
};

/* UI */

export const UI_ACTIONS = {
  PROCESS_ERROR_RESPONSE: "ui/process_error_response"
};

export const UI_MUTATIONS = {
  SET_NOTIFICATION: "ui/notification_set",
  SET_NOTIFICATION_ERROR: "ui/notification_set_error",
  CLOSE_NOTIFICATION: "ui/notification_close",
  MODAL_SET: "ui/modal_set",
  MODAL_SET_DATA: "ui/modal_set_extra_data",
  MODAL_CLOSE: "ui/modal_clear",
  EDITING_FIELD_SET: "ui/editing_field_set",
  EDITING_FIELD_CLEAR: "ui/editing_field_clear"
};

export const UI_MODALS = {
  MOB_TEMPLATE_INFO: "mob_template_info",
  MOB_TEMPLATE_STATS: "mob_template_stats",
  MOB_TEMPLATE_SUGGEST_STATS: "mob_template_suggest_stats",
  MOB_TEMPLATE_CREATE: "mob_template_create",
  MOB_TEMPLATE_REACTION_ADD: "mob_template_reaction_add",
  MOB_TEMPLATE_REACTION_EDIT: "mob_template_reaction_edit",
  LOADER_INFO: "modal_loader_info"
};

/* Builder */

export const BUILDER_ACTIONS = {
  FETCH_WORLD: "builder/fetch_world",
  FETCH_WORLD_MAP: "builder/fetch_world_map",
  ROOM_FETCH: "builder/room_fetch",
  ROOM_SELECT: "builder/room_select",
  ROOM_SAVE: "builder/room_save",
  ROOM_MARK_LAST_VIEWED: "builder/room_mark_last_viewed",
  ROOM_ACTION: "builder/room_action",
  ROOM_DELETE: "builder/room_delete",
  ZONE_FETCH: "builder/zone_fetch",
  ZONE_ROOMS_FETCH: "builder/zone_rooms_fetch",
  ZONE_CREATE: "builder/zone_create",
  ZONE_DELETE: "builder/zone_delete",
  ZONE_SAVE: "builder/zone_save",
  MOB_TEMPLATE_FETCH: "builder/mob_template_fetch",
  MOB_TEMPLATE_SAVE: "builder/mob_template_save",
  MOB_TEMPLATE_CREATE: "builder/mob_template_create",
  MOB_TEMPLATE_DELETE: "builder/mob_template_delete",
  ITEM_TEMPLATE_FETCH: "builder/item_template_fetch",
  ITEM_TEMPLATE_SAVE: "builder/item_template_save",
  ITEM_TEMPLATE_CREATE: "builder/item_template_create",
  ITEM_TEMPLATE_DELETE: "builder/item_template_delete",
  LOADER_FETCH: "builder/loader_fetch",
  LOADER_SAVE: "builder/loader_save",
  LOADER_CREATE: "builder/loader_create",
  LOADER_DELETE: "builder/loader_delete",
  PATH_FETCH: "builder/path_fetch",
  PATH_SAVE: "builder/path_save",
  PATH_CREATE: "builder/path_create",
  QUEST_FETCH: "builder/quest_fetch",
  QUEST_SAVE: "builder/quest_save",
  QUEST_CREATE: "builder/quest_create",
  QUEST_DELETE: "builder/quest_delete",
  QUEST_OBJECTIVE_CREATE: "builder/quest_objective_create",
  QUEST_OBJECTIVE_SAVE: "builder/quest_objective_update",
  QUEST_OBJECTIVE_DELETE: "builder/quest_objective_delete",
  QUEST_REWARD_CREATE: "builder/quest_reward_create",
  QUEST_REWARD_SAVE: "builder/quest_reward_update",
  QUEST_REWARD_DELETE: "builder/quest_reward_delete"
};

export const BUILDER_ACTIONS_NAMESPACED = {};
for (let k of Object.keys(BUILDER_ACTIONS)) {
  BUILDER_ACTIONS_NAMESPACED[k] = BUILDER_ACTIONS[k].split("/")[1];
}

export const BUILDER_MUTATIONS = {
  RESET_STATE: "builder/reset_state",
  WORLD_SET: "builder/world_set",
  ROOM_SET: "builder/room_set",
  ROOM_CLEAR: "builder/room_clear",
  MAP_SET: "builder/map_set",
  MAP_ADD: "builder/map_add",
  MAP_ALTER_ROOM: "builder/map_alter_room",
  MAP_REMOVE: "builder/map_remove",
  MAP_DEINDEX: "builder/map_deindex",
  ZONE_SET: "builder/zone_set",
  ZONE_CLEAR: "builder/zone_clear",
  ZONE_ROOMS_SET: "builder/zone_rooms_set",
  ZONE_ROOMS_CLEAR: "builder/zone_rooms_clear",
  MOB_TEMPLATE_SET: "builder/mob_template_set",
  MOB_TEMPLATE_EDIT: "builder/mob_template_edit",
  MOB_TEMPLATE_CLEAR: "builder/mob_template_clear",
  ITEM_TEMPLATE_SET: "builder/item_template_set",
  ITEM_TEMPLATE_CLEAR: "builder/item_template_clear",
  LOADER_SET: "builder/loader_set",
  LOADER_EDIT: "builder/loader_edit",
  LOADER_CLEAR: "builder/loader_clear",
  PATH_SET: "builder/path_set",
  PATH_ROOMS_ADD: "builder/path_rooms_add",
  PATH_ROOMS_DELETE: "builder/path_rooms_delete",
  QUEST_SET: "builder/quest_set",
  QUEST_CLEAR: "builder/quest_clear",
  QUEST_OBJECTIVE_ADD: "builder/quest_objective_add",
  QUEST_OBJECTIVE_UPDATE: "builder/quest_objective_update",
  QUEST_OBJECTIVE_DELETE: "builder/quest_objective_remove",
  QUEST_REWARD_ADD: "builder/quest_reward_add",
  QUEST_REWARD_UPDATE: "builder/quest_reward_update",
  QUEST_REWARD_DELETE: "builder/quest_reward_remove"
};

export const BUILDER_MUTATIONS_NAMESPACED = {};
for (let k of Object.keys(BUILDER_MUTATIONS)) {
  BUILDER_MUTATIONS_NAMESPACED[k] = BUILDER_MUTATIONS[k].split("/")[1];
}

const EQUIPMENT_SLOT_WEAPON = "weapon";
const EQUIPMENT_SLOT_OFFHAND = "offhand";
const EQUIPMENT_SLOT_HEAD = "head";
const EQUIPMENT_SLOT_BODY = "body";
const EQUIPMENT_SLOT_ARMS = "arms";
const EQUIPMENT_SLOT_HANDS = "hands";
const EQUIPMENT_SLOT_WAIST = "waist";
const EQUIPMENT_SLOT_LEGS = "legs";
const EQUIPMENT_SLOT_FEET = "feet";
const EQUIPMENT_SLOT_SHOULDERS = "shoulders";
export const EQUIPMENT_SLOT_LIST = [
  EQUIPMENT_SLOT_WEAPON,
  EQUIPMENT_SLOT_OFFHAND,
  EQUIPMENT_SLOT_HEAD,
  EQUIPMENT_SLOT_BODY,
  EQUIPMENT_SLOT_ARMS,
  EQUIPMENT_SLOT_HANDS,
  EQUIPMENT_SLOT_WAIST,
  EQUIPMENT_SLOT_LEGS,
  EQUIPMENT_SLOT_FEET
  //EQUIPMENT_SLOT_SHOULDERS
];
