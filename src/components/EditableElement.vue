<template>
  <div class="display-mode" v-if="!edit_mode">
    <slot name="display"></slot>

    <div class="actions">
      <button class="btn-thin" @click="edit">EDIT</button>
      <button class="btn-thin" @click="remove" v-if="removable">DELETE</button>
    </div>
  </div>
  <div v-else>
    <slot name="edit"></slot>

    <div class="actions">
      <button class="btn-medium" @click="save">SAVE</button>
      <button class="btn-thin" @click="cancel">CANCEL</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class EditableElement extends Vue {
  edit_mode: boolean = false;

  @Prop({ default: false }) removable!: boolean;

  edit() {
    this.edit_mode = true;
  }

  remove() {
    this.$emit("remove");
  }

  save() {
    this.$emit("save");
  }
  cancel() {
    this.edit_mode = false;
  }
}
</script>