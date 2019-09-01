<template>
  <div>
    <p>
      A number of formulas depend on a variable called L, for
      <em>'Level Factor'</em>, which increases with levels. It is calculated as:
    </p>

    <p class="formula">L = 5.5 * 1.1 ^ level</p>

    <p>The formula is adjusted to taper off above level 15 in order to reduce stratification and ensure that players can take part in higher-level content without necessarily being at the level cap. Here are a few L breakpoints:</p>

    <ul class="list">
      <li>level &nbsp;1 - 6.1</li>
      <li>level &nbsp;5 - 8.9</li>
      <li>level 10 - 14.3</li>
      <li>level 15 - 23.0</li>
      <li>level 20 - 30.7</li>
    </ul>

    <h2>Player Damage</h2>

    <p>Physical Damage:</p>

    <p class="formula">damage = weapon damage + attack power / 16</p>

    <p>In other words, increasing your attack power by 16 will do 1 more damage every physical attack.</p>

    <p>Magical Damage:</p>

    <p class="formula">magical damage = spell power / 10</p>

    <p>In other words, increasing your spell power by 10 will deal or heal 1 damage.</p>

    <p>
      <em>Note</em>: wielding a two-handed weapon increases attack power and spell power by 50%.
    </p>

    <h2>Weapon Damage</h2>

    <p>Damage for 1-handed weapons:</p>

    <p class="formula">1H damage = L / 2</p>

    <p>Damage for 2-handed weapons:</p>

    <p class="formula">2H damage = 1.5 * L / 2</p>

    <p>Enchanted weapons get another 1.2x bonus damage per attack.</p>

    <h2>Armor</h2>

    <p>
      Non-weapon equipped items can give armor to the wearer when worn. How much armor depends on the L value as well as another called S, for
      <em>'Slot Constant'</em>, which is 1.25x for head, body &amp; legs items and 1x for shield, arms hands, waist and feet.
    </p>

    <p class="formula">armor = L * S</p>

    <p>Enchanted items give an extra 1.2x armor.</p>

    <h2>Shields</h2>

    <p>Shields reduce all damage taken (resilience) by 25%. In addition, they provide more armor than regular equipment, their armor value being:</p>

    <p class="formula">Regular shield armor = L * 1.25 * 8</p>
    <p class="formula">Heavy shields armor = L * 1.25 * 12</p>

    <p>When wearing a shield, a character can only wield 1-handed weapons.</p>

    <h2>Basic Attributes</h2>

    <p class="defined-item">
      <em>Health</em>
    </p>
    <p
      class="item-definition"
    >Your life points. You die when it reaches 0. Regenerates at 1% per second standing and 3% per second resting.</p>

    <p class="defined-item">
      <em>Stamina</em>
    </p>
    <p
      class="item-definition"
    >your movement points. You can't move when it reaches 0. Regenerates at 1% per second standing and 3% per second resting.</p>

    <p class="defined-item">
      <em>Mana</em>
    </p>
    <p
      class="item-definition"
    >your magic points. Some classes consume mana when using abilities. Regenerates at 1% per second standing and 3% per second resting.</p>

    <p class="defined-item">
      <em>Glory</em>
    </p>
    <p
      class="item-definition"
    >When you kill an enemy player, you receive 1/5th of their glory points, for a minimum of 1.</p>

    <h2>Stats</h2>

    <p class="defined-item">
      <em>Attack Power</em> - AP
    </p>
    <p class="item-definition">Determines physical damage: AP / 16 = 1 damage</p>

    <p class="defined-item">
      <em>Spell Power</em> - SP
    </p>
    <p class="item-definition">Determines magical damage: SP / 10 = 1 spell damage</p>

    <p class="defined-item">
      <em>Crit</em>
    </p>
    <p class="item-definition">Chance to score a critical hit, which deals 1.5x damage.</p>

    <p class="defined-item">
      <em>Dodge</em>
    </p>
    <p class="item-definition">Chance to dodge a physical blow. Magical attacks cannot be dodged.</p>

    <p class="defined-item">
      <em>Armor</em>
    </p>
    <p class="item-definition">Reduces physical damage taken.</p>

    <p class="defined-item">
      <em>Resilience</em>
    </p>
    <p class="item-definition">Reduces all damage taken.</p>

    <p class="defined-item">
      <em>Constitution</em> - CON
    </p>
    <p class="item-definition">
      Increases health and resilience.
      <br />1 CON = 2 Health, 1 Resilience
    </p>

    <p class="defined-item">
      <em>Strength</em> - STR
    </p>
    <p class="item-definition">
      Increases attack power and health. Primary stat for Warriors, who also gain critical chance with physical attacks.
      <br />1 STR = 1 Health, 1 Attack Power, and for warriors 1 Crit.
    </p>

    <p class="defined-item">
      <em>Dexterity</em> - DEX
    </p>
    <p class="item-definition">
      Increases dodge and critical chance with physical attacks. Primary stat for Assassins, who also gain attack power.
      <br />1 DEX = 1 Dodge, 1 Crit, and for assassins 1 Attack Power.
    </p>

    <p class="defined-item">
      <em>Intelligence</em>- INT
    </p>
    <p class="item-definition">
      Increases spell damage and mana pool. Primary stat for any spellcaster; physical classes get no benefit from Intelligence.
      <br />1 INT = 2 Spell Power, 1 Mana
    </p>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>