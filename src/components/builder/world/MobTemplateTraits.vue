<template>
  <div if="mob-traits">
    <h3>TRAITS</h3>
    <div class="color-text-70">
      <p>Mobs can have traits that affect their behavior and abilities.</p>
    </div>

    <div v-if="template.traits" class="color-text-70">
      <p>This mob has the following traits:</p>
      <ul class="list color-text">
        <li v-for="trait in template.traits.split(' ')" :key="trait">{{ trait }}</li>
      </ul>
    </div>

    <button class="btn-thin" @click="editTraits">EDIT</button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const template = computed(() => store.state.builder.worlds.mob_template);

const editTraits = () => {
  const modal = {
    data: template.value,
    schema: [
      {
        label: 'Traits',
        attr: 'traits',
        type: 'text',
        placeholder: 'Enter traits separated by spaces',
        help: `Traits are used to define special abilities and behaviors for mobs.<br/>
        <br/>
        Available traits:<br/>
        * 'tracker' - a tracker mob will chase its target to other rooms within its zone<br/>
        * 'keen' - a keen mob can see through stealth<br/>
        <br/>
        Multiple traits can be added by separating them with spaces, for example: 'tracker keen'.`
      },
    ],
    action: "builder/worlds/mob_template_save"
  }
  store.commit('ui/modal/open_form', modal);
};
</script>