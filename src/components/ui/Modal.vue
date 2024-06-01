<template>
  <div id="modal" :class="extraClasses" @click="clickBackground">
    <component
      class="modal-contents"
      :is="modalComponent"
      v-bind="modalProps"
      @click.stop
      @close="closeModal"
    >
      <component v-if="slotComponent" :is="slotComponent"></component>
    </component>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// const isOpen = computed(() => store.state.ui.modal.isOpen);
const modalComponent = computed(() => store.state.ui.modal.component);
const modalProps = computed(() => store.state.ui.modal.props);
const slotComponent = computed(() => store.state.ui.modal.slot);
const options: any = computed(() => store.state.ui.modal.options);

const closeModal = () => {
  store.commit("ui/modal/close");
}

const onKeyDown = (event) => {
  event.stopPropagation();
  if (event.key === 'Escape') {
    closeModal();
  }
};

const extraClasses = computed(() => {
  const _extraClasses = {};
  if (options.value && options.value.overlayClasses) {
    for (const overlayClass of options.value.overlayClasses) {
      _extraClasses[overlayClass] = true;
    }
  }
  return _extraClasses;
});

onMounted(() => {
  const body = document.body;
  body.style.overflow = 'hidden';
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  const body = document.body;
  body.style.overflow = '';
  window.removeEventListener('keydown', onKeyDown);
});

const clickBackground = () => {
  if (options.value && options.value.closeOnOutsideClick && !store.state.ui.editingField) {
    closeModal();
  }
};
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

    //padding: 0 15px;
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
