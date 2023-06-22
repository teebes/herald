import store from "@/store";
import Conditions from "@/components/builder/Conditions.vue";

export interface FormElement {
  attr: string;
  label: string;
  references?: string;
  widget?: "text" | "textarea" | "reference" | "select" | "checkbox" | "custom";
  widgetComponent?: any;
  context?: string;
  options?: { value: string | null; label: string }[];
  default?: string | number | boolean | null;
  create_only?: boolean;
  tooltip?: ""[];
  help?: string;
  required?: boolean;
  readonly?: boolean;
  children?: FormElement[];
}

// Generic form elements

export const NAME: FormElement = {
  attr: "name",
  label: "Name",
};

export const FIRST_NAME: FormElement = {
  attr: "first_name",
  label: "First Name",
};

export const LAST_NAME: FormElement = {
  attr: "last_name",
  label: "Last Name",
};

export const DESCRIPTION: FormElement = {
  attr: "description",
  label: "Description",
  widget: "textarea",
};

export const ITEM_TEMPLATE: FormElement = {
  attr: "item_template",
  label: "Item Template",
  widget: "reference",
  references: "item_template",
};

export const MOB_TEMPLATE: FormElement = {
  attr: "mob_template",
  label: "Mob Template",
  widget: "reference",
  references: "mob_template",
};

export const ZONE: FormElement = {
  attr: "zone",
  label: "Zone",
  widget: "reference",
  references: "zone",
};

export const DIRECTION: FormElement = {
  attr: "direction",
  label: "Direction",
  options: [
    {
      value: "",
      label: "",
    },
    {
      value: "north",
      label: "North",
    },
    {
      value: "east",
      label: "East",
    },
    {
      value: "south",
      label: "South",
    },
    {
      value: "west",
      label: "West",
    },
    {
      value: "up",
      label: "Up",
    },
    {
      value: "down",
      label: "Down",
    },
  ],
};

export const CONDITIONS: FormElement = {
  attr: "conditions",
  label: "Conditions",
  help: `Conditions required for the action to be prevented. For more information on conditions, refer to their <a href='https://docs.writtenrealms.com/building/conditions'>doc page</a>.<br/><br/>
    Quick reference:<br/>
    <code>
    - level_above level<br/>
    - item_in_room template_id<br/>
    - item_in_inv template_id<br/>
    - item_in_eq template_id<br/>    
    - mob_in_room template_id<br/>
    - player_in_room<br/>
    - quest_complete quest_id<br/>
    - archetype archetype<br/>    
    - core_faction faction_code<br/>
    - standing_above faction_code standing<br/>
    - health_below percentage<br/>
    - player_in_room<br/>
    - gold_above<br/>
    - fact_check<br/>
    - marked<br/>
    - in_combat<br/>
    - has_weapon<br/>
    - has_shield<br/>
    - wields_weapon_type weapon_type
    </code>`,
};

// Room Checks

const ROOM_CHECK: FormElement[] = [
  NAME,
  CONDITIONS,
  {
    attr: "prevent",
    label: "Prevent",
    default: "enter",
    options: [
      {
        value: "enter",
        label: "Enter",
      },
      {
        value: "exit",
        label: "Exit",
      },
    ],
    help: `Which action to prevent.<br/>
          - entry: look at the move’s destination room entry checks before allowing the actor to enter it.<br/>
          - exit: look at the move’s current room exit checks before allowing the actor to exit it.`,
  },
  {
    ...DIRECTION,
    help: `Only applicable for 'exit' prevents. If defined, specifies which exit is blocked by the room check.`,
  },
  {
    attr: "failure_msg",
    label: "Failure Message",
    help: `The message to display if the check was true, meaning the action was prevented.`,
  },
  {
    attr: "check",
    label: "Check",
    default: "in_inv",
    options: [
      {
        value: "in_inv",
        label: "In inventory",
      },
      {
        value: "not_in_inv",
        label: "Not in inventory",
      },
      {
        value: "equipped",
        label: "Equipped",
      },
      {
        value: "not_equipped",
        label: "Not equipped",
      },
      {
        value: "mob_is_present",
        label: "Mob is present",
      },
      {
        value: "faction_below",
        label: "Faction below",
      },
      {
        value: "health_below",
        label: "Health below",
      },
      {
        value: "quest_complete",
        label: "Quest complete",
      },
      {
        value: "quest_incomplete",
        label: "Quest incomplete",
      },
    ],
    help: `Deprecated, please use conditions instead.<br/><br/>
        Which check to perform.<br/>
        - in inventory: whether item template id 'argument' is in the actor's inventory.<br/>
        - not in inventory: the opposite of in_inv.<br/>
        - equipped: whether item template id 'argument' is equipped by the actor.<br/>
        - not equipped: the opposite of equipped.<br/>
        - mob is present: whether a mob with template id 'argument' in the room is present. If 'argument2' is specified as a faction, that faction is exempt from the check.<br/>
        - faction below: whether a character's standing in faction 'argument' is below 'argument2'.<br/>
        - health below: whether a character’s health is below a 'argument' threshold, in % of their max health.<br/>
        - quest complete: whether a character has completed quest id 'argument'.<br/>
        - quest incomplete: whether a character has not completed quest id 'argument'.<br/>`,
  },
  {
    attr: "argument",
    label: "Argument",
    help: `Deprecated. Parameter depending on the check. See the 'check' field for details.`,
  },
  {
    attr: "argument2",
    label: "Argument 2",
    help: `Deprecated. Parameter used for the 'mob_is_absent' and 'faction_below' checks. See the 'check' field for details.`,
  },
];

