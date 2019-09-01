<template>
  <div class="room-description-modal">
    <div class="description" v-if="description">{{ description }}</div>
    <div class="description" v-else>Room has no description.</div>
    <div class="actions">
      <button class="btn btn-small edit" @click="onEditDesc">EDIT</button>
      <button class="btn btn-small btn-gray close" @click="$emit('close')">CLOSE</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import { UI_MUTATIONS, BUILDER_ACTIONS } from "@/constants";
import { FormElement } from "@/core/forms";

@Component
export default class extends Vue {
  @Prop() description!: string;

  onEditDesc() {
    const schema: FormElement[] = [
      {
        attr: "description",
        label: "Description",
        widget: "textarea"
      }
    ];

    const modal = {
      class: "description-modal",
      data: this.$store.state.builder.room,
      schema: schema,
      action: BUILDER_ACTIONS.ROOM_SAVE
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";

.room-description-modal {
  display: flex;
  flex-direction: column;

  .description {
    flex-grow: 1;
  }

  .actions {
    margin-top: 1em;
    .edit {
      margin-right: 1em;
    }
  }
}
</style>