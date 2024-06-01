import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export function selectZone() {
  const store = useStore();
  const route = useRoute();

  onMounted(async () => {
    if (!store.state.builder.zone || (store.state.builder.zone.id != route.params.zone_id)) {
      const zone = await store.dispatch('builder/zone_fetch', {
        world_id: route.params.world_id,
        zone_id: route.params.zone_id
      });

      if (!store.state.builder.room || store.state.builder.room.zone.id != route.params.zone_id) {
        store.commit('builder/room_set', zone.center);
      }
    }
  });

  return {}
};