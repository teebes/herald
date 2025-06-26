<template>
  <div id="room_flags" v-if="loaded">
    <h2>ROOM CONFIG</h2>

    <h3 class='mb-4'>ROOM FLAGS</h3>

    <div v-for="flag in flags" :key="flag.code">
      <label>
        <input type="checkbox" :checked="flag.value" @input="onChangeFlag(flag.code)" />
        {{ flag.label }}
        <Help :help="flagHelp[flag.code]" v-if="flagHelp[flag.code]"/>
      </label>
    </div>

    <div v-if="store.state.builder.world.builder_info.builder_rank > 2 && has_instances">
      <h3 class="mt-8 mb-4">INSTANCE LINK</h3>

      <p>If a room is linked to an instance, a player will be able to enter it via the 'enter' command.</p>

      <div class="form-group transfer_to">
        <ReferenceField
          :schema="transfer_to_schema"
          v-model="transfer_to"
          :endpoint="transfer_to_endpoint"
          @update="onUpdateTransferTo"/>
      </div>

      <div v-if="transfer_to && transfer_to_world" class="mb-4">
        Links to:
        <a :href="instanceRoomLink(transfer_to_world.id, transfer_to.id)">
          {{ transfer_to.name }}
        </a>
      </div>

      <button class="btn-medium" @click="onSaveInstanceLink">SAVE</button>
    </div>

  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import Help from "@/components/Help.vue";
import ReferenceField from "@/components/forms/ReferenceField.vue";
import { Entity } from "@/core/interfaces.ts";

const route = useRoute();
const router = useRouter();
const store = useStore();

interface RoomFlag {
  code: string;
  label: string;
  value: boolean;
}

const flags = ref<RoomFlag[]>([]);
const transfer_to = ref<Entity | null>(null);
const transfer_to_world = ref<any>(null);
const has_instances = ref(false);
const loaded = ref(false);

onMounted(async () => {
  const world_id = route.params.world_id;
  const room_id = route.params.room_id;

  const flags_promise = axios.get(`/builder/worlds/${world_id}/rooms/${room_id}/flags/`);
  const config_promise = axios.get(`/builder/worlds/${world_id}/rooms/${room_id}/config/`);

  const [flags_resp, config_resp] = await Promise.all([
    flags_promise,
    config_promise]);

  flags.value = flags_resp.data;
  transfer_to.value = config_resp.data.transfer_to;
  transfer_to_world.value = config_resp.data.transfer_to_world;
  has_instances.value = config_resp.data.has_instances;
  loaded.value = true;
});

const onChangeFlag = async (code: string) => {
  const world_id = route.params.world_id;
  const room_id = route.params.room_id;
  for (let flag of flags.value) {
    if (flag.code == code) {
      const resp = await axios.post(`/builder/worlds/${world_id}/rooms/${room_id}/flags/${code}/`);
      flag = resp.data;
    }
  }
};

const flagHelp = {
  workshop: "The 'upgrade' command is available in Workshop rooms, which lets players attempt to upgrade an item's stats.",
  no_roam: "Rooms flagged as No Roam are excluded from the rooms that a wandering mob might load or move into.",
  peaceful: "Characters cannot engage in combat in peaceful rooms.",
  no_quit: "Players cannot quit in No Quit rooms.",
  landmark: "A landmark room is shown on the player's map even if they've never visited it.",
};

const transfer_to_schema = {
  attr: "room",
  label: "Instance Link",
  references: "room",
  widget: "reference",
}

const onUpdateTransferTo = (value) => {
  transfer_to.value = value;
};

const transfer_to_endpoint = `builder/worlds/${store.state.builder.world.id}/instancerooms/`;

const onSaveInstanceLink = async () => {
  const resp = await axios.patch(`/builder/worlds/${route.params.world_id}/rooms/${route.params.room_id}/config/`, {
    transfer_to: transfer_to.value ? transfer_to.value.id : null
  });
  if (resp.status == 200) {
    transfer_to.value = resp.data.transfer_to;
    transfer_to_world.value = resp.data.transfer_to_world;
    store.commit('ui/notification_set', 'Instance link saved.');
  }
};

const instanceRoomLink = (instance_id, room_id) => {
  return router.resolve({
    name: 'builder_room_index',
    params: { world_id: instance_id, room_id: room_id }
  }).href;
};
</script>

<style lang='scss' scoped>
h2 {
  margin-bottom: 20px;
}

div.form-group.transfer_to > .reference-field > .reference-input > div > input,
div.form-group.transfer_to > .reference-field > .reference-input > input {
  width: auto !important;
}
</style>