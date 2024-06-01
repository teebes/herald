<template>
  <div id="world-create">
    <h2>CREATE NEW WORLD</h2>

    <FormField
      :elementSchema="name_schema"
      v-model="world_name"
      :formErrors="formErrors"
      required="required"
      class='world-name'
    />

    <FormField
      :elementSchema="is_multi_schema"
      v-model="is_multi"
      :formErrors="formErrors"
      required="required"
      class='multiplayer-world'/>

    <button class="btn-medium" @click="create">CREATE</button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import FormField from "@/components/forms/FormField.vue";
import { FormElement } from "@/core/forms.ts";

const store = useStore();
const router = useRouter();

const world_name = ref("A New World");
const is_multi = ref(true);
const formErrors = ref({});

const name_schema: FormElement = {
  attr: "name",
  label: ""
};

const is_multi_schema: FormElement = {
  attr: "is_multiplayer",
  label: "Is Multiplayer",
  widget: "checkbox",
  default: false
};

const create = async () => {
  const world = await store.dispatch("builder/world_create", {
    name: world_name.value,
    is_multiplayer: is_multi.value
  });
  store.commit(
    "ui/notification_set",
    `Successfully created ${world_name.value}`
  );
  router.push({
    name: 'builder_room_index',
    params: {
      world_id: world.id,
      room_id: world.last_viewed_room.id
    }
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";
#world-create {
  max-width: 320px;
  margin: 0 auto;
  margin-top: auto;
  margin-bottom: auto;
  padding-bottom: 40px;

  .form-group.world-name {
    margin-top: 40px;
  }

  .form-group.multiplayer-world {
    margin: 20px 0 0 0;
  }

  button {
    width: 100%;
    margin-top: 40px;
  }
}
</style>