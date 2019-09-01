<template>
  <div id="world-create">
    <h2>CREATE NEW WORLD</h2>

    <FormField
      :elementSchema="name_schema"
      v-model="world_name"
      :formErrors="formErrors"
      required="required"
    />

    <button class="btn-medium" @click="create">CREATE</button>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { BUILDER_WORLD_INDEX, BUILDER_ROOM_INDEX } from "@/router";
import FormField from "@/components/forms/FormField.vue";
import { BUILDER_FORMS, FormElement } from "@/core/forms.ts";

@Component({
  components: {
    FormField: FormField
  }
})
export default class WorldFrame extends Mixins(Vue) {
  world_name: string = "A New World";
  formErrors: {} = {};

  get name_schema() {
    const schema: FormElement = {
      attr: "name",
      label: ""
    };
    return schema;
  }

  async create() {
    const world = await this.$store.dispatch("builder/world_create", {
      name: this.world_name
    });
    this.$store.commit(
      "ui/notification_set",
      `Successfully created ${this.world_name}`
    );
    this.$router.push({
      name: BUILDER_ROOM_INDEX,
      params: {
        world_id: world.id,
        room_id: world.last_viewed_room.id
      }
    });
  }
}
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

  .form-group {
    margin: 40px 0;
  }

  button {
    width: 100%;
  }
}
</style>