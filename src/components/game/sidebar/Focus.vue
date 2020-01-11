<template>
  <form @submit.prevent="onSubmit">
    <div class="form-group">
      <input v-if="edit_mode == true" v-model="temp_focus" ref="editEl" />
      <input
        v-else
        readonly="true"
        :value="focus || 'none set'"
        @click="onClickReadonly"
        ref="readonlyEl"
      />
    </div>
  </form>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Focus extends Vue {
  temp_focus: string = "";
  set_focus: string = "";
  edit_mode: boolean = false;

  constructor() {
    super();
    this.temp_focus = this.focus;
  }

  get focus() {
    return this.$store.state.game.player.focus;
  }

  @Watch("focus")
  onFocusChange(newFocus) {
    this.edit_mode = false;
    this.temp_focus = newFocus;
  }

  onSubmit() {
    if (this.temp_focus == this.focus) {
      this.edit_mode = false;
    } else if (this.temp_focus == "") {
      this.$store.dispatch("game/cmd", `focus none`);
    } else if (this.temp_focus != this.focus) {
      this.$store.dispatch("game/cmd", `focus ${this.temp_focus}`);
    }
  }

  onClickReadonly() {
    this.edit_mode = true;
    this.$nextTick(() => {
      const el = this.$refs.editEl as HTMLElement;
      el && el.focus();
    });
  }
}
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