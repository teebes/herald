<template>
  <div class="world-card" ref="cardElement">

    <router-link
      :to="{ name: 'lobby_world_details', params: { world_id: world.id } }"
      :class="{ ['world-' + world.id]: true }"
      :style="backgroundImage"
    >
      <div class="overlay">
        <div class="title">{{ world.name.toUpperCase() }}</div>

        <div class="num-characters">{{ world.num_characters }} characters</div>
      </div>
    </router-link>
  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  world: any;
}>();

const cardElement = ref<HTMLElement | null>(null);
const remoteBackgroundReady = ref(false);
let observer: IntersectionObserver | null = null;

const isRemoteBackground = computed(() => {
  return /^https?:\/\//i.test(props.world?.small_background || '');
});

const backgroundImage = computed(() => {
  if (props.world?.small_background
      && (!isRemoteBackground.value || remoteBackgroundReady.value)) {
    return { backgroundImage: `url(${props.world.small_background})` };
  }
  return {};
});

const observeRemoteBackground = () => {
  observer?.disconnect();
  observer = null;
  remoteBackgroundReady.value = false;

  if (!isRemoteBackground.value) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    remoteBackgroundReady.value = true;
    return;
  }

  observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      remoteBackgroundReady.value = true;
      observer?.disconnect();
      observer = null;
    }
  }, { rootMargin: '200px 0px' });

  if (cardElement.value) {
    observer.observe(cardElement.value);
  }
};

onMounted(() => {
  observeRemoteBackground();
});

watch(() => props.world?.small_background, observeRemoteBackground);

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<style lang="scss" scoped>
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";

.world-card {
  width: 370px;
  height: 166px;
  display: block;

  a {
    background: url("@/assets/ui/world-card-horizontal-bg@2x.jpg");
    background-size: 370px 166px;

    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    display: block;

    &:hover {
      cursor: pointer;
      .title {
        color: $color-primary;
        text-decoration: underline;
      }
    }

    .title {
      @include font-title-regular;
      text-align: center;
      font-size: 22px;
      letter-spacing: 1.14px;
      line-height: 27px;
      color: $color-text;
      padding-top: 40px;
    }

    .num-characters {
      // color: $color-text-hex-50;
      color: $color-text-hex-70;
      line-height: 16px;
      font-size: 12px;
      position: absolute;
      bottom: 15px;
      text-align: center;
      width: 100%;
    }

    .overlay {
      // width: 354px;
      // height: 150px;
      // top: 8px;
      // left: 8px;

      width: 95%;
      height: 90%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 5%;
      left: 2.5%;

    }
  }
}
</style>
