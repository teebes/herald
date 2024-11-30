<template>
  <div
    :class="{ grouped: isGrouped, damageDealt: isPositiveOutcome, damageTaken: isNegativeOutcome }"
  >

    <div v-if="!combat_brief" class='nonBrief'>{{ messageText }}</div>

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

<script lang='ts' setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { capfirst } from "@/core/utils.ts";

const store = useStore();

const props = defineProps<{
  message: any;
  previousMessage: any;
  index: number;
}>();

const player_id = store.state.game.player_id;
const player_key = `player.${player_id}`;

const combat_brief = computed(() => store.state.game.player_config.combat_brief);

const messageText = computed(() => {
  let text = props.message.text;
  if (props.message.data.is_crit_hit) {
    text = text.slice(0, text.length - 1) + "!";
  }
  return text;
});

const isGrouped = computed(() => {
  const prevMessage = props.previousMessage;
  if (prevMessage &&
      prevMessage.data &&
      prevMessage.data.round_id &&
      prevMessage.data.round_id === props.message.data.round_id)
    return true;
  return false;
});


const isNegativeOutcome = computed(() => {
  if (props.message.data.target.key === player_key)
    return true;
  return false;
});

const isPositiveOutcome = computed(() => {
  if (props.message.type === "notification.combat.healing" &&
    props.message.data.target.key === player_key) {
      return true;
    }

  if (
    (props.message.data.actor.key === player_key &&
      props.message.data.outcome === "hit") ||
    (props.message.data.target.key === player_key &&
      props.message.data.outcome === "dodged")
  )
    return true;
  return false;
});

/*
const isActor = computed(() => {
  if (props.message.data.actor.key === player_key) return true;
  return false;
});

const isTarget = computed(() => {
  if (props.message.data.target.key === player_key) return true;
  return false;
});

const isThirdParty = computed(() => {
  if (
    props.message.data.actor.key === player_key ||
    props.message.data.target.key === player_key
  )
    return false;
  return true;
});

const actor = computed(() => {
  if (props.message.data.actor.key === player_key) return "you";
  return props.message.data.actor.keyword;
});

const target = computed(() => {
  if (props.message.data.target.key === player_key) return "you";
  return props.message.data.target.keyword;
});
*/

const message_type = computed(() => {
  const attack = props.message.data.attack;

  if (props.message.data.label && props.message.data.label != "Attack") {
    let label = props.message.data.label;

    if (props.message.data.attack == "customdot") {
      label = label + " (DOT)";
    } else if (props.message.data.attack == "customhot") {
      label = label + " (HOT)";
    }
    return label;
  }

  let label;
  const world = store.state.game.world;
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
});
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