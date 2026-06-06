import { computed, onBeforeUnmount, ref } from 'vue';

import type { Ref } from 'vue';

interface UseSvDragOptions {
  panelRef: Ref<HTMLElement | undefined>;
  disabled: Ref<boolean>;
  onUpdate: (saturation: number, value: number) => void;
}

export function useSvDrag(options: UseSvDragOptions) {
  const { panelRef, disabled, onUpdate } = options;

  const isDragging = ref(false);

  const getPosition = (event: MouseEvent | TouchEvent) => {
    if (!panelRef.value) return null;

    const rect = panelRef.value.getBoundingClientRect();
    const clientX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
    const clientY = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;

    const saturation = Math.round(
      Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 100
    );
    const value = Math.round(
      (1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))) * 100
    );

    return { saturation, value };
  };

  const onDragging = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const pos = getPosition(event);
    if (pos) onUpdate(pos.saturation, pos.value);
  };

  const onDragEnd = () => {
    isDragging.value = false;
    unbindEvents();
  };

  const onPanelMouseDown = (event: MouseEvent) => {
    if (disabled.value) return;
    isDragging.value = true;
    const pos = getPosition(event);
    if (pos) onUpdate(pos.saturation, pos.value);
    bindEvents();
  };

  const onTouchStart = (event: TouchEvent) => {
    if (disabled.value) return;
    isDragging.value = true;
    const pos = getPosition(event);
    if (pos) onUpdate(pos.saturation, pos.value);
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
    onPanelMouseDown,
    onTouchStart,
  };
}
