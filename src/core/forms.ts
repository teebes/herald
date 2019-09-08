export interface FormElement {
  attr: string;
  label: string;
  references?: string;
  widget?: "text" | "textarea" | "reference" | "select" | "checkbox";
  context?: string;
  options?: { value: string; label: string }[];
  default?: string | number | boolean;
  create_only?: boolean;
  tooltip?: ""[];
}

// Generic form elements

export const NAME: FormElement = {
  attr: "name",
  label: "Name"
};

export const DESCRIPTION: FormElement = {
  attr: "description",
  label: "Description",
  widget: "textarea"
};

export const ITEM_TEMPLATE: FormElement = {
  attr: "item_template",
  label: "Item Template",
  widget: "reference",
  references: "item_template"
};

export const MOB_TEMPLATE: FormElement = {
  attr: "mob_template",
  label: "Mob Template",
  widget: "reference",
  references: "mob_template"
};

export const ZONE: FormElement = {
  attr: "zone",
  label: "Zone",
  widget: "reference",
  references: "zone"
};

export const DIRECTION: FormElement = {
  attr: "direction",
  label: "Direction",
  options: [
    {
      value: "",
      label: ""
    },
    {
      value: "north",
      label: "North"
    },
    {
      value: "east",
      label: "East"
    },
    {
      value: "south",
      label: "South"
    },
    {
      value: "west",
      label: "West"
    },
    {
      value: "up",
      label: "Up"
    },
    {
      value: "down",
      label: "Down"
    }
  ]
};

// Room Checks

const ROOM_CHECK: FormElement[] = [
  NAME,
  {
    attr: "check",
    label: "Check",
    default: "in_inv",
    options: [
      {
        value: "in_inv",
        label: "In inventory"
      },
      {
        value: "not_in_inv",
        label: "Not in inventory"
      },
      {
        value: "equipped",
        label: "Equipped"
      },
      {
        value: "not_equipped",
        label: "Not equipped"
      },
      {
        value: "mob_is_present",
        label: "Mob is present"
      },
      {
        value: "faction_below",
        label: "Faction below"
      },
      {
        value: "health_below",
        label: "Health below"
      }
    ]
  },
  {
    attr: "prevent",
    label: "Prevent",
    default: "enter",
    options: [
      {
        value: "enter",
        label: "Enter"
      },
      {
        value: "exit",
        label: "Exit"
      }
    ]
  },
  DIRECTION,
  {
    attr: "argument",
    label: "Argument"
  },
  {
    attr: "argument2",
    label: "Argument 2"
  },
  {
    attr: "failure_msg",
    label: "Failure Message"
  }
];

