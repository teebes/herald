import { Component, markRaw } from 'vue';
import { EntityForm } from '@/core/forms.ts';
import EditEntity from '@/components/forms/EditEntity.vue';

interface ModalOptions {
  overlayClasses?: string,
  closeOnOutsideClick?: boolean,
}

interface ModalState {
  isOpen: boolean;
  options?: ModalOptions;
  component?: Component | null;
  props: Record<string, any>;
  slot?: Component | null;
}

const initialState = (): ModalState => {
  return {
    isOpen: false,
    options: {},
    component: null,
    props: {},
    slot: null,
  };
}

const state: ModalState = initialState();

const mutations = {
  open_view: (state, viewInfo) => {
    state.isOpen = true;
    state.component = markRaw(viewInfo.component);
    state.props = viewInfo.props || {};
    state.options = viewInfo.options || {};
  },

  open_form: (state, formData: EntityForm) => {
    // extract the 'slot' option from formData
    const slot = formData.slot;
    delete formData.slot;

    state.isOpen = true;
    state.props = formData;
    state.component = markRaw(EditEntity);
    if (slot) state.slot = markRaw(slot);
  },

  close: (state) => {
    Object.assign(state, initialState());
  }
};

export default {
  state,
  mutations,
  namespaced: true
}