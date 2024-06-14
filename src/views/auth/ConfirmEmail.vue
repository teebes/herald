<template>
  <div></div>
</template>

<script lang='ts' setup>
import { onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

onMounted(() => {
  store.dispatch("auth/confirmemail", {
    code: route.params.code
  });
});
</script>