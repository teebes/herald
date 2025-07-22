import {
  DIRECTIONS,
  REVERSE_DIRECTIONS
} from "@/constants";
import axios, { AxiosRequestConfig } from "axios";
import { Room } from "@/core/interfaces";
import router from "@/router";
import { get_room_index_key } from "@/core/map.ts";
import _ from "lodash";

// import builder_rooms from "@/store/modules/builder/rooms/index.ts";
import builder_world from "@/store/modules/builder/worlds/index.ts";
import builder_zones from "@/store/modules/builder/zones/index.ts";

import root_store from "@/store";
import { makeCrud } from "@/store/crud.ts";

interface BuilderState {
  world_fetching: boolean;
  world?: any;
  rooms?: Room[];
  room?: Room | null;
  map?: any;
  showing?: "world" | "zone" | "room" | "mob_templates" | "item_templates";
  //mob_template?: any;
  //item_template?: any;
  zone?: any;
  zone_rooms?: Room[];
  map_index?: any;
  loader: any;
  path: any;
  quest: any;
  world_factions: {}[];
  cancelPreviousRequest: any;
}

const initial_state = (): BuilderState => {
  return {
    world_fetching: false,
    world: null,
    zone: null,
    zone_rooms: [],
    room: null,
    rooms: [],
    map: null,
    map_index: null,
    loader: null,
    path: null,
    quest: null,
    showing: "world",
    world_factions: [],

    // Axios request cancellation helper
    cancelPreviousRequest: null,
  };
};

const getters = {
  getNeighbors: state => room => {
    /*
      Return rooms that are 1 space away, and could therefore be connected to.
    */
    let neighbors = {};
    for (const direction in DIRECTIONS) {
      let x = room.x,
        y = room.y,
        z = room.z;

      if (direction == DIRECTIONS.north) y += 1;
      else if (direction == DIRECTIONS.east) x += 1;
      else if (direction == DIRECTIONS.south) y -= 1;
      else if (direction == DIRECTIONS.west) x -= 1;
      else if (direction == DIRECTIONS.up) z += 1;
      else if (direction == DIRECTIONS.down) z -= 1;

      let index_key = get_room_index_key(x, y, z);
      const neighbor_room = state.map_index[index_key];
      if (neighbor_room) {
        neighbors[direction] = neighbor_room;
      } else {
        neighbors[direction] = null;
      }
    }
    return neighbors;
  },

  getDirectionActions: (state, getters) => (room, direction) => {
    let exitRoom: Room | null = null;
    if (room[direction]) {
      exitRoom = state.map[room[direction].key];
    }

    let canCreate = false,
      canConnect = false,
      canDisconnect = false,
      canOneWay = false,
      reverse_direction = REVERSE_DIRECTIONS[direction];

    const neighborRoom = getters.getNeighbors(room)[direction];

    if (neighborRoom && exitRoom) {
      canDisconnect = true;
      if (neighborRoom.id == exitRoom.id) {
        const reverseExitAttrs = exitRoom[reverse_direction];
        if (reverseExitAttrs && reverseExitAttrs.id === room.id) {
          canOneWay = true;
        }
      } //else {
      //   canConnect = true;
      // }
    } else if (exitRoom) {
      canDisconnect = true;
      const reverseExitAttrs = exitRoom[reverse_direction];
      if (reverseExitAttrs && reverseExitAttrs.id === room.id) {
        canOneWay = true;
      }
    } else if (neighborRoom && !exitRoom) {
      canConnect = true;
      canOneWay = true;
    } else if (!neighborRoom) {
      canCreate = true;
    }

    return {
      canCreate,
      canConnect,
      canDisconnect,
      canOneWay
    };
  },

  coreFactionsOptions: state => {
    // Faction data as usable by create / edit mob pages.
    const factions: {}[] = [
      {
        value: "",
        label: ""
      }
    ];
    for (const faction of state.world.factions) {
      if (faction.is_core) {
        factions.push({
          value: faction.code,
          label: faction.name
        });
      }
    }
    return factions;
  },

  defaultCoreFaction: state => {
    const core_factions: any[] = [];
    for (const faction of state.world.factions) {
      if (faction.is_core && faction.is_default) {
        return faction.code;
      } else if (faction.is_core) {
        core_factions.push(faction);
      }
    }
    if (core_factions.length === 0) return "";
    return core_factions[0].code;
  }
};

