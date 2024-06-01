<template>
  <div v-if="entity" id="lookup" :class="{ 'lookup-mobile': store.state.game.is_mobile }">
    <component :is="lookupComponent()" :entity="entity" class="lookup" :lookup="lookup"></component>
  </div>
</template>

<script lang='ts' setup>
/*
  Component to display more information about an item or mob that is being
  hovered over (desktop) or clicked on (mobile).
*/
import { computed, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import LookupItem from '@/components/game/lookup/LookupItem.vue';
import LookupChar from '@/components/game/lookup/LookupChar.vue';
import LookupNotFound from '@/components/game/lookup/LookupNotFound.vue';

const store = useStore();

const entity: any = ref(null);

const lookup = computed(() => store.state.game.lookup);

const doLookup = async () => {
  try {
    const resp = await axios.get(`/game/lookup/${lookup.value.key}/`, {
      headers: { 'X-PLAYER-ID': store.state.game.player.id }
    });
    entity.value = resp.data;
  } catch (e) {
    entity.value = 'error';
  }
};

const lookupComponent = () => {
  if (entity.value === 'error') {
    return LookupNotFound;
  }

  const type = entity.value.key.split('.')[0];
  if (type === 'item') {
    return LookupItem;
  }
  return LookupChar;
};

onMounted(() => {
  doLookup();
});

watch(() => lookup.value, async (lookup) => {
  entity.value = null;
  if (lookup) {
    await doLookup();
  }
});
</script>

<style lang="scss">
@import "@/styles/colors.scss";

#lookup {
  width: 300px;
  padding: 10px;
  border: 3px solid $color-background-very-light;
  background: $color-background-light;

  &.lookup-mobile {
    border: 0;
    background: none;
    margin: 20px;

    .lookup {
      padding: 20px;
      background: $color-background-black;
    }
  }
}
</style>