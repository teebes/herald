import store from "@/store";
import Lookup from "@/components/game/Lookup.vue";
import _ from "lodash";

/*
  Binding for elements that when hovered on will trigger a lookup popup or
  modal depending on whether one is on mobile or on desktop.
*/
export const interactive = {
  bind: (el, binding, vnode) => {
    // Get the entity being looked up
    const entity = binding.value.target;

    const side = binding.value.side || "left";

    const isLastMessage = binding.value.isLastMessage;
    if (isLastMessage === false) return;

    if (!entity) return;

    const onDebouncedMouseenter = (event) => {
      if (!event.target.classList.contains('interactable')) return;
      if (store.state.game.is_mobile) return;
      var rect = el.getBoundingClientRect();
      if (
        !store.state.game.lookup ||
        entity.key != store.state.game.lookup.key
      ) {
        store.commit("game/lookup_set", {
          key: entity.key,
          side: side,
          position: {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
          },
        });
      }
    };

    const onDebouncedMouseleave = (event) => {
      if (!event.target.classList.contains('interactable')) return;
      if (store.state.game.is_mobile) return;
      if (!store.state.game.popup_hover) {
        store.commit("game/lookup_clear");
      }
    };

    el.addEventListener("click", (event) => {
      if (!store.state.game.is_mobile) return;
      store.commit("game/lookup_set", { key: entity.key });
      store.commit("ui/modal_set", {
        component: Lookup,
        options: {
          closeOnOutsideClick: true,
        },
      });
    });

    // Mouseover events, one immediate and one debounced
    el.addEventListener("mouseenter", (event) => {
      if (!event.target.classList.contains('interactable')) return;
      store.commit("game/hover_entity_set", entity);
    });
    el.addEventListener("mouseenter", _.debounce(onDebouncedMouseenter, 150));

    // Mouseout events, one immediate and one debounced
    el.addEventListener("mouseleave", (event) => {
      if (!event.target.classList.contains('interactable')) return;
      store.commit("game/hover_entity_set", null);
    });
    el.addEventListener("mouseleave", _.debounce(onDebouncedMouseleave, 150));
  },
};
