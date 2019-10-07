<template>
  <div id="modal" @click="clickBackground" :class="extraClasses">
    <component
      class="modal-contents"
      :is="modalComponent"
      v-bind="modalProps"
      @click.native.stop
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
/*
  The modal gets activated then the $store.state.ui.modal variable
  evaluates to true. When the modal is closed, modal is ''.

  If a modal's data has a 'component' attribute, that component will be
  displayed. Otherwise, it is assumed that EditEntity is used, and in
  this case the modal data will look like this:
  
  {
    title: <form name>,
    action: <vuex action name>,
    data: <optional data (will be copied)>,
    schema: <form schema>,
  }

  Can also be invoked like this:
    const modal = {
      props: {
        description: this.room.description
      },
      component: RoomDescriptionModal
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);

    Additional classes to be applied to the overlay can be specified
    by using the 'options' attribute on the modal object:
    {
      component: <>,
      options: {
        overlayClasses: ["opaque"]
      }
    }

*/

import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import MobTemplateEditInfo from "@/components/builder/MobTemplateEditInfo.vue";
import EditEntity from "@/components/EditEntity.vue";
import MobTemplateReactions from "@/components/builder/MobTemplateReactions.vue";
import {
  BUILDER_MUTATIONS,
  BUILDER_ACTIONS,
  UI_MODALS,
  UI_MUTATIONS
} from "@/constants.ts";
import { BUILDER_FORMS } from "@/core/forms.ts";

@Component
export default class Modal extends Vue {
  get modalComponent() {
    if (this.$store.state.ui.modal.component)
      return this.$store.state.ui.modal.component;
    return EditEntity;
  }

  get modalProps() {
    if (this.$store.state.ui.modal.component)
      return this.$store.state.ui.modal.props;
    return this.$store.state.ui.modal;
  }

  get modal() {
    return this.$store.state.ui.modal;
  }

  get extraClasses() {
    const extraClasses = {};
    if (this.modal && this.modal.options && this.modal.options.overlayClasses) {
      for (const overlayClass of this.modal.options.overlayClasses) {
        extraClasses[overlayClass] = true;
      }
    }

    return extraClasses;
  }

  mounted() {
    const body = document.getElementsByTagName("body")[0];
    body.setAttribute("style", "overflow: hidden");
    window.addEventListener("keydown", this.onKeyDown);
  }

  destroyed() {
    const body = document.getElementsByTagName("body")[0];
    body.setAttribute("style", "");
    window.removeEventListener("keydown", this.onKeyDown);
  }

  clickBackground() {
    if (
      this.modal &&
      this.modal.options &&
      this.modal.options.closeOnOutsideClick &&
      !this.$store.state.ui.editingField
    ) {
      this.closeModal();
    }
  }

  closeModal() {
    this.$store.commit(UI_MUTATIONS.MODAL_CLOSE);
  }

  onKeyDown(event) {
    event.stopPropagation();

    if (event.which === 27) {
      this.closeModal();
    }
  }
}
</script>

<style lang='scss'>
@import "@/styles/colors.scss";

#modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  z-index: 20000;
  &.opaque {
    z-index: 40000;
  }

  .modal-contents {
    background: $color-background;

    border: 10px solid #020202;
    padding: 0 15px;
    box-sizing: border-box;

    min-width: 300px;
    max-width: 760px;
    width: 100%;

    overflow-y: auto;
  }

  &.opaque {
    // meant to completely obscure what's behind
    background: rgba(0, 0, 0, 1);

    .modal-contents {
      background: rgba(0, 0, 0, 1);
    }
  }

  &.save_user {
    .single-form {
      max-width: 400px;
      min-width: 300px;
      padding: 30px;
    }
  }
}
</style>
