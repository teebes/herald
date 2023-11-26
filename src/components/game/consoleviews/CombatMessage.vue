<template>
  <div
    :class="{ grouped: isGrouped, damageDealt: isPositiveOutcome, damageTaken: isNegativeOutcome }"
  >

    <div v-if="!$store.state.game.player_config.combat_brief" class='nonBrief'>{{ messageText }}</div>

    <div v-else class='brief flex'>

      <div class='attack flex-grow'>
        [ {{ message_type }} ]
        {{ capfirst(message.data.actor.keyword) }}
        <span v-if="message.data.outcome === 'dodged'" class='color-text-50'>>|</span>
        <span v-else class='color-text-50'>&gt;</span>
        {{ capfirst(message.data.target.keyword) }}
        <span v-if="message.data.outcome === 'dodged'" class='color-text-30'>(dodge)</span>
        <span v-if="message.data.damage_absorbed" class='color-text-30'>({{ message.data.damage_absorbed }} abs)</span>
      </div>

      <!-- Damage and healing done -->
      <div class='damage'>

        <span class='nowrap' v-if="message.data.is_heal">
          {{ message.data.healing_done }} &nbsp;hp
        </span>

        <span v-else class='nowrap'>
          {{ message.data.damage_taken }} dmg
        </span>
      </div>

      <div class='crit' style='width: 0.5em; text-align: right'><span v-if="message.data.is_crit_hit">!</span></div>
    </div>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { capfirst } from "@/core/utils.ts";

@Component
export default class CombatMessage extends Vue {
  @Prop() message!: any;
  @Prop() previousMessage!: any;
  @Prop() index!: number;

  player_id: number;
  player_key: string;

  capfirst = capfirst;

  constructor() {
    super();
    this.player_id = this.$store.state.game.player_id;
    this.player_key = `player.${this.player_id}`;
  }

  get messageText() {
    let text = this.message.text;
    if (this.message.data.is_crit_hit) {
      text = text.slice(0, text.length - 1) + "!";
    }
    return text;
  }

  get isGrouped() {
    const prevMessage = this.previousMessage;
    if (
      prevMessage &&
      prevMessage.data &&
      prevMessage.data.round_id === this.message.data.round_id
    ) {
      return false;
    }
    return true;
  }

  get isNegativeOutcome() {
    if (this.message.data.target.key === this.$store.state.game.player.key)
      return true;
    return false;
  }

  get isPositiveOutcome() {
    if (
      (this.message.data.actor.key === this.$store.state.game.player.key &&
        this.message.data.outcome === "hit") ||
      (this.message.data.target.key === this.$store.state.game.player.key &&
        this.message.data.outcome === "dodged")
    )
      return true;
    return false;
  }

  get isActor() {
    if (this.message.data.actor.key === this.player_key) return true;
    return false;
  }

  get isTarget() {
    if (this.message.data.target.key === this.player_key) return true;
    return false;
  }

  get isThirdParty() {
    // Returns true if neither the actor nor the target of the action is the recipient of the message
    if (
      this.message.data.actor.key === this.player_key ||
      this.message.data.target.key === this.player_key
    )
      return false;
    return true;
  }

  get actor() {
    if (this.message.data.actor.key === this.player_key) {
      return "you";
    }
    return this.message.data.actor.keyword;
  }

  get target() {
    if (this.message.data.target.key === this.player_key) {
      return "you";
    }
    return this.message.data.target.keyword;
  }

  get message_type() {
    const attack = this.message.data.attack;

    let label;
    const world = this.$store.state.game.world;
    // See if we find a label in the world labels (for regular skills)
    if (world.labels.attacks[attack]) {
      label = world.labels.attacks[attack];
    } else if (world && world.skills && world.skills.custom) {
      // See if we find a label in the custom skills (for custom skills)
      const customSkill = world.skills.custom.definitions[attack];
      if (customSkill) {
        label = customSkill.name;
      }
    }

    return label || "Special Attack";
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.damageTaken {
  color: $color-red;

  .nonBrief {
    @include font-text-regular;
  }
  .brief {
    color: $color-red !important;
  }
}

.damageDealt {
  color: $color-green;
  .nonBrief {
    @include font-text-regular;
  }
  .brief {
    color: $color-green !important;
  }
}
</style>