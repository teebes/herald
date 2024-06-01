<template>
  <div class="factions indented">
    <div class="core-faction">
      Core Faction: {{ message.data.core_faction }}
    </div>

    <div class='player-clan' v-if="message.data.clan">
      Player Clan: {{ capfirst(message.data.clan.rank) }} of {{ message.data.clan.name }}
    </div>

    <div
      class="clanned-factions faction-group mt-4"
      v-if="has_clanned_factions"
    >
      <div class="color-text-50 font-text-regular">Clanned Factions</div>
      <div
        v-for="(faction, index) in message.data.clanned_factions"
        :key="index"
      >
        <div @click="clickFaction(faction.code)" class="clanned-faction">
          <span v-if="expanded_factions[faction.code]">-</span>
          <span v-else>+</span>
          Rank {{ faction.rank_number }} {{ faction.name }} -
          {{ faction.rank_name }} [{{ faction.standing }}]
        </div>
        <template v-if="expanded_factions[faction.code]">
          <table class="faction-rank">
            <tbody>
              <tr v-for="rank_data in faction.ranks" :key="rank_data['name']">
                <td
                  :class="{
                    currentRank: isCurrentRank(faction.code, rank_data)
                  }"
                >
                  {{ rank_data["name"] }}
                </td>
                <td class="faction-rank-standing color-text-50">
                  [ {{ rank_data["standing"] }} ]
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
    </div>

    <div
      class="friendly-factions faction-group mt-4"
      v-if="has_friendly_factions"
    >
      <div class="color-text-50 font-text-regular">Friendly Factions</div>
      <div
        v-for="(faction, index) in message.data.friendly_factions"
        :key="index"
      >
        {{ faction.name }} [{{ faction.standing }}]
      </div>
    </div>

    <div
      class="hostile_factions faction-group mt-4"
      v-if="has_hostile_factions"
    >
      <div class="color-text-50 font-text-regular">Hostile Factions</div>
      <div
        v-for="(faction, index) in message.data.hostile_factions"
        :key="index"
      >
        {{ faction.name }} [{{ faction.standing }}]
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { capfirst } from "@/core/utils";

const props = defineProps<{
  message: any;
  distanceToBottom: number;
}>();
const emit = defineEmits(["scrollDown"]);

const expanded_factions = ref({});

const clickFaction = (code: string) => {
  if (!expanded_factions.value[code]) {
    expanded_factions.value[code] = true;
  } else {
    expanded_factions.value[code] = false;
  }
  if (props.distanceToBottom < 5) {
    emit("scrollDown");
  }
};

const isCurrentRank = (faction_code: string, rank_data: any) => {
  if (
    props.message.data.clanned_factions[faction_code].rank_name ===
    rank_data["name"]
  )
    return true;
  return false;
};

const has_friendly_factions = computed(() => {
  return Boolean(Object.keys(props.message.data.friendly_factions).length);
});

const has_hostile_factions = computed(() => {
  return Boolean(Object.keys(props.message.data.hostile_factions).length);
});

const has_clanned_factions = computed(() => {
  return Boolean(Object.keys(props.message.data.clanned_factions).length);
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.clanned-faction {
  &:hover {
    cursor: pointer;
  }
  span {
    width: 0.7em;
    display: inline-block;
  }
}

table.faction-rank {
  margin-left: 20px;

  .faction-rank-standing {
    padding-left: 20px;
  }

  td {
    color: $color-text-hex-50;

    &.currentRank {
      color: inherit;
    }
  }
}
</style>
