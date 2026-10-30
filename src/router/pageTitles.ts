import type { RouteLocationNormalizedLoaded } from 'vue-router';

const SITE_NAME = 'Written Realms';
const HOME_TITLE = `${SITE_NAME} — Play & Create Text Adventures`;

// Every named view has a readable fallback while its data is loading.
const pageLabels: Record<string, string> = {
  test: 'UI Tests',
  home: HOME_TITLE,
  homedirect: HOME_TITLE,
  about: 'About',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  conduct: 'Code of Conduct',
  styleguide: 'Style Guide',
  login: 'Log In',
  signup: 'Sign Up',
  'forgot-password': 'Forgot Password',
  resetpassword: 'Reset Password',
  confirmemail: 'Confirm Email',
  'core-authorize': 'Sign In to Core',
  lobby: 'Lobby',
  lobby_section: 'Lobby',
  'world-create': 'Create World',
  lobby_world_details: 'World Lobby',
  edeus_unique_bearers: 'Unique Bearers — Edeus',
  lobby_world_transfer: 'Transfer Character',
  game: 'Game',
  lobby_world_complete_signup: 'Complete Sign Up',
  builder_world_index: 'World Editor',
  builder_zone_list: 'Zones',
  builder_mob_template_list: 'Mobs',
  builder_mob_template_details: 'Mob',
  builder_item_template_list: 'Items',
  builder_item_template_details: 'Item',
  builder_world_config: 'World Configuration',
  builder_world_admin: 'World Admin',
  builder_world_admin_instance: 'Instance Admin',
  builder_world_random_profile_list: 'Random Profiles',
  builder_world_transformation_template_list: 'Transformations',
  builder_world_fact_list: 'Facts',
  builder_world_builder_list: 'Builders',
  builder_world_builder_assignment_list: 'Builder Assignments',
  builder_world_player_list: 'Players',
  builder_world_player_details: 'Player',
  builder_world_player_restoration: 'Item Restoration',
  builder_world_faction_list: 'Factions',
  builder_world_faction_rank_list: 'Faction Ranks',
  builder_world_skill_list: 'Skills',
  builder_world_starting_eq_list: 'Starting Equipment',
  builder_world_social_list: 'Socials',
  builder_world_currency_list: 'Currencies',
  builder_zone_index: 'Zone',
  builder_zone_room_list: 'Rooms',
  builder_zone_path_list: 'Paths',
  builder_zone_path_details: 'Path',
  builder_zone_loader_list: 'Loads',
  builder_zone_loader_details: 'Loader',
  builder_zone_quest_list: 'Quests',
  builder_zone_quest_details: 'Quest',
  builder_zone_config: 'Zone Configuration',
  builder_zone_procession_list: 'Processions',
  builder_zone_procession_details: 'Procession',
  builder_room_index: 'Room',
  builder_room_check_list: 'Checks',
  builder_room_action_list: 'Actions',
  builder_room_load_list: 'Loads',
  builder_room_flags: 'Flags',
  builder_room_config: 'Room Configuration',
  builder_room_details_list: 'Details',
  staff_index: 'Staff Panel',
  staff_playing: 'Playing — Staff',
  staff_signups: 'Signups — Staff',
  staff_worlds: 'Worlds — Staff',
  staff_activity: 'Activity — Staff',
  staff_user_info: 'User Details — Staff',
  staff_reviews: 'Reviews — Staff',
  staff_nexus_details: 'Nexus — Staff',
  cryptic: 'Cryptic Puzzle',
};

const lobbySections = new Map([
  ['playing', 'Playing Worlds'],
  ['building', 'Building Worlds'],
  ['reviewed', 'Reviewed Worlds'],
  ['public', 'Public Worlds'],
]);

interface NamedEntity {
  id: string | number;
  name?: string;
}

interface TitleState {
  lobby?: { world?: NamedEntity | null };
  game?: {
    world?: NamedEntity | null;
    transfer_to?: { world_name?: string };
  };
  builder?: {
    world?: NamedEntity | null;
    zone?: NamedEntity | null;
    room?: NamedEntity | null;
    path?: NamedEntity | null;
    worlds?: {
      mob_template?: NamedEntity | null;
      item_template?: NamedEntity | null;
      player?: NamedEntity | null;
    };
    zones?: {
      loader?: NamedEntity | null;
      quest?: NamedEntity | null;
    };
  };
  staff?: { nexus?: NamedEntity | null };
}

type TitleRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'params' | 'path'>;

function matchingName(entity: NamedEntity | null | undefined, id: unknown): string | undefined {
  // Stores may still contain the previous view's data during navigation.
  return entity && id != null && String(entity.id) === String(id)
    ? entity.name?.trim() || undefined
    : undefined;
}

function builderTitle(route: TitleRoute, state: TitleState, label: string): string {
  const { name, params } = route;
  const builder = state.builder;
  const world = matchingName(builder?.world, params.world_id);
  const editor = world ? `${world} Editor` : 'World Editor';

  if (name === 'builder_world_index') return world ? `Edit ${world}` : label;
  if (name === 'builder_world_admin') return world ? `Admin: ${world}` : label;
  if (name === 'builder_world_admin_instance') {
    return `Instance ${params.instance_id} — ${world ? `${world} Admin` : 'World Admin'}`;
  }

  // Only use cached entities once the builder world matches the route as well.
  const room = world && matchingName(builder?.room, params.room_id);
  const zone = world && matchingName(builder?.zone, params.zone_id);
  const entity = world && (
    matchingName(builder?.worlds?.mob_template, params.mob_template_id)
    || matchingName(builder?.worlds?.item_template, params.item_template_id)
    || matchingName(builder?.worlds?.player, params.player_id)
    || matchingName(builder?.path, params.path_id)
    || matchingName(builder?.zones?.loader, params.loader_id)
    || matchingName(builder?.zones?.quest, params.quest_id)
  );

  if (name === 'builder_room_index') return `${room || label} — ${editor}`;
  if (name === 'builder_zone_index') return `${zone || label} — ${editor}`;
  const isEntityDetail = ['mob_template_id', 'item_template_id', 'player_id', 'path_id',
    'loader_id', 'quest_id', 'procession_id'].some(param => params[param]);
  const subject = isEntityDetail ? entity : room || zone;
  return `${label}${subject ? `: ${subject}` : ''} — ${editor}`;
}

export function getPageTitle(route: TitleRoute, state: TitleState): string {
  const name = String(route.name || '');
  if (name === 'home' || name === 'homedirect') return HOME_TITLE;

  let label = pageLabels[name];
  if (name.startsWith('builder_') && label) {
    label = builderTitle(route, state, label);
  } else if (name === 'lobby_section') {
    label = lobbySections.get(String(route.params.section)) || label;
  } else if (name === 'lobby_world_details') {
    const world = matchingName(state.lobby?.world, route.params.world_id);
    if (world) label = `${world} — Text Adventure`;
  } else if (name === 'game') {
    // Follow world transfers, but keep the title stable while walking or fighting.
    label = state.game?.transfer_to?.world_name?.trim() || state.game?.world?.name?.trim() || label;
  } else if (name === 'staff_nexus_details') {
    const nexus = matchingName(state.staff?.nexus, route.params.nexus_id);
    if (nexus) label = `${nexus} — Staff`;
  } else if (route.path === '/staff' || route.path === '/staff/') {
    label = 'Staff Panel';
  } else if (route.path === '/wot' || route.path.startsWith('/wot/')) {
    label = 'Wheel of Time';
  }

  return label ? `${label} | ${SITE_NAME}` : SITE_NAME;
}
