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

<script lang='ts' setup>
import { ref } from "vue";

withDefaults(defineProps<{
  removable: boolean;
}>(), { removable: true });
const emit = defineEmits(['remove', 'save']);

const edit_mode = ref(false);

const edit = () => { edit_mode.value = true; };
const remove = () => { emit('remove'); };
const save = () => { emit('save'); };
const cancel = () => { edit_mode.value = false; };

</script>