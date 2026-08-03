/**
 * Subclass helpers shared by the HUD panels.
 *
 * These mirror Char.get_subclass and Char.archetypes on the server. The
 * subclass is stored in a free-form 'subclass' mark set by builders, so the
 * value is validated rather than trusted: unknown archetypes, and
 * subclassing into one's own archetype, grant nothing.
 *
 * Keep this in step with advent/models.py if the server rules change.
 */

export const SUBCLASS_ARCHETYPES = ["warrior", "assassin", "mage", "cleric"];

/** The archetype this player has as a subclass, or "" for none. */
export function getSubclass(player: any): string {
  // Classless characters draw from custom world skills and have no
  // archetype to subclass off of.
  if (!player || !player.archetype) return "";

  const marks = player.marks || {};
  const subclass = String(marks.subclass || "").trim().toLowerCase();

  if (!SUBCLASS_ARCHETYPES.includes(subclass)) return "";
  if (subclass === player.archetype) return "";

  return subclass;
}

/**
 * Look a skill up by code across the player's own archetype and, failing
 * that, their subclass.
 *
 * Flex slots and feat selections store only a skill code, with no record of
 * which archetype it came from, so a subclass skill will not be found in the
 * player's own skill set. Without this fallback such a skill is silently
 * dropped from the HUD even though the player has it equipped.
 */
export function findSkillData(
  code: string,
  ownSkills: any,
  subclassSkills: any
): any {
  if (!code) return undefined;
  return (ownSkills && ownSkills[code]) || (subclassSkills && subclassSkills[code]);
}