export const BUILDER_FORMS = {
  ITEM_TEMPLATE,
  MOB_TEMPLATE,
  ZONE,
  NAME,
  DESCRIPTION,

  ROOM_CHECK,

  // Builder screens

  ROOM_INFO: [
    {
      attr: "name",
      label: "Name"
    },
    {
      children: [
        { attr: "x", label: "X" },
        { attr: "y", label: "Y" },
        { attr: "z", label: "Z" }
      ]
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
              label: "Road"
            },
            {
              value: "trail",
              label: "Trail"
            },
            {
              value: "city",
              label: "City"
            },
            {
              value: "indoor",
              label: "Indoor"
            },
            {
              value: "field",
              label: "Field"
            },
            {
              value: "mountain",
              label: "Mountain"
            },
            {
              value: "forest",
              label: "Forest"
            },
            {
              value: "desert",
              label: "Desert"
            },
            {
              value: "water",
              label: "Water"
            }
          ]
        }
      ]
    },
    {
      attr: "description",
      label: "Description",
      widget: "textarea"
    },
    {
      attr: "note",
      label: "Notes"
    }
  ],

  ZONE_INFO: [
    {
      attr: "name",
      label: "Name"
    }
  ],

  MOB_TEMPLATE_INFO: [
    {
      children: [
        {
          attr: "name",
          label: "Name",
          help: `If naming a non-proper noun, use a lowercase article to start its name,
             for example 'a rat'. This ensures combat messaged will be properly
             formatted, for example 'You strike a rat.' The article will be
             auto-capitalized when needed.`
        },
        {
          attr: "level",
          label: "Level",
          help: `The level of a mob determines how hard it is to kill and how much 
                 experience it gives.`
        }
      ]
    },
    {
      children: [
        {
          attr: "gender",
          label: "Gender",
          widget: "select",
          options: [
            {
              value: "female",
              label: "Female"
            },
            {
              value: "male",
              label: "Male"
            }
          ]
        },
        {
          attr: "aggression",
          label: "Aggression",
          widget: "select",
          options: [
            {
              value: "passive",
              label: "Passive"
            },
            {
              value: "normal",
              label: "Normal"
            },
            {
              value: "players",
              label: "Players"
            },
            {
              value: "all",
              label: "All"
            }
          ],
          help: `Determines a mob's behavior when you enter its room.
                 <br/><br/>
                 * Passive: mob will never attack (even if provoked).<br/>
                 * Normal: mob will only attack if their faction is at odds with the entering char.<br/>
                 * Players: mob will attack all players.<br/>
                 * All: mob will attack players & other mobs.
                `
        }
      ]
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
              label: "Aberration"
            },
            {
              value: "beast",
              label: "Beast"
            },
            {
              value: "celestial",
              label: "Celestial"
            },
            {
              value: "construct",
              label: "Construct"
            },
            {
              value: "dragon",
              label: "Dragon"
            },
            {
              value: "elemental",
              label: "Elemental"
            },
            {
              value: "fey",
              label: "Fey"
            },
            {
              value: "fiend",
              label: "Fiend"
            },
            {
              value: "giant",
              label: "Giant"
            },
            {
              value: "humanoid",
              label: "Humanoid"
            },
            {
              value: "monstrosity",
              label: "Monstrosity"
            },
            {
              value: "ooze",
              label: "Ooze"
            },
            {
              value: "plant",
              label: "Plant"
            },
            {
              value: "undead",
              label: "Undead"
            }
          ]
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
              label: "Warrior"
            },
            {
              value: "mage",
              label: "Mage"
            },
            {
              value: "cleric",
              label: "Cleric"
            },
            {
              value: "thief",
              label: "Thief"
            }
          ]
        }
      ]
    },
    {
      //row_name: 'Hit Message',
      children: [
        {
          attr: "hit_msg_first",
          label: "Hit Message First Person"
        },
        {
          attr: "hit_msg_third",
          label: "Hit Message Third Person"
        }
      ]
    },
    {
      attr: "notes",
      label: "Notes"
    }
    // {
    //   children: [
    //     {
    //       attr: "use_abilities",
    //       label: "Use Abilities",
    //       widget: "checkbox"
    //     }
    //   ]
    // }
  ],

  MOB_TEMPLATE_STATS: [
    {
      row_name: "Points",
      children: [
        {
          attr: "health_max",
          label: "Health"
        },
        {
          attr: "mana_max",
          label: "Mana"
        },
        {
          attr: "exp_worth",
          label: "Experience"
        }
      ]
    },

    {
      row_name: "Attack Attributes",
      children: [
        {
          attr: "attack_power",
          label: "Attack Power"
        },
        {
          attr: "spell_power",
          label: "Spell Power"
        },
        {
          attr: "crit",
          label: "Crit Rating"
        }
      ]
    },

    {
      row_name: "Defense Attributes",
      children: [
        {
          attr: "armor",
          label: "Armor"
        },
        {
          attr: "dodge",
          label: "Dodge"
        },
        {
          attr: "resilience",
          label: "Resilience"
        }
      ]
    }
  ],

  MOB_TEMPLATE_INVENTORY: [
    {
      attr: "item_template",
      label: "Item Template",
      default: "",
      widget: "reference",
      references: "item_template",
      required: true
    },
    {
      attr: "probability",
      label: "Load Chance",
      default: 100
    },
    {
      attr: "num_copies",
      label: "Number of Copies",
      default: 1
    }
  ],

  MOB_TEMPLATE_MERCHANT_INVENTORY: [
    {
      attr: "item_template",
      label: "Item Template",
      default: "",
      widget: "reference",
      references: "item_template",
      required: true
    },
    {
      attr: "random_item_profile",
      label: "Item Profile",
      default: "",
      widget: "reference",
      references: "random_item_profile",
      required: true
    },
    {
      attr: "num",
      label: "Copies",
      default: 1
    }
  ],

  MOB_TEMPLATE_RANDOM_DROPS: [
    {
      attr: "num_items",
      label: "Number of Items"
    },
    {
      attr: "load_specification",
      label: "Load Specification",
      help: `If specified, will restrict the random loads to the specified
            equipment type.`,
      options: [
        {
          value: "",
          label: "All"
        },
        {
          value: "armor_only",
          label: "Armor"
        },
        {
          value: "armor_heavy_only",
          label: "Heavy Armor"
        },
        {
          value: "armor_light_only",
          label: "Light Armor"
        },
        {
          value: "weapon_only",
          label: "Weapon"
        },
        {
          value: "weapon_1h_only",
          label: "1H Weapon"
        },
        {
          value: "weapon_2h_only",
          label: "2H Weapon"
        },
        {
          value: "shield_only",
          label: "Shield"
        },
        {
          value: "weapon_or_shield",
          label: "Weapon or Shield"
        }
      ]
    },
    {
      attr: "chance_imbued",
      label: "Chance to Drop",
      help: `Chance that a random item has to load on instances of this template.`
    },
    {
      attr: "chance_enchanted",
      label: "Chance Enchanted",
      help: `Enchanted items are 20% stronger than regular imbued random items.`
    }
  ],

  MOB_TEMPLATE_REACTION: [
    {
      attr: "event",
      label: "Event",
      widget: "select",
      options: [
        {
          value: "enter",
          label: "Room is entered"
        },
        {
          value: "say",
          label: "Something is said"
        },
        {
          value: "periodic",
          label: "Time has elapsed"
        },
        {
          value: "load",
          label: "Mob loads"
        },
        {
          value: "connect",
          label: "Player connects"
        },
        {
          value: "receive",
          label: "Item is received"
        }
      ]
    },
    {
      attr: "reaction",
      label: "Reaction",
      widget: "textarea"
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
              `
    }
  ],

  MOB_TEMPLATE_FACTION: [
    {
      attr: "faction",
      label: "Faction",
      references: "faction",
      widget: "reference"
    },
    {
      attr: "value",
      label: "Value",
      default: "0"
    }
  ],

  ITEM_TEMPLATE_INFO: [
    {
      children: [
        {
          attr: "name",
          label: "Name"
        },
        {
          attr: "level",
          label: "Level"
        }
      ]
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
              label: "Equippable"
            },
            {
              value: "container",
              label: "Container"
            },
            {
              value: "inert",
              label: "Inert"
            },
            {
              value: "trash",
              label: "Trash"
            },
            {
              value: "quest",
              label: "Quest"
            },
            {
              value: "food",
              label: "Food"
            },
            {
              value: "key",
              label: "Key"
            }
          ]
        },
        {
          attr: "cost",
          label: "Cost"
        }
      ]
    },
    {
      attr: "notes",
      label: "Notes",
      widget: "text"
    }
  ],

  ITEM_TEMPLATE_STATS: [
    {
      row_name: "Points",
      children: [
        {
          attr: "health_max",
          label: "HP Max"
        },
        {
          attr: "health_regen",
          label: "HP Regen"
        },
        {
          attr: "mana_max",
          label: "Mana Max"
        },
        {
          attr: "mana_regen",
          label: "Mana Regen"
        }
      ]
    },
    {
      row_name: "Stats",
      children: [
        {
          attr: "strength",
          label: "Strength"
        },
        {
          attr: "constitution",
          label: "Constitution"
        },
        {
          attr: "intelligence",
          label: "Intelligence"
        },
        {
          attr: "dexterity",
          label: "Dexterity"
        }
      ]
    },
    {
      row_name: "Attack Attributes",
      children: [
        {
          attr: "attack_power",
          label: "Attack Power"
        },
        {
          attr: "spell_power",
          label: "Spell Power"
        },
        {
          attr: "crit",
          label: "Crit Rating"
        },
        {
          attr: "",
          label: ""
        }
      ]
    },
    {
      row_name: "Defense Attributes",
      children: [
        {
          attr: "resilience",
          label: "Resilience"
        },
        {
          attr: "dodge",
          label: "Dodge Rating"
        },
        {
          attr: "",
          label: ""
        },
        {
          attr: "",
          label: ""
        }
      ]
    }
  ],

  ITEM_TEMPLATE_EQUIPMENT: [
    {
      children: [
        {
          attr: "equipment_type",
          label: "Equipment Type",
          widget: "select",
          options: [
            {
              value: "weapon_1h",
              label: "1H Weapon"
            },
            {
              value: "weapon_2h",
              label: "2H Weapon"
            },
            {
              value: "shield",
              label: "Shield"
            },
            {
              value: "head",
              label: "Head"
            },
            {
              value: "body",
              label: "Body"
            },
            {
              value: "arms",
              label: "Arms"
            },
            {
              value: "hands",
              label: "Hands"
            },
            {
              value: "waist",
              label: "Waist"
            },
            {
              value: "legs",
              label: "Legs"
            },
            {
              value: "feet",
              label: "Feet"
            }
          ]
        },
        {}
        // {
        //   attr: "quality",
        //   label: "Quality",
        //   widget: "select",
        //   options: [
        //     {
        //       value: "normal",
        //       label: "Normal"
        //     },
        //     {
        //       value: "imbued",
        //       label: "Imbued"
        //     },
        //     {
        //       value: "enchanted",
        //       label: "Enchanted"
        //     }
        //   ]
        // }
      ]
    },
    {
      row_name: "hit message",
      children: [
        {
          attr: "hit_msg_first",
          label: "First Person"
        },
        {
          attr: "hit_msg_third",
          label: "Third Person"
        }
      ]
    }
  ],

  ZONE_PATH_ROOM: [
    {
      attr: "room",
      label: "Room",
      references: "room",
      widget: "reference",
      context: "zone"
    }
  ],

  ZONE_PATH_DETAILS: [
    {
      attr: "name",
      label: "Name",
      widget: "text"
    }
  ],

  LOADER_INFO: [
    {
      attr: "name",
      label: "Name",
      widget: "text"
    },
    ZONE,
    {
      attr: "description",
      label: "Description",
      widget: "textarea"
    },
    {
      attr: "loader_condition",
      label: "Condition"
    }
  ],

  LOADER_RULE: {
    TARGET_SCHEMAS: {
      room: {
        attr: "target",
        label: "Into Room",
        references: "room",
        widget: "reference",
        context: "zone"
      },
      path: {
        attr: "target",
        label: "Into Path",
        references: "path",
        widget: "reference",
        context: "zone"
      },
      rule: {
        attr: "target",
        label: "Into Output of Rule",
        references: "rule",
        widget: "reference",
        context: "loader"
      }
    },

    TEMPLATE_TYPE_SCHEMA: {
      attr: "template",
      label: "Template",
      widget: "select",
      options: [
        {
          value: "mobtemplate",
          label: "Mob"
        },
        {
          value: "itemtemplate",
          label: "Item"
        },
        {
          value: "transformationtemplate",
          label: "Transformation"
        }
      ]
    },

    TARGET_TYPE_SCHEMA: {
      attr: "target",
      label: "Target",
      widget: "select",
      options: [
        {
          value: "zone",
          label: "Zone"
        },
        {
          value: "room",
          label: "Room"
        },
        {
          value: "path",
          label: "Path"
        },
        {
          value: "rule",
          label: "Rule"
        }
      ]
    },

    TEMPLATE_SCHEMAS: {
      mobtemplate: {
        attr: "template",
        label: "Load Mob",
        references: "mob_template",
        widget: "reference"
      },

      itemtemplate: {
        attr: "template",
        label: "Load Item",
        references: "item_template",
        widget: "reference"
      },

      transformationtemplate: {
        attr: "template",
        label: "Apply Transformation",
        references: "transformation_template",
        widget: "reference"
      }
    }
  }
};
