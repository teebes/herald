<template>
  <div
    :class="{ grouped: isGrouped, damageDealt: isDamageDealt, damageTaken: isDamageTaken }"
  >

    <div v-if="!$store.state.game.player_config.combat_brief">{{ messageText }}</div>

    <div v-else class='brief flex'>

      <!-- [ attack ] -->
      <div class='attack'>
        [ 
          {{ message.data.attack }} 
          
        ]
      </div>

      <!-- targeting -->
      <div class="targeting flex-grow text-center">
        <!-- Healing format -->
        <template v-if="message.data.healing_done">
          <template v-if="isActor && isTarget">self</template>
          <template v-else>
            {{ message.data.actor.keyword }}
            <span class='mr-0'>&gt;</span>
            {{ message.data.target.keyword }}
          </template>
        </template>

        <!-- Damage format -->
        <template v-else>
          <template v-if="isActor">
            self
            <span class='mx-0'>&gt;</span>
            {{ message.data.target.keyword }}
            </template>
          <template v-else-if="isTarget">
            {{ message.data.actor.keyword }}
            <span class='mx-0'>&gt;</span>
            self
          </template>
          <template v-else>
            {{ message.data.actor.keyword }} 
            <span class='mx-0'>&gt;</span>
            {{ message.data.target.keyword }}</template>
        </template>
      </div>

      <!-- Damage and healing done -->
      <div class='damage'>

        <span class='ml-0' v-if="message.data.healing_done">
          {{ message.data.healing_done }} hps
        </span>

        <span v-else class='ml-0'>
          {{ message.data.damage_taken }} dmg 
        </span>        
      </div>

      <div class='crit' style='width: 0.5em; text-align: right'><span v-if="message.data.is_crit_hit">!</span></div>
    </div>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class CombatMessage extends Vue {
  @Prop() message!: any;
  @Prop() previousMessage!: any;
  @Prop() index!: number;

  player_id: number;
  player_key: string;

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

  get isDamageTaken() {
    if (this.message.data.target.key === this.$store.state.game.player.key)
      return true;
    return false;
  }

  get isDamageDealt() {
    if (this.message.data.actor.key === this.$store.state.game.player.key)
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
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

div.brief {
  // word-spacing: 0.5em;
  // width: 100%;
  // max-width: 320px;
  // font-family: "Roboto Mono";
  // font-size: 0.95em;
}

.damageTaken {
  color: $color-red;
  //@include font-text-regular;
}

.damageDealt {
  color: $color-text-70;
  color: $color-green;
}
</style>