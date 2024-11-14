<template>
  <div>
    <h2 class="mb-8">BUILDER {{ route.params.builder_id }} ASSIGNMENTS</h2>

    <!-- Add Assignment Button -->
    <div class="add-assignment-button" v-if="!edit_mode">
      <button class="btn-medium" @click="edit_mode = true">ADD ASSIGNMENT</button>
    </div>

    <!-- Create Assignment Tool-->
    <div class="new-builder-assignment" v-if="edit_mode">
      <h3 class="mb-4">ADD BUILDER ASSIGNMENT</h3>
      <div class="form-fields">
        <div class="assignment_type">
          <FormField
            :elementSchema="assignment_type_schema"
            v-model="assignment_type"
            :formErrors="formErrors"/>
        </div>

        <div class="assignment">
          <FormField
            :elementSchema="assignment_schema"
            v-model="assignment_data"
            :formErrors="formErrors"/>
        </div>
      </div>

      <div class="actions">
        <button class="btn-medium" @click="save">SAVE</button>
        <button class="btn-thin" @click="cancel">CANCEL</button>
      </div>
    </div>

    <!-- List of Assignments -->
    <div v-if="assignments_loaded">
      <h3 class="mt-8 mb-4">ASSIGNMENTS</h3>

      <div v-if="assignments_loaded && assignments.length == 0">
        <p>No assignments found.</p>
      </div>
      <div v-else>
        <div v-for="builder_assignment in assignments" :key="builder_assignment.id">
          <div class="builder-assignment">

            {{ assignment_type_name(builder_assignment.assignment) }}:
            <router-link :to="assignment_link(builder_assignment.assignment)" class='ml-2'>
              {{ builder_assignment.assignment.name }}
            </router-link>
            <span class="ml-4">
              [ <button class="btn-thin" @click="delete_assignment(builder_assignment.id)">REMOVE</button> ]
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute, RouteLocationRaw } from "vue-router";
import FormField from "@/components/forms/FormField.vue";
import { Entity } from "@/core/interfaces.ts";


const store = useStore();
const route = useRoute();

const edit_mode = ref(false);
const assignment_type = ref("zone");
const assignment_data = ref<Entity | null>(null);
const formErrors = ref({});

const assignments = ref<any[]>([]);
const assignments_loaded = ref(false);

const endpoint_base = `/builder/worlds/${route.params.world_id}/builders/${route.params.builder_id}/assignments/`;

onMounted(async () => {
  const resp = await axios.get(endpoint_base + '?page_size=100');
  assignments.value = resp.data.results;
  assignments_loaded.value = true;
});

const assignment_type_schema = {
  attr: "assignment_type",
  label: "Assignment Type",
  widget: "select",
  options: [
    { value: "zone", label: "Zone" },
    { value: "room", label: "Room" },
    { value: "item_template", label: "Item Template" },
    { value: "mob_template", label: "Mob Template" },
  ],
};

const assignment_schema = computed(() => {
  return {
    zone: {
      attr: "zone",
      label: "Zone",
      references: "zone",
      widget: "reference",
    },
    room: {
      attr: "room",
      label: "Room",
      references: "room",
      widget: "reference",
    },
    item_template: {
      attr: "item_template",
      label: "Item Template",
      references: "item_template",
      widget: "reference",
    },
    mob_template: {
      attr: "mob_template",
      label: "Mob Template",
      references: "mob_template",
      widget: "reference",
    },
  }[assignment_type.value];
});

const save = async () => {
  if (!assignment_data.value) {
    formErrors.value = { assignment: "Assignment is required." };
    return;
  }
  const resp = await axios.post(endpoint_base, {
    "assignment": assignment_data.value.key,
  });
  if (resp.status == 201) {
    assignments.value.push(resp.data);
    store.commit('ui/notification_set', "Assignment added.");
  }
  edit_mode.value = false;
  assignment_data.value = null;
}

const cancel = () => {
  edit_mode.value = false;
}

const delete_assignment = async (assignment_id) => {
  const resp = await axios.delete(`${endpoint_base}${assignment_id}/`);
  if (resp.status == 204) {
    assignments.value = assignments.value.filter((a) => a.id !== assignment_id);
    store.commit('ui/notification_set', "Assignment removed.");
  }
}

const assignment_link = (assignment) => {
  if (assignment.model_type === 'room') {
    return {
      name: 'builder_room_index',
      params: {
        world_id: route.params.world_id,
        room_id: assignment.id
      }
    } as RouteLocationRaw;
  } else if (assignment.model_type === 'itemtemplate') {
    return {
      name: 'builder_item_template_details',
      params: {
        world_id: route.params.world_id,
        item_template_id: assignment.id
      }
    } as RouteLocationRaw;
  } else if (assignment.model_type === 'mobtemplate') {
    return {
      name: 'builder_mob_template_details',
      params: {
        world_id: route.params.world_id,
        mob_template_id: assignment.id
      }
    } as RouteLocationRaw;
  }
  // Assume it's a zone
  return {
    name: 'builder_zone_index',
    params: {
      world_id: route.params.world_id,
      zone_id: assignment.id
    }
  } as RouteLocationRaw;
}

const assignment_type_name = (assignment) => {
  if (assignment.model_type === 'zone') {
    return "Zone";
  } else if (assignment.model_type === 'room') {
    return "Room";
  } else if (assignment.model_type === 'itemtemplate') {
    return "Item Template";
  } else if (assignment.model_type === 'mobtemplate') {
    return "Mob Template";
  }
}

// Add a watcher so that if the assignment type changes, null out the assignment data
watch(assignment_type, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    assignment_data.value = null;
  }
});
</script>