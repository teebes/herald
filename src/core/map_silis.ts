const COLORS = {
  white: "#EBEBEB",
  gray: "#A2A2A2",
  green: "#279084",
  black: "#191A1C",
  red: "#c13434",
  primary: "#d77617",
  purple: "#8934c1",
  secondary: "#f5c983",
  pink: "#f583e7",
  exit: "#999" // color of the border
};

const ROOMCOLORS = {
  road: "#9497a1",
  city: "#65686e",
  indoor: "#a48d73",
  field: "#8e9422",
  mountain: "#7a5b3e",
  water: "#4798c4",
  shallow: "#4798c4",
  forest: "#207f45",
  desert: "#bf824d",
  trail: "#5a8b73"
};

const INVERSE_DIRECTIONS = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
  up: "down",
  down: "up"
};

export const get_room_index_key = (x, y, z) => `${x}:${y}:${z}`;

export const get_map_width = (radius: number, unit: number) => {
  const width = 4 * unit + 6 * unit * radius;
  return width;
};

export const get_map_dimensions = (width: number, unit: number) => {
  /*
    From a size and unit, return a smaller width and radius that can be
    contained given the size. This is useful to determine the dimensions of
    a map that can fit in a given space.
  */
  const center = 4 * unit;
  const non_center = width - center;
  const remainder = non_center % (6 * unit);
  const radius = (non_center - remainder) / (6 * unit);
  const inner_width = center + radius * unit * 6;
  return {
    width: inner_width,
    radius: radius
  };
};

export default class Map {
  rooms: {};
  canvas: any;
  options: any;
  radius: number;
  width: number;
  unit: number;
  last_center_id: string;
  renderRooms: {};
  ctx: any;
  in_game: boolean;

  constructor(rooms, canvas, options?: any) {
    this.rooms = rooms;
    this.canvas = canvas;
    this.options = options || {};

    // Create a 2d context in the canvas element
    this.ctx = canvas.getContext("2d");

    // Configuration / options
    this.radius = this.options.radius || 5;
    this.width = this.options.width || 272;
    this.unit = this.options.unit || 8;

    this.last_center_id = "";
    this.renderRooms = {};
    this.in_game = this.options.in_game;
  }

  refresh() {
    this.showView(this.last_center_id);
  }

  findByCoords({ x, y }) {
    for (const roomId in this.renderRooms) {
      const room = this.renderRooms[roomId];
      if (room.cx <= x && x <= room.cx + 2 * this.unit) {
        if (room.cy <= y && y <= room.cy + 2 * this.unit) {
          return room;
        }
      }
    }
    return null;
  }

  showView(center_id) {
    /*
      Only after knowing what room to show around can we determine
      which rooms to include, as well as what their coordinates are.
    */

    this.renderRooms = {};
    const cRoom = { ...this.rooms[center_id] };

    // If the center id is not found in the map, we're not going to be
    // able to do anything
    if (!cRoom.id) {
      return;
    }

    for (const rid in this.rooms) {
      const room = { ...this.rooms[rid] };

      if (
        Math.abs(room.x - cRoom.x) < this.radius + 4 &&
        Math.abs(room.y - cRoom.y) < this.radius + 4 &&
        room.z === cRoom.z
      ) {
        // This says, start at half the width of the map, then account
        // for half of an exit, and then do 3 units (2 half room widths
        // + 1 half exit width).
        room.cx =
          this.width / 2 - this.unit + 3 * this.unit * (room.x - cRoom.x);
        room.cy =
          this.width / 2 - this.unit + 3 * this.unit * (cRoom.y - room.y);

        this.renderRooms[room.id] = room;
      }
    }

    // Do the actual rendering
    this.ctx.clearRect(0, 0, this.width, this.width);
    for (const room_id in this.renderRooms) {
      this.drawRoom(this.renderRooms[room_id], center_id);
    }

    this.last_center_id = center_id;
  }

  drawRoom(room, center_id) {
    if (room.color) {
      var roomColor = room.color;
    } else {
      var roomColor = ROOMCOLORS[room.type];
    }

    var x = room.cx,
      y = room.cy,
      w = this.unit * 2,
      isSelected = room.id === center_id ? true : false;

    this.ctx.fillStyle = roomColor;
    if (isSelected) {
      this.ctx.fillRect(room.cx - 1, room.cy - 1, w + 2, w + 2);

      if (room.flags && room.flags.length) {
        this.drawRoomTab(x, y, room.flags, true);
      }

      this.ctx.fillStyle = COLORS.black;
      this.ctx.fillRect(room.cx + 2, room.cy + 2, w - 4, w - 4);
    } else if (room.type == "exit") {
      if (!this.in_game) {
        this.ctx.strokeStyle = COLORS.white;
        this.ctx.beginPath();
        this.ctx.arc(room.cx + w / 2, room.cy + w / 2, w / 3, 0, 2 * Math.PI);
        this.ctx.stroke();
      }
      return;
    } else {
      this.ctx.fillRect(room.cx, room.cy, w, w);

      if (room.flags && room.flags.length) {
        this.drawRoomTab(x, y, room.flags, false);
      }
    }

    // NESW connections
    for (const direction of ["north", "east", "south", "west"]) {
      const toRoomId = room[direction];
      if (!toRoomId) continue;

      this.drawConnection(room, direction);
    }

    // U / D connections
    if (room.up && room.down) {
      this.drawTriangle(x + 8, y + 5, {
        selected: true
      });
      this.drawTriangle(x + 8, y + 11, {
        down: true,
        selected: true
      });
    } else if (room.up) {
      this.drawTriangle(x + 8, y + 8, {
        selected: isSelected
      });
    } else if (room.down) {
      this.drawTriangle(x + 8, y + 8, {
        selected: isSelected,
        down: true
      });
    }
  }

