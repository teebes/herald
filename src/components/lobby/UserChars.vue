<template>
  <div class="world-chars-region">
    <CreateChar v-if="newCharacter" :world="world" @charcreated="onCharCreated" />
    <div class="world-chars" v-else>
      <div class="world-chars-title">YOUR CHARACTERS</div>

      <div class="world-chars-container mt-8">
        <div v-for="char in chars" :key="char.id" class="char-display panel panel-shadow">
          <div class="more-actions hover" @click="onClickMoreActions(char.id)">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>

          <UserCharActions
            :player="char"
            v-if="more_actions[char.id]"
            @close="onCloseCharActions"/>

          <div class="char-name">
            {{ char.name }}
            <span v-if="char.is_immortal" class="color-text-50 ml-2">[ Builder ]</span>
            <span v-if="world.is_multiplayer && !char.world_is_multi" class='color-text-50 ml-2'>[ SPW ]</span>
          </div>
          <div class="char-info" v-if="world.allow_combat">{{ charInfo(char) }}</div>
          <div class="enter-world">
            <button
              class="btn-small play-as"
              @click="onTransfer(char)"
              v-if="char.can_transfer && !user.is_temporary"
            >TRANSFER {{ char.name }}</button>
            <button class="btn-small play-as" @click="onEnter(char)" v-else>PLAY AS {{ char.name }}</button>
          </div>
        </div>
        <button class="btn-add new-character" @click="onClickCreateChar()">CREATE NEW CHARACTER</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { capfirst } from "@/core/utils";
import CreateChar from "./CreateChar.vue";
import UserCharActions from "./UserCharActions.vue";


const store = useStore();
const route = useRoute();
const router = useRouter();

const chars = computed(() => store.state.lobby.chars);
const world = computed(() => store.state.lobby.world);
const user = computed(() => store.state.auth.user);
const newCharacter = computed(() => store.state.lobby.create_character);

let more_actions = ref({});

onMounted(async () => {
  if (route.query.create) {
    store.commit("lobby/create_character_set", true);
  }
});


const charInfo = (char) => {
  if (char.core_faction) {
    return `${capfirst(char.core_faction)} ${char.archetype}, level ${char.level}`;
  }
  return `${capfirst(char.gender)} ${char.archetype}, level ${char.level}`;
}

const onCharCreated = () => {
  store.commit("lobby/create_character_set", false);
}

const onEnter = (char) => {
  store.dispatch('game/request_enter_world', {
      player_id: char.id,
      world_id: route.params.world_id
    });
}

const onTransfer = async (char) => {
  router.push({
    name: 'lobby_world_transfer',
    params: {
      player_id: char.id,
      world_id: route.params.world_id,
    },
  });
}

const  onClickCreateChar = () => {
  store.commit("lobby/create_character_set", true);
}

const onClickMoreActions = (char_id) => {
    if (more_actions.value[char_id]) {
      more_actions.value = {};
    } else {
      more_actions.value = {};
      more_actions.value[char_id] = true;
    }
  }

const onCloseCharActions = () => {
    more_actions.value = {};
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.world-chars-region {
  padding-top: 50px;
  margin-bottom: 150px;

  // Your characters
  .world-chars {
    .world-chars-title {
      @include font-title-regular;
      color: $color-secondary;
      letter-spacing: 1.5px;
      font-size: 15px;
      line-height: 18px;
      // margin-bottom: 27px;
    }

    .world-chars-container {
      justify-content: space-between;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .char-display {
        margin-bottom: 50px;
        flex-basis: 47%;
        position: relative;

        .more-actions {
          position: absolute;
          right: 8px;
          top: 0;

          .dot {
            height: 3px;
            width: 3px;
            background-color: $color-text-half;
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
          }

          &:hover {
            .dot {
              background-color: $color-primary;
            }
          }
        }

        .expanded-actions {
          position: absolute;
          right: -10px;
          top: 25px;
          border: 1px solid #333;
          border-top: 0px;
          background: #222;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
        }

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
          text-transform: uppercase;
        }
      }

      .create-character {
        margin-top: 12px;
      }

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
