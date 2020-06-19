<template>
  <div class="look-room">
    <div
      v-if="message.type === 'affect.death'"
      class="mt-4 color-text-red font-text-regular"
    >
      You have been slain! Rest your weary bones...
    </div>
    
    <div v-if="message.data.penalty" class='font-text-regular color-text-red'>
      {{ message.data.penalty }}
    </div>

    <div v-if="message.type === 'affect.flee.success'" class="mb-4">
      <span v-if="message.data.is_auto"
        >Your health is too low and you flee {{ message.data.direction }}!</span
      >
      <span v-else>You flee {{ message.data.direction }}!</span>
    </div>

    <div>
      <span class='room-name'>{{ room.name }}</span>
      <span class='room-id ml-2 color-text-50' v-if="$store.state.game.player.is_immortal">[ {{ room.id }} ]</span>
    </div>

    <!-- Description -->
    <template v-if="showDescription">
      <template v-if="isLastMessage">
        <div
          class="room-description"
          v-for="(line, index) in descLines"
          :key="index"
        >
          <template v-for="(word, word_index) in line.split(' ')">
            <span
              :key="word_index"
              v-if="isDetail(word)"
              class="interactable"
              @click="onClickDetail(word)"
              >{{ word }}</span
            >
            <span :key="word_index" v-else>{{ word }}</span>
            {{ " " }}
          </template>
        </div>
      </template>
      <template v-else>
        <div
          class="room-description"
          v-for="(line, index) in descLines"
          :key="index"
        >
          {{ line }}
        </div>
      </template>
    </template>

    <div class="room-exits" v-if="exits">{{ exits }}</div>

    <template v-if="room.houses">
      <div v-for="house in room.houses" :key="house.key">
        {{ house.name }}'s house lies
        <template v-if="house.direction == 'up'">above.</template>
        <template v-else-if="house.direction == 'down'">below.</template>
        <template v-else>to the {{ house.direction }}.</template>
      </div>
    </template>

    <div class="room-inventory">
      <div
        class="room-item"
        v-for="item in stackedInventory(room.inventory)"
        :key="item.key"
      >
        <template v-if="isLastMessage">
          <span
            v-interactive="{ target: item }"
            class="interactable"
            :class="[item.quality]"
            @click="onItemClick(item)"
          >
            {{ item.ground_description }}
            <template v-if="item.count && item.count > 1"
              >[{{ item.count }}]</template
            >
          </span>
        </template>
        <template v-else>
          <span>
            {{ item.ground_description }}
            <template v-if="item.count && item.count > 1"
              >[{{ item.count }}]</template
            >
          </span>
        </template>
      </div>
    </div>

    <div class="room-chars">
      <div class="room-char" v-for="char in chars" :key="char.key">
        <template v-if="isLastMessage">
          <LookRoomChar 
            v-interactive="{ target: char }"
            class="interactable"
            :char="char"
            @click="onCharClick(char)"/>

          <!-- <span
            v-interactive="{ target: char }"
            class="interactable"
            @click="onCharClick(char)"
          >
            {{ room_char_desc(char) }}
          </span> -->
        </template>
        <template v-else>
          <LookRoomChar :char="char"/>
          <!-- <span>
            {{ room_char_desc(char) }}
          </span> -->
        </template>
        <span v-if="char.is_invisible" class="ml-2 color-text-50"
          >[invisible]</span
        >
      </div>
    </div>

    <div class="room-actions mt-2" v-if="isLastMessage && room.actions.length">
      <button class='btn-small mr-2' v-for="(action, index) in room.actions" :key="index" @click="onClickRoomAction(action)">{{ action.toUpperCase() }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { DIRECTIONS } from "@/constants.ts";
import { stackedInventory, getTargetInGroup } from "@/core/utils.ts";
import { capfirst } from "@/core/utils.ts";
import LookRoomChar from "./LookRoomChar.vue";

interface Char {
  key: string;
  name: string;
  id: number;
}

interface Room {
  name: string;
  description: string;
  chars: Char[];
  inventory: {}[];
  details: string[];
}

@Component({
  components: {
    LookRoomChar
  }
})
export default class LookRoom extends Vue {
  room: Room;

  @Prop() message!: any;

  constructor() {
    super();
    if (
      this.message.type === "cmd.look.success" ||
      this.message.type === "cmd.jump.success"
    ) {
      this.room = this.message.data.target;
    } else {
      this.room = this.message.data.room;
    }
  }

  get isLastMessage() {
    return this.message === this.$store.state.game.last_viewed_room_message;
  }

  get descLines() {
    if (!this.room.description) return [];
    return this.room.description.split("\n");
  }

  isDetail(word) {
    if (!this.room || !this.room.details) return false;
    const trimmedWord = word.split(/\W+/)[0];
    for (const detail of this.room.details) {
      if (trimmedWord.toLowerCase() === detail.toLowerCase()) return true;
    }
    return false;
  }

  get exits() {
    let exits: string[] = [];
    for (const dir in DIRECTIONS) {
      if (this.room[dir]) {
        exits.push(dir[0].toUpperCase());
      }
    }
    if (exits.length) {
      return `[ exits: ${exits.join(" ")} ]`;
    }
    return "";
  }

  get chars() {
    let chars: Char[] = [];
    for (let char of this.room.chars) {
      if (char.id != this.$store.state.game.player_id) {
        chars.push(char);
      }
    }
    return chars;
  }

  onCharClick(char) {
    if (this.$store.state.game.is_mobile) return;
    const target = getTargetInGroup(char, this.room.chars);
    this.$store.dispatch("game/cmd", `look ${target}`);
  }

  onItemClick(item) {
    if (this.$store.state.game.is_mobile) return;
    const target = getTargetInGroup(item, this.room.inventory);
    if (item.is_container && !item.is_pickable) {
      this.$store.dispatch("game/cmd", `get all ${target}`);
    } else {
      this.$store.dispatch("game/cmd", `get ${target}`);
    }
  }

  onClickDetail(word) {
    const trimmedWord = word.split(/\W+/)[0];
    this.$store.dispatch("game/cmd", `l ${trimmedWord}`);
  }

  onClickRoomAction(action) {
    this.$store.dispatch("game/cmd", action);
  }

  room_char_desc(char) {
    let name = capfirst(char.name);
    if (char.key.split(".")[0] === "player") {
      if (char.title) {
        name += " " + char.title;
      }
    }
    let desc = `${name} is here`;
    if (char.target) {
      desc += `, fighting ${char.target.name}`;
    }
    desc += ".";
    return desc;
  }

  get showDescription() {
    if (
      this.$store.state.game.player_config.room_brief &&
      this.message.type !== "cmd.look.success"
    ) {
      return false;
    }
    return true;
  }

  stackedInventory = stackedInventory;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.look-room {
  .room-name {
    @include font-text-regular;
    color: $color-secondary;
    line-height: 21px;
  }

  .room-description {
    line-height: 21px;
    min-height: 14px;
    color: #ddd;
  }

  .room-description:empty:before {
    content: "\200b";
  }

  .flee-direction {
    margin-bottom: 1em;
  }

  .room-note {
    opacity: 0.5;
  }
}
</style>