const ROOM_ACTION: FormElement[] = [
  NAME,
  {
    attr: "actions",
    label: "Action",
    help: `Command to be executed by the player to trigger the action. By using the 'or' operator, several actions may be defined`,
  },
  {
    attr: "display_action_in_room",
    label: "Display Action in Room",
    widget: "checkbox",
    default: true,
    help: `Whether to display a button for this action in the UI when looking at the room`,
  },
  {
    attr: "commands",
    label: "Commands",
    widget: "textarea",
    help: `Commands to be executed by the room when the action is triggered by the player. Can enter multiple commands, one per line.`,
  },
  CONDITIONS,
  {
    attr: "show_details_on_failure",
    label: "Show Failure Message",
    widget: "checkbox",
    default: false,
    help: `If the condition fails, whether to display a reason message for the failure. If false, the player will receive the same message they would for a command that does not exist.`,
  },
  {
    attr: "failure_message",
    label: "Failure Message",
    help: `If defined, what message to display if the action condition is not met. If 'Show Failure Message' is checked and this message is empty, the game will supply the player with its best guess as for the reason of the failure.`,
  },
  {
    attr: "gate_delay",
    label: "Action Cooldown",
    default: 10,
    help: `Applies a debounce to the action, so that a player entering the action twice in succession does not trigger the room commands with the second invocation unless the specified amount of time has elapsed.`,
  },
];

export const GET_MOB_TEMPLATE_INFO = () => {
  return [
    {
      children: [
        {
          attr: "name",
          label: "Name",
          help: `If naming a non-proper noun, use a lowercase article to start its name,
              for example 'a rat'. This ensures combat messaged will be properly
              formatted, for example 'You strike a rat.' The article will be
              auto-capitalized when needed.`,
        },
        {
          attr: "notes",
          label: "Notes",
        },
      ],
    },
    {
      children: [
        {
          attr: "level",
          label: "Level",
          help: `The level of a mob determines how hard it is to kill and how much 
                experience it gives.`,
        },
        {
          attr: "gender",
          label: "Gender",
          widget: "select",
          options: [
            {
              value: "female",
              label: "Female",
            },
            {
              value: "male",
              label: "Male",
            },
            {
              value: "non_binary",
              label: "Non-binary",
            },
          ],
        },
      ],
    },
    {
      children: [
        {
          attr: "core_faction",
          label: "Core Faction",
          widget: "select",
          options: store.getters["builder/coreFactionsOptions"],
        },
        {
          attr: "aggression",
          label: "Aggression",
          widget: "select",
          options: [
            {
              value: "passive",
              label: "Passive",
            },
            {
              value: "normal",
              label: "Normal",
            },
            {
              value: "players",
              label: "Players",
            },
            {
              value: "all",
              label: "All",
            },
            {
              value: "friendly",
              label: "Friendly",
            },
          ],
          help: `Determines a mob's behavior when you enter its room.
                 <br/><br/>
                 * Passive: mob will never attack first.<br/>
                 * Normal: mob will only attack if their faction is at odds with the entering char.<br/>
                 * Players: mob will attack all players.<br/>
                 * All: mob will attack players & other mobs.<br/>
                 * Friendly: Mob will not be able to attack nor be attacked.
                `,
        },
      ],
    },
    {
      children: [
        {
          attr: "type",
          label: "Mob Type",
          widget: "select",
          options: [
            {
              value: "aberration",
              label: "Aberration",
            },
            {
              value: "beast",
              label: "Beast",
            },
            {
              value: "celestial",
              label: "Celestial",
            },
            {
              value: "construct",
              label: "Construct",
            },
            {
              value: "dragon",
              label: "Dragon",
            },
            {
              value: "elemental",
              label: "Elemental",
            },
            {
              value: "fey",
              label: "Fey",
            },
            {
              value: "fiend",
              label: "Fiend",
            },
            {
              value: "giant",
              label: "Giant",
            },
            {
              value: "humanoid",
              label: "Humanoid",
            },
            {
              value: "monstrosity",
              label: "Monstrosity",
            },
            {
              value: "ooze",
              label: "Ooze",
            },
            {
              value: "plant",
              label: "Plant",
            },
            {
              value: "undead",
              label: "Undead",
            },
          ],
        },
        {
          attr: "archetype",
          label: "Mob Class",
          widget: "select",
          help: `The mob's class determine how its stats are calculated. For
                 example, warriors will roll more strength and thieves will roll
                 more dexterity.<br/>
                 If abilities are enabled, also determines which skills are used.
                `,
          options: [
            {
              value: "warrior",
              label: "Warrior",
            },
            {
              value: "mage",
              label: "Mage",
            },
            {
              value: "cleric",
              label: "Cleric",
            },
            {
              value: "assassin",
              label: "Assassin",
            },
            {
              value: "",
              label: "Classless"
            },
          ],
        },
      ],
    },
    {
      children: [
        {
          attr: "hit_msg_first",
          label: "Hit Message First Person",
        },
        {
          attr: "hit_msg_third",
          label: "Hit Message Third Person",
        },
      ],
    },
    // {
    //   attr: "notes",
    //   label: "Notes"
    // },
    {
      children: [
        {
          attr: "is_invisible",
          label: "Is Invisible",
          widget: "checkbox",
        },
        {
          attr: "fights_back",
          label: "Fights Back",
          widget: "checkbox",
        },
      ],
    },
  ];
};

