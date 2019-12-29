<template>
  <div class="map-view">
    <canvas ref="canvas" id="map" :width="width" :height="width" @click="onClick"></canvas>

    <div class="planes" v-if="show_planes">
      <div class="arrow-up-wrapper">
        <img
          v-if="center.up"
          src="../assets/ui/arrow-70.svg"
          class="plane-arrow plane-arrow-up"
          @click="onClickUp"
        />
      </div>
      <img src="../assets/ui/plane-full-70.svg" class="plane" />
      <img src="../assets/ui/plane-hollow-70.svg" class="plane" />
      <img src="../assets/ui/plane-full-70.svg" class="plane" />
      <div class="arrow-down-wrapper">
        <img
          v-if="center.down"
          src="../assets/ui/arrow-70.svg"
          class="plane-arrow plane-arrow-down"
          @click="onClickDown"
        />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { MAP_CONFIG } from "@/config";
import { Room } from "@/core/interfaces";
import { get_map_width } from "@/core/map";
import MapRenderer from "@/core/map";
import { DIRECTIONS, REVERSE_DIRECTIONS } from "@/constants";

@Component
export default class Map extends Vue {
  @Prop() center_key!: string;
  @Prop({ default: 5 }) radius!: number;
  @Prop() unit!: number;
  @Prop() map!: {};
  @Prop() rooms_filter?: Array<Room>;
  @Prop() modified_rooms?: Array<Room>;
  @Prop({ default: true }) display_planes?: boolean;

  mapRenderer: any = null;

  @Watch("center_key")
  changeCenterKey() {
    if (this.center_key) this.renderMap();
  }

  @Watch("rooms_filter")
  changeRoomsFilter() {
    this.renderMap();
  }

  @Watch("map")
  changeMap(map) {
    this.renderMap();
  }

  get center() {
    return this.map[this.center_key];
  }

  get show_planes() {
    if (
      !this.$store.state.game.player &&
      this.display_planes &&
      (this.center.up || this.center.down)
    )
      return true;
    return false;
  }

  get width() {
    return get_map_width(this.radius, this.unit);
  }

  get rooms_filter_index() {
    if (!this.rooms_filter) return {};
    let room_index = {};
    for (const room of this.rooms_filter) {
      room_index[room.key] = room;
    }
    return room_index;
  }

  get has_room_filter() {
    return Boolean(this.rooms_filter && this.rooms_filter.length);
  }

  updated() {
    //this.renderMap();
  }

  onClick(event) {
    let room = this.mapRenderer.findByCoords({
      x: event.offsetX,
      y: event.offsetY
    });
    if (room) {
      let room_key = room.key;
      if (room.key.split("-exit-").length > 1) {
        room_key = room.key.split("-exit-")[0];
      }
      room = this.map[room_key];
      this.$emit("clickRoom", room);
    }
  }

  onClickUp() {
    const room = this.map[this.center_key],
      up = room.up;
    if (up) {
      this.$emit("clickRoom", this.map[up.key]);
    }
  }

  onClickDown() {
    const room = this.map[this.center_key],
      down = room.down;
    if (down) {
      this.$emit("clickRoom", this.map[down.key]);
    }
  }

  mounted() {
    this.renderMap();
  }

  get_rooms_around(room, radius) {
    radius = parseInt(radius);

    let roomsAround = {};

    const index = {};
    for (const room_key in this.map) {
      const room = this.map[room_key];
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
              this.has_room_filter &&
              !this.rooms_filter_index[roomAtCoords.key]
            ) {
              continue;
            }

            // Add to the returned rooms
            roomsAround[roomAtCoords.key] = roomAtCoords;
          }
        }
      }
    }

    if (this.modified_rooms && this.modified_rooms.length) {
      for (const room of this.modified_rooms) {
        roomsAround[room.key] = {
          ...roomsAround[room.key],
          ...room
        };
      }
    }

    return roomsAround;
  }

  renderMap() {
    const room = this.map[this.center_key];
    if (!room) return;
    let rooms = this.get_rooms_around(room, this.radius);

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
          exitRoom = { ...this.map[exitRoom.key] };
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

    const mapRenderer = new MapRenderer(rooms, this.$refs.canvas, {
      radius: this.radius,
      width: this.width,
      unit: this.unit,
      in_game: Boolean(this.$store.state.game.player) ? true : false
    });
    mapRenderer.showView(this.center_key);
    this.mapRenderer = mapRenderer;
  }
}
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