const actions = {
  fetch_world: async ({ commit }, world_id) => {
    const resp = await axios.get(`/builder/worlds/${world_id}/`);
    const world_data = resp.data;
    commit("world_set", world_data);
    return world_data;
  },

  fetch_world_map: async ({ commit }, world_id) => {
    const resp = await axios.get(`/builder/worlds/${world_id}/map/`);
    commit("map_set", resp.data.rooms);
  },

  world_create: async ({ commit }, payload) => {
    const resp = await axios.post(`/builder/worlds/`, payload);
    commit("world_set", resp.data);
    return resp.data;
  },

  world_save: async ({ commit, state }, data) => {
    const resp = await axios.patch(`/builder/worlds/${state.world.id}/`, data);
    commit("world_set", resp.data);
    return resp.data;
  },

  world_patch: async ({ commit, state }, data) => {
    const resp = await axios.patch(`/builder/worlds/${state.world.id}/`, data);
    commit("world_set", resp.data);
    return resp.data;
  },

  world_delete: async ({ commit, state }) => {
    await axios.delete(`/builder/worlds/${state.world.id}/`);
    commit("world_clear");
  },

  world_update_factions: async ({ commit, state }) => {
    const resp = await axios.get(
      `/builder/worlds/${state.world.id}/factions?page_size=100`
    );
    commit("world_update", resp.data["results"]);
  },

  // Assumes that a world is in the store
  zone_fetch: async ({ commit }, { world_id, zone_id, cancelToken }) => {

    try {
      const config: AxiosRequestConfig = {
        method: 'get',
        url: `/builder/worlds/${world_id}/zones/${zone_id}/`,
      }

      if (cancelToken) {
        config.cancelToken = cancelToken;
      }

      const resp = await axios(config);
      const zone = resp.data;
      commit("zone_set", zone);
      return zone;
    } catch (error: any) {
      if (!axios.isCancel(error)) {
        console.error('Error fetching zone:', error);
        if (error.response && error.response.status === 403) {
          commit("zone_clear");
        }
      }
    }
  },

  zone_rooms_fetch: async ({ commit }, { world_id, zone_id }) => {
    const resp = await axios.get(
      `builder/worlds/${world_id}/zones/${zone_id}/map/`
    );
    const rooms = resp.data.rooms;
    commit("zone_rooms_set", rooms);
    commit("map_add", rooms);
    return rooms;
  },

  zone_create: async ({ commit, state }, payload) => {
    const world_id = state.world.id;
    const resp = await axios.post(`builder/worlds/${world_id}/zones/`, payload);
    commit("zone_set", resp.data);
    router.push({
      name: 'builder_zone_index',
      params: {
        world_id: world_id,
        zone_id: resp.data.id
      }
    });
  },

  zone_delete: async ({ commit, state }) => {
    await axios.delete(
      `builder/worlds/${state.world.id}/zones/${state.zone.id}/`
    );
    commit("zone_clear");
    router.push({
      name: 'builder_zone_list',
      params: {
        world_id: state.world.id
      }
    });
  },

  zone_save: async ({ commit, state }, payload) => {
    const resp = await axios.put(
      `builder/worlds/${state.world.id}/zones/${state.zone.id}/`,
      payload
    );
    commit("zone_set", resp.data);
  },

  room_dir_action: async ({ state, commit }, payload) => {
    const resp = await axios.post(
      `builder/worlds/${state.world.id}/rooms/${state.room.key}/dir_action/`,
      payload
    );
    // Save room changes
    const room = Object.assign(state.room, resp.data["room"]);
    commit("room_set", room);
    // Update map
    const rooms = [room];
    if (resp.data["exit"]) rooms.push(resp.data["exit"]);
    commit("map_add", rooms);
    return resp.data;
  },

  room_select: async ({ commit, dispatch, state }, room) => {

    // Check for previous request cancelling
    if (state.cancelPreviousRequest) {
      state.cancelPreviousRequest();
      commit('setCancellationFunction', null)
    }

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    commit('setCancellationFunction', source.cancel);

    // Optimistically update store
    commit("room_set", room);

    // Dispatch fetch
    dispatch("room_fetch", {
      world_id: state.world.id,
      room_id: room.id,
      cancelToken: source.token
    });

    // If the clicked room is taking us to a new zone,
    // dispatch to get that as well
    if (room.zone.id != state.zone.id) {
      // Clear the zone's rooms since they will be refetched
      commit("zone_rooms_clear");
      dispatch("zone_fetch", {
        world_id: state.world.id,
        zone_id: room.zone.id,
        cancelToken: source.token,
      });
    }
  },

  room_fetch: async ({ commit }, { world_id, room_id, cancelToken }) => {
    try {

      const config: AxiosRequestConfig = {
        method: 'get',
        url: `/builder/worlds/${world_id}/rooms/${room_id}/`,
      }

      if (cancelToken) {
        config.cancelToken = cancelToken;
      }
      const resp = await axios(config);
      const room_data = resp.data;
      delete room_data["map"];
      commit("room_set", room_data);
      return room_data;
    } catch (error: any) {
      if (!axios.isCancel(error)) {
        console.log("Error fetching room", error);
        if (error.response && error.response.status === 403) {
          commit("room_clear");
        }
      }
    }
  },

  room_save: async ({ state, commit, dispatch }, payload) => {
    const old_room = { ...state.room };
    const resp = await axios.put(
      `/builder/worlds/${state.world.id}/rooms/${state.room.id}/`,
      payload
    );
    const new_room = resp.data;
    commit("room_set", new_room);
    commit("map_deindex", [old_room]);
    commit("map_add", [new_room]);
    if (new_room.zone.id != state.zone.id) {
      dispatch("zone_fetch", {
        world_id: state.world.id,
        zone_id: new_room.zone.id
      });
    }
    return new_room;
  },

  room_delete: async ({ state, commit, getters }) => {
    await axios.delete(
      `builder/worlds/${state.world.id}/rooms/${state.room.id}/`
    );

    // Before deleting, identify a suitable other room to send the
    // user to afterwards.
    let nextRoom;
    for (const direction in DIRECTIONS) {
      if (state.room[direction]) {
        nextRoom = state.map[state.room[direction].key];
        break;
      }
    }
    // If we found no connection, try a neighbor
    if (!nextRoom) {
      const neighbors = getters.getNeighbors(state.room);
      for (const direction in DIRECTIONS) {
        if (neighbors[direction]) {
          nextRoom = state.map[neighbors[direction].key];
          break;
        }
      }
    }
    // Last resort, use starting room
    if (!nextRoom) {
      nextRoom = state.map[state.world.starting_room.key];
    }

    // Make sure all rooms that were connected to this room
    // get that direction nulled out
    const rooms_to_update: {}[] = [];
    for (const direction in DIRECTIONS) {
      if (state.room[direction]) {
        const exitRoom = {
          ...state.map[state.room[direction].key],
          [REVERSE_DIRECTIONS[direction]]: null
        };
        rooms_to_update.push(exitRoom);
      }
    }
    if (rooms_to_update.length) {
      commit("map_add", rooms_to_update);
    }

    commit("map_deindex", [state.room]);
    commit("map_remove", [state.room]);
    commit("room_clear");
    commit("room_set", nextRoom);
    // Redirect to the nextRoom
    router.push({
      name: 'builder_room_index',
      params: {
        world_id: state.world.id,
        room_id: nextRoom.id
      }
    });
  },

  room_mark_last_viewed: async ({}, { world_id, room_id }) => {
    await axios.post(`/builder/worlds/${world_id}/rooms/${room_id}/`);
  },

  door_set: async ({ state, commit }, payload) => {
    const resp = await axios.post(
      `/builder/worlds/${state.world.id}/rooms/${state.room.id}/set_door/`,
      payload
    );
    if (resp.status === 201) {
      commit("room_door_set", payload);
    }
  },

  door_clear: async ({ state, commit }, direction) => {
    const resp = await axios.post(
      `/builder/worlds/${state.world.id}/rooms/${state.room.id}/clear_door/`,
      {
        direction: direction
      }
    );
    if (resp.status === 204) {
      commit("room_door_clear", direction);
    }
  },

  path_fetch: async ({ commit }, { world_id, path_id }) => {
    const resp = await axios.get(
      `builder/worlds/${world_id}/paths/${path_id}/`
    );
    commit("path_set", resp.data);
    return resp.data;
  },

  path_save: async ({ commit, state }, payload) => {
    const resp = await axios.put(
      `builder/worlds/${state.world.id}/paths/${state.path.id}/`,
      payload
    );
    commit("path_set", resp.data);
  },

  path_create: async ({ commit, state }, payload) => {
    const resp = await axios.post(
      `builder/worlds/${state.world.id}/zones/${state.zone.id}/paths/`,
      payload
    );
    commit("path_set", resp.data);
    router.push({
      name: 'builder_zone_path_details',
      params: {
        world_id: state.world.id,
        path_id: resp.data.id
      }
    });
  },

  path_delete: async ({ commit, state }) => {
    await axios.delete(
      `builder/worlds/${state.world.id}/paths/${state.path.id}/`
    );
    commit('ui/notification_set', 'Path deleted.', { root: true });
    router.push({
      name: 'builder_zone_index',
      params: {
        world_id: state.world.id,
        zone_id: state.zone.id
      }
    });
  }
};

