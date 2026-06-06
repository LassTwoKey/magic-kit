import type { Placement, PositioningStrategy, Modifier } from '@popperjs/core';

export interface PopperOptions {
  placement: Placement;
  strategy: PositioningStrategy;
  offset?: number;
  gpuAcceleration?: boolean;
  fallbackPlacements?: Placement[];
  modifiers: Array<Partial<Modifier<any, any>>>;
}
