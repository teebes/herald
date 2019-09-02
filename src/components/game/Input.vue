<template>
  <div id="input">
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <input
          type="text"
          v-model="input"
          v-focus
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

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

const shiftKey = 16,
  leftArrow = 37,
  upArrow = 38,
  rightArrow = 39,
  downArrow = 40;

@Component({
  directives: {
    focus: {
      inserted: el => {
        el.focus();
      }
    }
  }
})
export default class Input extends Vue {
  input: string = "";
  last_sent: string = "";
  shiftDown: boolean = false;
  focused: boolean = false;

  onSubmit() {
    let user_input = "";
    if (this.input) {
      user_input = this.input;
      this.last_sent = this.input;
    } else if (this.last_sent) {
      user_input = this.last_sent;
    }

    user_input && this.$store.dispatch("game/cmd", user_input);

    this.input = "";
  }

  created() {
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("keydown", this.onKeyDown);
  }

  destroyed() {
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyUp(event) {
    if (event.which === shiftKey) this.shiftDown = false;
  }

  onKeyDown(event) {
    event.stopPropagation();

    if (this.$store.state.ui.modal) {
      return;
    }

    if (event.which === shiftKey) this.shiftDown = true;

    let direction;

    if (this.input && this.focused) return;

    if (this.shiftDown) {
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
      this.$store.dispatch("game/cmd", direction);
    }
  }

  onBlur() {
    this.shiftDown = false;
    this.focused = false;
  }

  onFocus() {
    this.shiftDown = false;
    this.focused = true;
  }

  onTab(event) {
    if (!this.input) {
      return;
    }

    // Don't let the browser execute the standard tab behavior if the input
    // has something in it.
    event.preventDefault();

    const tokens = this.input.split(/\s+/),
      lastToken = tokens[tokens.length - 1].toLowerCase();

    // If there's only one word in the input bar, then assume a combat command
    // is being tab-completed
    if (tokens.length === 1) {
      const archetypeSkills = this.$store.state.game.world.skills[
        this.$store.state.game.player.archetype
      ];
      let skills = archetypeSkills.core.slice(0);
      const flexSkills = this.$store.state.game.player.skills.flex;
      for (const flexSkillNum in flexSkills) {
        if (flexSkills[flexSkillNum]) {
          skills.push(flexSkills[flexSkillNum]);
        }
      }

      for (const skill of skills) {
        if (skill.match("^" + lastToken)) {
          this.input = skill;
          return;
        }
      }

      return;
    }

    // Otherwise, assume we are trying to target a mob, an item in the room,
    // or an item in the player's inventory .

    // Add the room's characters
    let things = this.$store.state.game.room.chars || [];
    // Add the player's inventory
    things = things.concat(this.$store.state.game.player.inventory);
    // Add the room's inventory
    things = things.concat(this.$store.state.game.room.inventory);

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
      this.input = tokens.join(" ");
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";

#input {
  padding: 0 20px;
}
</style>