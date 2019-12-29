import store from "@/store";
import Lookup from "@/components/game/Lookup.vue";
import _ from "lodash";

/*
  Binding for elements that when hovered on will trigger a lookup popup or 
  modal depending on whether one is on mobile or on desktop.
*/
export const interactive = {
  bind: (el, binding, vnode) => {
    // console.log(binding.value);

    // Get the entity being looked up
    const entity = binding.value.target;

    if (!entity) return;

    const onDebouncedMouseover = () => {
      if (store.state.game.is_mobile) return;
      var rect = el.getBoundingClientRect();
      if (
        !store.state.game.lookup ||
        entity.key != store.state.game.lookup.key
      ) {
        store.commit("game/lookup_set", {
          key: entity.key,
          position: {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left
          }
        });
      }
    };

    const onDebouncedMouseout = () => {
      if (store.state.game.is_mobile) return;
      if (!store.state.game.popup_hover) {
        store.commit("game/lookup_clear");
      }
    };

    el.addEventListener("click", () => {
      if (!store.state.game.is_mobile) return;
      store.commit("game/lookup_set", { key: entity.key });
      store.commit("ui/modal_set", {
        component: Lookup,
        options: {
          closeOnOutsideClick: true
        }
      });
    });

    // Mouseover events, one immediate and one debounced
    el.addEventListener("mouseover", () => {
      store.commit("game/hover_entity_set", entity);
    });
    el.addEventListener("mouseover", _.debounce(onDebouncedMouseover, 150));

    // Mouseout events, one immediate and one debounced
    el.addEventListener("mouseout", () => {
      store.commit("game/hover_entity_set", null);
    });
    el.addEventListener("mouseout", _.debounce(onDebouncedMouseout, 150));
  }
};