export const BUILDER_FORMS = {
  ITEM_TEMPLATE,
  MOB_TEMPLATE,
  ZONE,
  NAME,
  DESCRIPTION,

  ROOM_CHECK,
  ROOM_ACTION,

  // Builder screens

  ROOM_INFO: [
    {
      attr: "name",
      label: "Name",
    },
    {
      children: [
        { attr: "x", label: "X" },
        { attr: "y", label: "Y" },
        { attr: "z", label: "Z" },
      ],
    },
    {
      children: [
        ZONE,
        {
          attr: "type",
          label: "Room Type",
          help: `Different rooms have different stamina costs for going through them:<br/>
                <br/>
                * 1 stamina: road, city, indoor<br/>
                * 2 stamina: trail, field<br/>
                * 3 stamina: forest, desert, water<br/>
                * 4 stamina: mountain<br/>
                <br/>
                In addition, different room types are colored differently in the map.`,
          options: [
            {
              value: "road",
              label: "Road",
            },
            {
              value: "trail",
              label: "Trail",
            },
            {
              value: "city",
              label: "City",
            },
            {
              value: "indoor",
              label: "Indoor",
            },
            {
              value: "field",
              label: "Field",
            },
            {
              value: "mountain",
              label: "Mountain",
            },
            {
              value: "forest",
              label: "Forest",
            },
            {
              value: "desert",
              label: "Desert",
            },
            {
              value: "water",
              label: "Water",
            },
            {
              value: "shallow",
              label: "Shallow Water",
            },
          ],
        },
      ],
    },
    {
      attr: "description",
      label: "Description",
      widget: "textarea",
    },
    {
      attr: 'color',
      label: 'Color',
      help: `Optional. If a value is specified, the room will use it as its css color.`
    },
    {
      attr: "note",
      label: "Notes",
    },
  ],

  ZONE_INFO: [
    {
      attr: "name",
      label: "Name",
    },
  ],

  MOB_TEMPLATE_STATS: [
    {
      row_name: "Points",
      children: [
        {
          attr: "health_max",
          label: "Health",
        },
        {
          attr: "mana_max",
          label: "Mana",
        },
        {
          attr: "exp_worth",
          label: "Experience",
        },
      ],
    },

    {
      row_name: "Attack Attributes",
      children: [
        {
          attr: "attack_power",
          label: "Attack Power",
        },
        {
          attr: "spell_power",
          label: "Spell Power",
        },
        {
          attr: "crit",
          label: "Crit Rating",
        },
      ],
    },

    {
      row_name: "Defense Attributes",
      children: [
        {
          attr: "armor",
          label: "Armor",
        },
        {
          attr: "dodge",
          label: "Dodge",
        },
        {
          attr: "resilience",
          label: "Resilience",
        },
      ],
    },
  ],

  MOB_TEMPLATE_INVENTORY: [
    {
      attr: "item_template",
      label: "Item Template",
      default: "",
      widget: "reference",
      references: "item_template",
      required: true,
    },
    {
      attr: "probability",
      label: "Load Chance",
      default: 100,
    },
    {
      attr: "num_copies",
      label: "Number of Copies",
      default: 1,
    },
  ],

  MOB_TEMPLATE_MERCHANT_INVENTORY: [
    {
      attr: "item_template",
      label: "Item Template",
      default: "",
      widget: "reference",
      references: "item_template",
      required: true,
    },
    {
      attr: "random_item_profile",
      label: "Item Profile",
      default: "",
      widget: "reference",
      references: "random_item_profile",
      required: true,
    },
    {
      attr: "num",
      label: "Copies",
      default: 1,
    },
  ],

  MOB_TEMPLATE_RANDOM_DROPS: [
    {
      attr: "num_items",
      label: "Number of Items",
    },
    {
      attr: "load_specification",
      label: "Load Specification",
      help: `If specified, will restrict the random loads to the specified
            equipment type.`,
      options: [
        {
          value: "",
          label: "All",
        },
        {
          value: "armor_only",
          label: "Armor",
        },
        {
          value: "armor_heavy_only",
          label: "Heavy Armor",
        },
        {
          value: "armor_light_only",
          label: "Light Armor",
        },
        {
          value: "weapon_only",
          label: "Weapon",
        },
        {
          value: "weapon_1h_only",
          label: "1H Weapon",
        },
        {
          value: "weapon_2h_only",
          label: "2H Weapon",
        },
        {
          value: "shield_only",
          label: "Shield",
        },
        {
          value: "weapon_or_shield",
          label: "Weapon or Shield",
        },
      ],
    },
    {
      attr: "chance_imbued",
      label: "Chance to Drop",
      help: `Chance that a random item has to load on instances of this template.`,
    },
    {
      attr: "chance_enchanted",
      label: "Chance Enchanted",
      help: `Enchanted items are 20% stronger than regular imbued random items.`,
    },
  ],

  MOB_TEMPLATE_REACTION: [
    {
      attr: "event",
      label: "Event",
      widget: "select",
      default: "enter",
      options: [
        {
          value: "enter",
          label: "Room is entered",
        },
        {
          value: "say",
          label: "Something is said",
        },
        {
          value: "periodic",
          label: "Time has elapsed",
        },
        {
          value: "load",
          label: "Mob loads",
        },
        {
          value: "connect",
          label: "Player connects",
        },
        {
          value: "death",
          label: "Mob dies",
        },
        {
          value: "receive",
          label: "Item is received",
        },
      ],
    },
    {
      attr: "reaction",
      label: "Reactions",
      widget: "textarea",
      help: `Enter the commands that the mob will respond with, one per line. <br/><br/>
             The commands should be exactly as a mob would execute them, so they should almost always start with either 'say' or 'emote'.`,
    },
    {
      attr: "option",
      label: "Option",
      help: `Configuration options for certain reaction event types.
              <br/><br/>
              * Something is said: the spoken words that will trigger the reaction.<br/>
              * Time has elapsed: how much time between reactions.<br/>
              * Item is received: ID of the template of the received item.<br/>
              <br/>
              Does nothing for other event types.
              `,
    },
    CONDITIONS,
  ],

  ITEM_TEMPLATE_INFO: [
    {
      children: [
        {
          attr: "name",
          label: "Name",
          help: `When naming items, use a lowercase article to start its name,
                 for example 'a sword', rather than something like 'Big Sword'.
                 This ensures that the game generates correct sentences with the
                 item like 'You get a sword from the ground.'`,
        },
        {
          attr: "level",
          label: "Level",
          help: `The level of an item represents its power. For weapons, it 
                determines how much damage is dealt, and for armor how much physical
                damage it absorbs.`,
        },
      ],
    },
    {
      children: [
        {
          attr: "type",
          label: "Item Type",
          widget: "select",
          options: [
            {
              value: "equippable",
              label: "Equippable",
            },
            {
              value: "container",
              label: "Container",
            },
            {
              value: "inert",
              label: "Inert",
            },
            {
              value: "trash",
              label: "Trash",
            },
            {
              value: "quest",
              label: "Quest",
            },
            {
              value: "food",
              label: "Food",
            },
            {
              value: "key",
              label: "Key",
            },
            {
              value: "ammunition",
              label: "Ammunition",
            },
          ],
          help: `The type of the item.<br/>
            - inert: an item that does nothing special.<br/>
            - equippable: weapons or armor meant that can be worn.<br/>
            - container: bags, chests and items that can contain other items.<br/>
            - trash: a containe items that delete items put into it.<br/>
            - quest: an item used as a quest objective.<br/>
            - food: an item that restores stamina on consumption.<br/>
            - key: an item that opens a door.`,
        },
        {
          attr: "cost",
          label: "Value",
          help: `How much a merchant would buy the item for. Merchants sell items for twice their value.`,
        },
      ],
    },
    {
      attr: "notes",
      label: "Notes",
      widget: "text",
    },
  ],

  ITEM_TEMPLATE_STATS: [
    {
      row_name: "Points",
      children: [
        {
          attr: "health_max",
          label: "HP Max",
        },
        {
          attr: "health_regen",
          label: "HP Regen",
        },
        {
          attr: "mana_max",
          label: "Mana Max",
        },
        {
          attr: "mana_regen",
          label: "Mana Regen",
        },
      ],
    },
    {
      row_name: "Stats",
      children: [
        {
          attr: "strength",
          label: "Strength",
        },
        {
          attr: "constitution",
          label: "Constitution",
        },
        {
          attr: "intelligence",
          label: "Intelligence",
        },
        {
          attr: "dexterity",
          label: "Dexterity",
        },
      ],
    },
    {
      row_name: "Attack Attributes",
      children: [
        {
          attr: "attack_power",
          label: "Attack Power",
        },
        {
          attr: "spell_power",
          label: "Spell Power",
        },
        {
          attr: "crit",
          label: "Crit Rating",
        },
        {
          attr: "",
          label: "",
        },
      ],
    },
    {
      row_name: "Defense Attributes",
      children: [
        {
          attr: "resilience",
          label: "Resilience",
        },
        {
          attr: "dodge",
          label: "Dodge Rating",
        },
        {
          attr: "",
          label: "",
        },
        {
          attr: "",
          label: "",
        },
      ],
    },
  ],

  ZONE_PATH_ROOM: [
    {
      attr: "room",
      label: "Room",
      references: "room",
      widget: "reference",
      context: "zone",
    },
  ],

  ZONE_PATH_DETAILS: [
    {
      attr: "name",
      label: "Name",
      widget: "text",
    },
  ],

  LOADER_INFO: [
    {
      attr: "name",
      label: "Name",
      widget: "text",
    },
    ZONE,
    {
      attr: "description",
      label: "Description",
      widget: "textarea",
    },
    {
      attr: "loader_condition",
      label: "Condition",
    },
  ],

  LOADER_RULE: {
    TARGET_SCHEMAS: {
      room: {
        attr: "target",
        label: "Into Room",
        references: "room",
        widget: "reference",
        context: "zone",
      },
      path: {
        attr: "target",
        label: "Into Path",
        references: "path",
        widget: "reference",
        context: "zone",
      },
      rule: {
        attr: "target",
        label: "Into Output of Rule",
        references: "rule",
        widget: "reference",
        context: "loader",
      },
    },

    TEMPLATE_TYPE_SCHEMA: {
      attr: "template",
      label: "Template",
      widget: "select",
      options: [
        {
          value: "mobtemplate",
          label: "Mob",
        },
        {
          value: "itemtemplate",
          label: "Item",
        },
        {
          value: "transformationtemplate",
          label: "Transformation",
        },
      ],
    },

    TARGET_TYPE_SCHEMA: {
      attr: "target",
      label: "Target",
      widget: "select",
      options: [
        {
          value: "zone",
          label: "Zone",
        },
        {
          value: "room",
          label: "Room",
        },
        {
          value: "path",
          label: "Path",
        },
        {
          value: "rule",
          label: "Rule",
        },
      ],
    },

    TEMPLATE_SCHEMAS: {
      mobtemplate: {
        attr: "template",
        label: "Load Mob",
        references: "mob_template",
        widget: "reference",
      },

      itemtemplate: {
        attr: "template",
        label: "Load Item",
        references: "item_template",
        widget: "reference",
      },

      transformationtemplate: {
        attr: "template",
        label: "Apply Transformation",
        references: "transformation_template",
        widget: "reference",
      },
    },
  },
};
