<template>
  <div class="expanded-actions">
    <div class="expanded-action hover" @click="onClickEditChar">edit</div>
    <div class="expanded-action hover" @click="onClickDeleteChar">delete</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { OutsideClick } from "@/components/builder/Mixins.ts";
import { UI_MUTATIONS } from "@/constants.ts";
import { FormElement } from "@/core/forms.ts";

@Component({
  components: {
  },
})
export default class UserChars extends Mixins(OutsideClick) {

  @Prop() player!: any;
  @Prop() world!: any;

  onClickEditChar() {
    const description: FormElement = {
      attr: "description",
      label: "Description",
      widget: "textarea",
    }

    const schema: FormElement[] = [description];

    const modal = {
      data: {
        description: this.player.description,
        player_id: this.player.id,
        world_id: this.world.id,
      },
      title: `EDIT PLAYER`,
      schema: schema,
      action: "lobby/world_details/char_edit"
    };
    this.$store.commit('lobby/world_details/char_id_set', this.player.id);
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  async onClickDeleteChar() {
    const c = confirm(
      `THIS ACTION CANNOT BE UNDONE. Are you sure you want to delete ${this.player.name}?`
    );
    if (!c) return;

    this.$store.commit('lobby/world_details/char_id_set', this.player.id);
    await this.$store.dispatch(`lobby/world_details/char_delete`, {
      world_id: this.world.id,
      char_id: this.player.id,
    })
  }

  onOutsideClick(event) {
    this.$emit('close');
  }

}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.expanded-action {
  padding: 0px 5px;
  padding-left: 8px;
  border-top: 1px solid #333;
  width: 75px;

  &:hover {
    color: $color-primary;
  }
}

</style>