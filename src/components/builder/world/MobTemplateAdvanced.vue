<template>
  <div id="mob-teaching">
    <h3>ADVANCED</h3>

    <div>
      <span class="color-text-70">Merchant profits:</span> {{ template.merchant_profit }}
    </div>

    <button class="btn-thin" @click="editAdvanced">EDIT</button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const template = computed(() => store.state.builder.worlds.mob_template);

const editAdvanced = () => {

  const modal = {
    data: template.value,
    schema: [
      {
        attr: "merchant_profit",
        label: "Merchant Profits",
        help: "How much more this mob will sell an item for than it will buy it for."
      },
    ],
    action: "builder/worlds/mob_template_save"
  }
  store.commit('ui/modal/open_form', modal);
};
</script>