const mutations = {
  register_collection: (_, { name, endpoint }) => {
    root_store.registerModule(["builder", name], makeCrud(endpoint));
  },

  unregister_collection: (_, name) => {
    root_store.unregisterModule(["builder", name]);
  },

  reset_state: state => {
    const s = initial_state();
    Object.keys(s).forEach(key => {
      state[key] = s[key];
    });
  },

  world_set: (state, world) => {
    state.world = world;
    state.world_factions = world.factions;
  },

  world_update: (state, new_data) => {
    state.world = {
      ...state.world,
      ...new_data
    };
    if (new_data.factions) {
      state.world_factions = new_data.factions;
    }
  },

  world_clear: (state) => {
    state.world = null;
  },

  factions_set: (state, factions) => {
    state.world_factions = factions;
  },

  faction_add: (state, faction) => {
    state.world_factions.push(faction);
  },

  faction_update: (state, faction) => {
    const faction_ids = _.map(state.world_factions, faction => faction.id);
    const index = faction_ids.indexOf(faction.id);
    state.world_factions.splice(index, 1, faction);
  },

  faction_delete: (state, faction) => {
    const faction_ids = _.map(state.world_factions, faction => faction.id);
    const index = faction_ids.indexOf(faction.id);
    state.world_factions.splice(index, 1);
  },

  room_set: (state, room) => {
    state.room = room;
  },

  room_clear: (state) => {
    state.room = null;
  },

  zone_set: (state, zone) => {
    state.zone = zone;
  },

  zone_clear: (state) => {
    state.zone = null;
  },

  zone_rooms_set: (state, zone_rooms) => {
    state.zone_rooms = zone_rooms;
  },

  zone_rooms_clear: state => {
    state.zone_rooms = [];
  },

  map_set: (state, map) => {
    state.map = map;
    if (!state.map_index) state.map_index = {};

    const map_index = {};
    for (const room_key in map) {
      const room = map[room_key];
      const index_pack = `${room.x}:${room.y}:${room.z}`;
      map_index[index_pack] = room;
    }

    state.map_index = map_index;
  },

  map_add: (state, rooms: Room[]) => {
    if (!state.map) state.map = {};
    if (!state.map_index) state.map_index = {};

    let newMap = {};
    let newIndex = {};
    for (const room of rooms) {
      newMap[room.key] = room;
      const index_pack = `${room.x}:${room.y}:${room.z}`;
      newIndex[index_pack] = room;
    }

    state.map = { ...state.map, ...newMap };
    state.map_index = { ...state.map_index, ...newIndex };
  },

  map_remove: (state, rooms: Room[]) => {
    for (const room of rooms) {
      delete state.map[room.key];
      const index_pack = `${room.x}:${room.y}:${room.z}`;
      delete state.map_index[index_pack];
    }
  },

  map_deindex: (state, rooms: Room[]) => {
    for (const room of rooms) {
      const index_pack = `${room.x}:${room.y}:${room.z}`;
      delete state.map_index[index_pack];
    }
  },

  map_alter_room: (state, room) => {
    state.map[room.key] = room;
    // TODO: if x, y or z change, reindex
  },

  path_set: (state, path) => {
    state.path = path;
  },

  path_rooms_add: (state, room) => {
    state.path.rooms.push(room);
  },

  path_rooms_delete: (state, room) => {
    const index = state.path.rooms.findIndex(_room => room.key == _room.key);
    if (index === -1) return;
    state.path.rooms.splice(index, 1);
  },

  room_door_set: (state, door_data) => {
    state.room.doors[door_data.direction] = door_data;
  },

  room_door_clear: (state, direction) => {
    delete state.room.doors[direction];
  },

  setCancellationFunction(state, cancelFunction) {
    state.cancelPreviousRequest = cancelFunction;
  },
};

export default {
  namespaced: true,
  state: initial_state(),
  getters,
  actions,
  mutations,
  modules: {
    // rooms: builder_rooms,
    worlds: builder_world,
    zones: builder_zones
  }
};
