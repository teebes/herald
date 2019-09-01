<template>
  <div>
<p>There are three playable classes: warrior, mage and cleric. Each class has access at any given time to 5 core skills and 3 flex skills. The 3 flex skills are learned from a larger pool of available skills.</p>

<h2>Warrior</h2>

<p>Classic brawler, the default class for new characters. Easiest to learn, but offers plenty of depth and choices.</p>

<p>It is the only class that can wear heavy armor, and functions well either wielding a two-handed weapon or with a sword &amp; board setup.</p>

<p>Core Skills:</p>

<p class='defined-item'><em>Bash</em> - level 2</p>
<p class='item-definition'>Deal 0.8x attack damage and stun for 2 seconds.<br/>
1.5 second cast. 16 seconds cooldown</p>

<p class='defined-item'><em>Counter</em> - level 3</p>
<p class='item-definition'>Become immune to damage for 2 seconds and reflect 60% of damage that would be taken. <br/>
40 seconds cooldown</p>

<p class='defined-item'><em>Ravage</em> - level 5</p>
<p class='item-definition'>Deal 0.75x attack damage every second for 3 seconds. <br/>
14 seconds cooldown</p>

<p class='defined-item'><em>Stomp</em> - level 9</p>
<p class='item-definition'>Deal damage equal to 20% of base attack power. Can only be cast if the target is stunned. <br/>
10 seconds cooldown</p>

<p class='defined-item'><em>Gut Punch</em> (punch) - level 13</p>
<p class='item-definition'>Punch the target without your off-hand, dazing them for 3 seconds if they are using an ability.<br/>
12 seconds cooldown</p>

<p>Flex Skills:</p>

<p class='defined-item'><em>Crash</em> - level 6</p>
<p class='item-definition'>Deal damage to your opponent equal to 6% of your total health, and lose 4% of your own total health. <br/>
12 seconds cooldown</p>

<p class='defined-item'><em>Cleave</em> - level 6</p>
<p class='item-definition'>Deal 1.4x attack damage to the target and any nearby enemies.<br/>
2 second cast. 10 seconds cooldown</p>

<p class='defined-item'><em>Rage</em> - level 10</p>
<p class='item-definition'>Increase damage done by 30% and damage taken by 10% for 6 seconds.<br/>
30 seconds cooldown</p>

<p class='defined-item'><em>Shield Slam</em> (slam) - level 14</p>
<p class='item-definition'>Slam the target without your shield, dealing damage and stunning them for 3 seconds.<br/>
18 seconds cooldown</p>

<p class='defined-item'><em>Brace</em> - level 16</p>
<p class='item-definition'>Reduce damage taken by 50% for 4 seconds at the cost of 2% stamina for every 1% of health saved. Ends if stamina drops below 15%.<br/>
14 seconds coolown</p>

<p class='defined-item'><em>Smash</em> - level 18</p>
<p class='item-definition'>Take a wide swing with your two-handed weapon, dealing damage and knocking them into an adjacent room.</br>
Costs 20 Stamina. 24 seconds cooldown.</p>


<h2>Mage</h2>

<p>Mages are offensive magic users. They are capable of quick burst damage and crowd control, and typically use two-handed weapons.</p>

<p>Core Skills:</p>

<p class='defined-item'><em>Ice Spikes</em> (spike) - level 1</p>
<p class='item-definition'>Deal 1x spell damage.<br/>
1.65 second cast.</p>

<p class='defined-item'><em>Lightning Torrent</em> (torrent) - level 3</p>
<p class='item-definition'>Deal 0.8x spell damage every second for 3 seconds. <br/>
14 seconds cooldown</p>

<p class='defined-item'><em>Freeze</em> - level 5</p>
<p class='item-definition'>Stun target for 3.5s. Frost Spike deals 2x damage to frozen enemies and removes the effect. <br/>
24 seconds cooldown</p>

<p class='defined-item'><em>Jolt</em> - level 7</p>
<p class='item-definition'>Shock the target, dealing 0.6x spell damage and dazing them for 3 seconds if they are using an ability.<br/>
14 seconds cooldown</p>

<p class='defined-item'><em>Burn</em> - level 9</p>
<p class='item-definition'>Burns the target, dealing 0.5x spell damage and dealing additional 1x spell damage over 8 seconds.<br/>
1.2 second cast. 10 seconds cooldown</p>