  drawTriangle(x, y, options) {
    options = options || {};
    const color = options.selected ? COLORS.white : COLORS.black,
      size = options.size || 2;

    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    if (options.down) {
      this.ctx.moveTo(x - 2 * size, y - size);
      this.ctx.lineTo(x + 2 * size, y - size);
      this.ctx.lineTo(x, y + size);
    } else {
      this.ctx.moveTo(x - 2 * size, y + size);
      this.ctx.lineTo(x + 2 * size, y + size);
      this.ctx.lineTo(x, y - size);
    }
    this.ctx.fill();
  }

  drawConnection(room, dir) {
    const revDir = INVERSE_DIRECTIONS[dir];
    const exitRoomId = room[dir];
    if (!exitRoomId) return;

    const fromCoords = this.getExitCoord(room, dir);
    let toCoords;

    if (
      room[`${dir}_door_state`] == "closed" ||
      room[`${dir}_door_state`] == "locked"
    ) {
      return;
    }

    var exitRoom = this.renderRooms[exitRoomId];
    if (exitRoom && exitRoom.z === room.z) {
      // exit room is in the map, and on the same z-axis
      toCoords = this.getExitCoord(exitRoom, revDir);
    } else {
      // exit room not in the map
      toCoords = [fromCoords[0], fromCoords[1]];
      if (dir === "south") {
        toCoords[1] += this.unit;
      } else if (dir === "north") {
        toCoords[1] -= this.unit;
      } else if (dir === "east") {
        toCoords[0] += this.unit;
      } else if (dir === "west") {
        toCoords[0] -= this.unit;
      } else {
        return;
      }
    }

    // Room going under another room, we shorten the connection by
    // half.
    var actualExitRoom = this.rooms[exitRoomId];
    if (actualExitRoom && actualExitRoom.z !== room.z) {
      if (dir === "south") {
        toCoords[1] -= this.unit / 2;
      } else if (dir === "north") {
        toCoords[1] += this.unit / 2;
      } else if (dir === "east") {
        toCoords[0] -= this.unit / 2;
      } else if (dir === "west") {
        toCoords[0] += this.unit / 2;
      }
    }

    this.ctx.strokeStyle = COLORS.white;
    this.ctx.beginPath();
    this.ctx.moveTo(fromCoords[0], fromCoords[1]);
    this.ctx.lineTo(toCoords[0], toCoords[1]);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    if (actualExitRoom) {
      // Check if the connection is one-way
      var revRoomId = actualExitRoom[revDir];
      if (!revRoomId || revRoomId != room.id) {
        this.drawOneWay(toCoords, dir);
      }
    }
  }

  drawOneWay(toCoords, dir) {
    var x = toCoords[0],
      y = toCoords[1];
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = COLORS.white;
    this.ctx.moveTo(x, y);
    if (dir === "east") {
      this.ctx.lineTo(x - 4, y - 4);
    } else if (dir === "west") {
      this.ctx.lineTo(x + 4, y - 4);
    } else if (dir === "north") {
      this.ctx.lineTo(x - 4, y + 4);
    } else if (dir === "south") {
      this.ctx.lineTo(x - 4, y - 4);
    }
    this.ctx.moveTo(x, y);
    if (dir === "east") {
      this.ctx.lineTo(x - 4, y + 4);
    } else if (dir === "west") {
      this.ctx.lineTo(x + 4, y + 4);
    } else if (dir === "north") {
      this.ctx.lineTo(x + 4, y + 4);
    } else if (dir === "south") {
      this.ctx.lineTo(x + 4, y - 4);
    }
    this.ctx.stroke();
  }

  getExitCoord(room, dir) {
    // Return coordinates of the exit point
    let x = room.cx,
      y = room.cy;
    if (dir == "north" || dir == "south") {
      x += this.unit;
    }
    if (dir == "east" || dir == "west") {
      y += this.unit;
    }
    if (dir == "east") {
      x += this.unit * 2;
    }
    if (dir == "south") {
      y += this.unit * 2;
    }
    return [x, y];
  }

  drawRoomTab(x, y, flags, selected) {
    selected = selected ? 1 : 0;

    // Draw a room tab if necessary
    var color;
    for (var i = 0; i <= flags.length; i++) {
      var flag = flags[i];
      if (flag === "fountain") {
        color = ROOMCOLORS.water;
        break;
      } else if (flag === "smob") {
        color = COLORS.red;
        break;
      } else if (flag === "trainer") {
        color = COLORS.white;
        break;
      } else if (flag === "exp") {
        color = COLORS.primary;
        break;
      } else if (flag === "horse") {
        color = ROOMCOLORS.field;
        break;
      } else if (flag === "shop") {
        color = COLORS.green;
        break;
      } else if (flag === "inn") {
        color = COLORS.purple;
        break;
      } else if (flag === "herb") {
        color = COLORS.secondary;
        break;
      } else if (flag === "action") {
        color = COLORS.pink;
        break;
      }
    }

    if (color) {
      this.ctx.beginPath();
      this.ctx.fillStyle = COLORS.black;
      this.ctx.moveTo(x - 3 - selected + this.unit, y - selected);
      this.ctx.lineTo(x + this.unit * 2 + selected, y - selected);
      this.ctx.lineTo(
        x + this.unit * 2 + selected,
        y + this.unit + 3 - selected
      );
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.fillStyle = color;
      this.ctx.moveTo(x - 2.5 - selected + this.unit, y - selected);
      this.ctx.lineTo(x + this.unit * 2 + selected, y - selected);
      this.ctx.lineTo(
        x + this.unit * 2 + selected,
        y + this.unit + 2.5 - selected
      );
      this.ctx.fill();
    }
  }
}
