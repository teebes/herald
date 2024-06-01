// src/composables/useOutsideClick.ts
/*
  Usage:
  <div ref="elementRef"></div>

  import { onOutsideClick } from '@/composables/onOutsideClick';
  const elementRef = onOutsideClick(() => {
    // Do something
  };
*/

import { onMounted, onBeforeUnmount, ref } from 'vue';

export function onOutsideClick(emitter: () => void) {
  const elementRef = ref<HTMLElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
      emitter();
    }
  };

  onMounted(() => {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return elementRef;
}