<p>Flex Skills:</p>

<p class='defined-item'><em>Sleep</em> - level 6</p>
<p class='item-definition'>Put enemy into a trance for 10 seconds, preventing any action until damage is taken or the magic fades. <br/>
1.75 second cast. 30 seconds cooldown</p>

<p class='defined-item'><em>Innervate</em> - level 6</p>
<p class='item-definition'>Restore 40% of the target's total mana over 8 seconds. <br/>
70 seconds cooldown</p>

<p class='defined-item'><em>Barrier</em> - level 10</p>
<p class='item-definition'>Absorb 2.25x spell damage worth of damage for 12 seconds.<br/>
20 seconds cooldown.</p>

<p class='defined-item'><em>Meteor</em>- level 13</p>
<p class='item-definition'>Calls down a burning meteor onto the target and all nearby enemies, dealing 2.35x spell damage and causing them to burn for an additional 1x spell damage over 8 seconds. Always a critical hit on the primary target.<br/>
5 second cast. 10 seconds cooldown.</p>

<p class='defined-item'><em>Phase Shift</em> (shift) - level 14</p>
<p class='item-definition'>Briefly phase to another plane, becoming immune for 3 seconds.<br/>
40 seconds cooldown.</p>

<p class='defined-item'><em>Flare</em> - level 15</p>
<p class='item-definition'>Blind the target for 4 seconds, rendering their physical attacks useless for the duration.<br/>
36 seconds cooldown.</p>

<p class='defined-item'><em>Combust</em> - level 15</p>
<p class='item-definition'>Deal 0.7 spell damage. If the target is under the effect of Burn, consume it to deal double damage and stun them for 2s. <br/>
0.7 second cast. 14 seconds cooldown.</p>

<h2>Cleric</h2>

<p>Clerics are defensive magic users, and the only class that can heal. They are the most difficult class to go through the lower levels with, or at least the slowest. They typically use two-handed weapons.</p>

<p>Core Skills:</p>

<p class='defined-item'><em>Heal</em> - level 1</p>
<p class='item-definition'>Restore 1.25x spell damage in health to the target. <br/>
1.8 second cast.</p>

<p class='defined-item'><em>Wrack</em> - level 2</p>
<p class='item-definition'>Deal 3x spell damage over 18 seconds. <br/>
4 seconds cooldown</p>

<p class='defined-item'><em>Mend</em> - level 3</p>
<p class='item-definition'>Heal 2.5x spell damage over 20 seconds. <br/>
4 seconds cooldown</p>

<p class='defined-item'><em>Avatar</em> - level 5</p>
<p class='item-definition'>Gain Armor and Attack Power equal to your Spell Power for 10 seconds. <br/>
35 seconds cooldown</p>

<p class='defined-item'><em>Shield</em> - level 7</p>
<p class='item-definition'>Absorb 1.6x spell damage worth of damage for 10 seconds. <br/>
16 seconds cooldown</p>


<p>Flex Skills:</p>

<p class='defined-item'><em>Anathema</em> - level 6</p>
<p class='item-definition'>Deal 0.625x spell damage. If the target is under the effect of Wrack, consume it to deal double damage and stun them for 1.5s.<br/>
1 second cast. 14 seconds cooldown</p>

<p class='defined-item'><em>Ward</em> - level 6</p>
<p class='item-definition'>Reduce damage taken by 50% for 5 seconds.<br/>
26 seconds cooldown.</p>

<p class='defined-item'><em>Hush</em> - level 10</p>
<p class='item-definition'>Silence the target for 5 seconds, rendering them unable to use magic for the duration.<br/>
 42 seconds cooldown</p>

 <p class='defined-item'><em>Purify</em> - level 11</p>
<p class='item-definition'>Remove all negative effects.<br/>
 8 seconds cooldown</p>

<p class='defined-item'><em>Repent</em> - level 15</p>
<p class='item-definition'>Pulse every second for 3 seconds, healing an ally for 1x spell damage or dealing 0.75x spell damage to an enemy."<br/>
25 seconds cooldown.</p>

<p class='defined-item'><em>Compel</em> - level 17</p>
<p class='item-definition'>Compel the enemy to flee to another room and reflect on their sins for 4 seconds or until damage is taken.<br/>
0.5 second cast. 30 seconds cooldown.</p>


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