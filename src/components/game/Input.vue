<template>
  <div id="input">
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <input
          id="console-input"
          type="text"
          v-model="input"
          @blur="onBlur"
          @focus="onFocus"
          @keydown.tab="onTab"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

const shiftKey = 16,
  leftArrow = 37,
  upArrow = 38,
  rightArrow = 39,
  downArrow = 40;

const store = useStore();

const input = ref("");
const shiftDown = ref(false);
const focused = ref(false);

const communicationCommands = [
  'CHAT', 'CHA', 'CH', 'TELL', 'TEL', 'TE', 'REPLY', 'REPL', 'REP', 'SAY', 'SA',
  'CCHAT', 'CCHA', 'CCH', 'CC', 'GOSSIP', 'GOSSI', 'GOSS', 'GOS', 'GO'
];

let last_sent = '';
const onSubmit = () => {

  let user_input = '';

  if (input.value) {
    user_input = input.value;

    const first_token = user_input.split(' ')[0].toUpperCase();
    if (!communicationCommands.includes(first_token)) {
      last_sent = user_input
    }
  } else if (last_sent) {
    user_input = last_sent;
  }

  if (user_input) {
    store.dispatch("game/cmd", user_input);
  }

  input.value = '';
};

const onKeyUp = (event: KeyboardEvent) => {
  if (event.which === shiftKey) shiftDown.value = false;
};

const onKeyDown = (event: KeyboardEvent) => {
  event.stopPropagation();

  if (store.state.ui.modal.is_open) {
    return;
  }

  if (event.which === shiftKey) shiftDown.value = true;

  let direction;
  if (input.value && focused.value) return;

  if (shiftDown.value) {
    if (event.which === upArrow) direction = "up";
    else if (event.which === downArrow) direction = "down";
    else return;
  } else {
    if (event.which === leftArrow) direction = "west";
    else if (event.which === upArrow) direction = "north";
    else if (event.which === rightArrow) direction = "east";
    else if (event.which === downArrow) direction = "south";
    else return;
  }

  if (direction) {
    event.preventDefault();
    store.dispatch("game/cmd", direction);
  }
};

const onBlur = () => {
  shiftDown.value = false;
  focused.value = false;
};

const onFocus = () => {
  shiftDown.value = false;
  focused.value = true;
};

const onTab = (event: KeyboardEvent) => {
  if (!input.value) {
    return;
  }

  event.preventDefault();

  const tokens = input.value.split(/\s+/);
  const lastToken = tokens[tokens.length - 1].toLowerCase();

  // If there's only one word in the input bar, then assume a combat command
  // is being tab-completed
  if (tokens.length === 1) {
    const archetypeSkills = store.state.game.world.skills[store.state.game.player.archetype];
    let skills = archetypeSkills.core.slice();
    const flexSkills = store.state.game.player.skills.flex;
    for (const flexSkill of flexSkills) {
      if (flexSkill) {
        skills.push(flexSkill);
      }
    }

    for (const skill of skills) {
      if (skill.match("^" + lastToken)) {
        input.value = skill;
        return;
      }
    }
    return;
  }

  // Otherwise, assume we are trying to target a mob, an item in the room,
  // or an item in the player's inventory .

  // Add the room's characters
  let things = store.state.game.room.chars || [];
  // Add the player's inventory
  things = things.concat(store.state.game.player.inventory);
  // Add the room's inventory
  things = things.concat(store.state.game.room.inventory);

  let replacement;
  for (const thing of things) {
    const keywords = thing.keywords.split(/\s+/);
    for (let keyword of keywords) {
      keyword = keyword.toLowerCase();
      if (keyword.match("^" + lastToken)) {
        replacement = keyword;
        break;
      }
    }
    if (replacement) break;
  }

  if (replacement) {
    tokens.splice(tokens.length - 1, 1, replacement);
    input.value = tokens.join(" ");
  }
};

onMounted(() => {
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("keydown", onKeyDown);
  const inputEl = document.getElementById("console-input") as HTMLElement;
  inputEl.focus();
});

onBeforeUnmount(() => {
  window.removeEventListener("keyup", onKeyUp);
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<style lang="scss">
</style>