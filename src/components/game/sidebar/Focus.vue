<template>
  <form @submit.prevent="onSubmit">
    <div class="form-group">
      <input v-if="edit_mode == true" v-model="temp_focus" id="sidebarFocus" />
      <input v-else readonly="true" :value="focus" @click="onClickReadonly" ref="readonlyEl" />
    </div>
  </form>
</template>

<script lang='ts' setup>
import { ref, computed, watch, nextTick } from "vue";
import { useStore } from "vuex";

const store = useStore();

const temp_focus = ref<string>("");
const edit_mode = ref<boolean>(false);

const focus = computed(() => store.state.game.player.focus);

watch(() => focus.value, (newFocus: string) => {
  edit_mode.value = false;
  temp_focus.value = newFocus;
});

const onSubmit = () => {
  if (temp_focus.value == focus.value) {
    edit_mode.value = false;
  } else if (temp_focus.value == "") {
    store.dispatch("game/cmd", `focus none`);
  } else if (temp_focus.value != focus.value) {
    store.dispatch("game/cmd", `focus ${temp_focus.value}`);
  }
};

const onClickReadonly = () => {
  edit_mode.value = true;
  nextTick(() => {
    const el = document.getElementById("sidebarFocus");
    el && el.focus();
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.form-group {
  margin: 0;

  input {
    width: 150px;

    &.changed {
      border-color: $color-secondary;
    }
  }
}
</style>