import { computed, onBeforeUnmount, ref } from 'vue';

import type { Ref } from 'vue';

interface UseHueDragOptions {
  trackRef: Ref<HTMLElement | undefined>;
  disabled: Ref<boolean>;
  onUpdate: (hue: number) => void;
}

export function useHueDrag(options: UseHueDragOptions) {
  const { trackRef, disabled, onUpdate } = options;

  const isDragging = ref(false);

  const getHue = (event: MouseEvent | TouchEvent) => {
    if (!trackRef.value) return null;

    const rect = trackRef.value.getBoundingClientRect();
    const clientX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;

    return Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 360);
  };

  const onDragging = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const hue = getHue(event);
    if (hue !== null) onUpdate(hue);
  };

  const onDragEnd = () => {
    isDragging.value = false;
    unbindEvents();
  };

  const onTrackMouseDown = (event: MouseEvent) => {
    if (disabled.value) return;
    isDragging.value = true;
    const hue = getHue(event);
    if (hue !== null) onUpdate(hue);
    bindEvents();
  };

  const onTouchStart = (event: TouchEvent) => {
    if (disabled.value) return;
    isDragging.value = true;
    const hue = getHue(event);
    if (hue !== null) onUpdate(hue);
    bindTouchEvents();
  };

  const bindEvents = () => {
    document.addEventListener('mousemove', onDragging);
    document.addEventListener('mouseup', onDragEnd);
  };

  const bindTouchEvents = () => {
    document.addEventListener('touchmove', onDragging, { passive: false });
    document.addEventListener('touchend', onDragEnd);
  };

  const unbindEvents = () => {
    document.removeEventListener('mousemove', onDragging);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragging);
    document.removeEventListener('touchend', onDragEnd);
  };

  onBeforeUnmount(() => {
    unbindEvents();
    document.body.style.userSelect = '';
  });

  return {
    isDragging: computed(() => isDragging.value),
    onTrackMouseDown,
    onTouchStart,
  };
}
