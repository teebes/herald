// Define all shared interfaces here
export interface Char {
    id: string | number;
    entity: string;
    state: string;
    name: string;
    room_id: number;
    description?: string;
    keywords?: string[];
    room_description?: string;
    health: number;
    stamina: number;
}

// Valid room types
type RoomType = "road" | "city" | "indoor" | "field" | "mountain" | "water" |
                "shallow" | "forest" | "desert" | "trail" | "exit";

// Valid room flags
type RoomFlag = "fountain" | "smob" | "trainer" | "exp" | "horse" |
                "shop" | "inn" | "herb" | "action";

// Valid door states
type DoorState = "closed" | "locked";

// Room as viewed on a map
export interface Room {
    // Core identification
    id: string | number;
    name: string;
    description?: string;

    // 3D coordinates
    x: number;
    y: number;
    z: number;

    // Room type and appearance
    type: RoomType;
    color?: string;
    cost: number;

    // Optional room flags
    flags?: RoomFlag[];

    // Connections to other rooms
    north?: string | number;
    south?: string | number;
    east?: string | number;
    west?: string | number;
    up?: string | number;
    down?: string | number;

    // Door states for each direction
    north_door_state?: DoorState;
    south_door_state?: DoorState;
    east_door_state?: DoorState;
    west_door_state?: DoorState;
    up_door_state?: DoorState;
    down_door_state?: DoorState;
}

// Map type - a dictionary/object with string or number keys and Room values
type GameMap = {
    [key: string | number]: Room;
};

// Complete game state needed for game logic
export interface GameContext {
    actor: Char;
    room: Room;
    map: GameMap;
    room_mobs: Char[];
}
