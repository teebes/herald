<template>
  <div class="map-view">
    <canvas ref="canvas" id="map" :width="width" :height="width" @click="onClick"></canvas>

    <div class="planes" v-if="show_planes">
      <div class="arrow-up-wrapper">
        <img
          v-if="center.up"
          src="@/assets/ui/arrow-70.svg"
          class="plane-arrow plane-arrow-up"
          @click="onClickUp"
        />
      </div>
      <img src="@/assets/ui/plane-full-70.svg" class="plane" />
      <img src="@/assets/ui/plane-hollow-70.svg" class="plane" />
      <img src="@/assets/ui/plane-full-70.svg" class="plane" />
      <div class="arrow-down-wrapper">
        <img
          v-if="center.down"
          src="@/assets/ui/arrow-70.svg"
          class="plane-arrow plane-arrow-down"
          @click="onClickDown"
        />
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { Room } from "@/core/interfaces";
import { get_map_width } from "@/core/map";
import MapRenderer from "@/core/map";

const store = useStore();

const emit = defineEmits(["clickRoom"]);

const props = defineProps<{
  center_key: string;
  radius: number;
  unit: number;
  map: {};
  rooms_filter?: Array<Room>;
  modified_rooms?: Array<Room>;
  display_planes?: boolean;
}>();

const canvas = ref(null);
const mapRenderer: any = ref(null);

const center = computed(() => props.map[props.center_key]);

const show_planes = computed(() => {
  if (
    !store.state.game.player &&
    props.display_planes &&
    (center.value.up || center.value.down)
  ) {
    return true;
  }
  return false;
});

const width = computed(() => get_map_width(props.radius, props.unit));

const rooms_filter_index = computed(() => {
  if (!props.rooms_filter) return {};
  const room_index = {};
  for (const room of props.rooms_filter) {
    room_index[room.key] = room;
  }
  return room_index;
});

const has_room_filter = computed(() => Boolean(props.rooms_filter && props.rooms_filter.length));


const onClick = (event) => {
  const room = mapRenderer.value.findByCoords({
    x: event.offsetX,
    y: event.offsetY
  });
  if (room) {
    let room_key = room.key;
    if (room.key.split('-exit-').length > 1) {
      room_key = room.key.split('-exit-')[0];
    }
    const clickedRoom = props.map[room_key];
    emit('clickRoom', clickedRoom);
  }
};

const onClickUp = () => {
  const room = props.map[props.center_key];
  const up = room.up;
  if (up) {
    emit('clickRoom', props.map[up.key]);
  }
};

const onClickDown = () => {
  const room = props.map[props.center_key];
  const down = room.down;
  if (down) {
    emit('clickRoom', props.map[down.key]);
  }
};

const get_rooms_around = (room, radius) => {
  radius = parseInt(radius);

  let roomsAround = {};

  const index = {};
  for (const room_key in props.map) {
    const room = props.map[room_key];
    const index_pack = `${room.x}:${room.y}:${room.z}`;
    index[index_pack] = room;
  }

  for (let x = room.x - radius; x <= room.x + radius; x += 1) {
    for (let y = room.y - radius; y <= room.y + radius; y += 1) {
      for (let z = room.z - 1; z <= room.z + 1; z += 1) {
        const index_pack = `${x}:${y}:${z}`;
        //const roomAtCoords = this.$store.state.builder.map_index[index_pack];
        const roomAtCoords = index[index_pack];

        // The room is in visible range, and is present in the index, we add it
        // to the shown rooms.
        if (roomAtCoords) {
          // If we are filtering and the room is not in the filtered index,
          // skip it
          if (
            has_room_filter.value &&
            !rooms_filter_index.value[roomAtCoords.key]
          ) {
            continue;
          }

          // Add to the returned rooms
          roomsAround[roomAtCoords.key] = roomAtCoords;
        }
      }
    }
  }

  if (props.modified_rooms && props.modified_rooms.length) {
    for (const room of props.modified_rooms) {
      roomsAround[room.key] = {
        ...roomsAround[room.key],
        ...room
      };
    }
  }

  return roomsAround;
};

const renderMap = () => {
  const room = props.map[props.center_key];
  if (!room) return;
  let rooms = get_rooms_around(room, props.radius);

  // Now go through each room and see if any have a connection to some other
  // room within the greater map, but that is not in the shown rooms.
  const connectedExits = {},
    directions = ["north", "east", "south", "west"];
  for (const room_key in rooms) {
    const room = rooms[room_key];
    for (let direction of directions) {
      let exitRoom = { ...room[direction] };
      // There is an exit room, but it is not in the showed rooms, so we create
      // a connection exit room
      if (exitRoom.key && !rooms[exitRoom.key]) {
        // Set the exit room to its definition from the map, which includes things
        // like back exits
        exitRoom = { ...props.map[exitRoom.key] };
        exitRoom.key = exitRoom.key + "-exit-" + room.key;
        exitRoom.type = "exit";
        exitRoom.z = room.z;
        if (direction == "north") {
          exitRoom.x = room.x;
          exitRoom.y = room.y + 1;
        } else if (direction == "east") {
          exitRoom.x = room.x + 1;
          exitRoom.y = room.y;
        } else if (direction == "south") {
          exitRoom.x = room.x;
          exitRoom.y = room.y - 1;
        } else if (direction == "west") {
          exitRoom.x = room.x - 1;
          exitRoom.y = room.y;
        }

        // If there is an actual room at the connected spot (which can happen
        // for example with the bridge effect)

        for (let dir in directions) exitRoom[dir] = null;
        //exitRoom[REVERSE_DIRECTIONS[direction]] = { key: room.key };
        connectedExits[exitRoom.key] = exitRoom;
      }
    }
  }
  rooms = { ...rooms, ...connectedExits };

  mapRenderer.value = new MapRenderer(rooms, canvas.value, {
    radius: props.radius,
    width: width.value,
    unit: props.unit,
    in_game: Boolean(store.state.game.player) ? true : false
  });
  mapRenderer.value.showView(props.center_key);
  // mapRenderer.value = renderer;
}

onMounted(() => {
  renderMap();
});

watch(() => props.center_key, () => {
  if (props.center_key) renderMap();
});

watch(() => props.rooms_filter, () => {
  renderMap();
});

watch(() => props.map, () => {
  renderMap();
});
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";

.map-view {
  position: relative;

  canvas {
    border: 1px solid #444;
  }

  .planes {
    border-top: 1px solid #444;
    border-right: 1px solid #444;
    position: absolute;
    bottom: 6px;
    //left: 10px;
    left: 1px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    //background: $color-background;
    background: rgba(25, 26, 28, 0.7);

    .plane {
      width: 28px;
      height: 8px;

      margin: 1px 0;
    }

    .arrow-up-wrapper,
    .arrow-down-wrapper {
      width: 18px;
      height: 22px;
    }

    .plane-arrow {
      width: 18px;
      height: 22px;

      &.plane-arrow-down {
        transform: rotate(180deg);
      }

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>