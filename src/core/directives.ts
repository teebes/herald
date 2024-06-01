import store from "@/store";
import Lookup from "@/components/game/lookup/Lookup.vue";
import _ from "lodash";

export const interactive = {
  beforeMount: (el, binding) => {
    const entity = binding.value.target;
    const side = binding.value.side || "left";
    const isLastMessage = binding.value.isLastMessage;

    if (isLastMessage === false) return;
    if (!entity) return;

    const onDebouncedMouseenter = _.debounce((event) => {
      if (!event.target.classList.contains('interactive')) return;
      if (store.state.game.is_mobile) return;
      const rect = el.getBoundingClientRect();
      if (!store.state.game.lookup || entity.key !== store.state.game.lookup.key) {
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
    }, 150);

    const onDebouncedMouseleave = _.debounce((event) => {
      if (!event.target.classList.contains('interactive')) return;
      if (store.state.game.is_mobile) return;
      if (!store.state.game.popup_hover) {
        store.commit("game/lookup_clear");
      }
    }, 150);

    el.addEventListener("click", () => {
      if (!store.state.game.is_mobile) return;
      store.commit("game/lookup_set", { key: entity.key });
      store.commit("ui/modal/open_view", {
        component: Lookup,
        options: {
          closeOnOutsideClick: true,
        },
      });
    });

    el.addEventListener("mouseenter", (event) => {
      if (!event.target.classList.contains('interactive')) return;
      store.commit("game/hover_entity_set", entity);
    });

    el.addEventListener("mouseenter", onDebouncedMouseenter);

    el.addEventListener("mouseleave", (event) => {
      if (!event.target.classList.contains('interactive')) return;
      store.commit("game/hover_entity_set", null);
    });

    el.addEventListener("mouseleave", onDebouncedMouseleave);
  },
};
