export interface Entity {
  key: string;
  name: string;
  model_type: string;
  id: number;
}

export interface World {
  id: number;
  key: string;
  name: string;
}

export interface Room {
  id: number;
  key: string;
  name: string;
  x: number;
  y: number;
  z: number;
  north: Room;
  east: Room;
  south: Room;
  west: Room;
  up: Room;
  down: Room;
}

export interface Rule {
  id: number;
  key: string;
  order: number;
  num_copies: number;
  template: Entity;
  target: Entity;
}

export interface Map {
  rooms: Room[];
  center: Room;
  selected: Room;
}

export interface ElementListSchema {
  name: string;
  label: string;
}

export interface ElementListFilterItem {
  key: string;
  name: string;
}

export interface ElementListFilterGroup {
  label: string;
  attr: string;
  filter_options: Array<ElementListFilterItem>;
}

export interface MobTemplate {
  id: number;
  name: string;
}

export interface FormElement {
  attr: string;
  label: string;
  widget: "text" | "textarea" | "select";
  options: any;
}
