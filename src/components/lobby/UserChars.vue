<template>
  <div class="world-chars-region">
    <CreateChar
      v-if="newCharacter"
      :world="world"
      @cancelcreate="newCharacter = false"
      @charcreated="onCharCreated"
    />
    <div class="world-chars" v-else>
      <div class="world-chars-title">YOUR CHARACTERS</div>
      <div class="world-chars-container">
        <div v-for="char in chars" :key="char.id" class="char-display">
          <div class="char-name">{{ char.name }}</div>
          <div class="char-info">{{ charInfo(char) }}</div>
          <div class="enter-world">
            <button
              class="btn-small play-as"
              @click="onTransfer(char)"
              v-if="char.can_transfer && !$store.state.auth.user.is_temporary"
            >TRANSFER {{ char.name }}</button>
            <button class="btn-small play-as" @click="onEnter(char)" v-else>PLAY AS {{ char.name }}</button>
          </div>
        </div>
        <button class="btn-add new-character" @click="newCharacter = true">CREATE NEW CHARACTER</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CreateChar from "./CreateChar.vue";
import { capitalize } from "@/core/utils.ts";
import { LOBBY_WORLD_TRANSFER } from "@/router.ts";

@Component({
  components: {
    CreateChar
  }
})
export default class extends Vue {
  @Prop() chars!: {}[];
  @Prop() world!: {};

  newCharacter: boolean = false;

  mounted() {
    if (this.$route.query.create) {
      this.newCharacter = true;
    }
  }

  charInfo(char) {
    return `${capitalize(char.gender)} ${char.archetype}, level ${char.level}`;
  }

  onCharCreated(newCharacter) {
    this.newCharacter = false;
    this.$emit("charcreated", newCharacter);
  }

  async onEnter(char) {
    this.$store.dispatch("game/world_enter", {
      player_id: char.id,
      world_id: this.$route.params.world_id
    });
  }

  async onTransfer(char) {
    this.$router.push({
      name: LOBBY_WORLD_TRANSFER,
      params: {
        player_id: char.id,
        world_id: this.$route.params.world_id
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

@import "@/styles/fonts.scss";

.world-chars-region {
  padding-top: 50px;

  // Your characters
  .world-chars {
    .world-chars-title {
      @include font-title-regular;
      color: $color-secondary;
      letter-spacing: 1.5px;
      font-size: 15px;
      line-height: 18px;
      margin-bottom: 27px;
    }

    .char-display {
      margin-bottom: 50px;

      .char-name {
        @include font-text-regular;
        line-height: 20px;
      }

      .char-info {
        @include font-text-light;
        line-height: 23px;
        color: $color-text-hex-50;
      }

      .play-as {
        margin-top: 15px;
      }
    }

    .create-character {
      margin-top: 12px;
    }
  }

  // New Character
  .new-character {
    .wrapper {
      background: $color-background-light;
      border: 1px solid $color-background-light-border;
      padding: 15px;
      width: 100%;

      .form-title {
        text-align: center;
        width: 100%;
        margin-bottom: 50px;
      }
    }
    .cancel-action {
      @include font-text-light;
      opacity: 0.5;
      width: 100%;
      text-align: center;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>