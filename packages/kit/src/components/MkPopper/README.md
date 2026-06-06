# Popper Component

## Overview

The Popper component is a flexible positioning system built on top of [@popperjs/core](https://popper.js.org/). It provides a foundation for creating tooltips, popovers, dropdowns, and other overlay components that need to be positioned relative to a trigger element.

The component consists of four main parts:
- **ElPopper**: The root wrapper component that provides context
- **ElPopperTrigger**: The trigger element that activates the popper
- **ElPopperContent**: The content container that appears in the popper
- **ElPopperArrow**: An optional arrow element pointing to the trigger

## Basic Usage

```vue
<template>
  <el-popper>
    <el-popper-trigger>
      <button>Hover me</button>
    </el-popper-trigger>
    <el-popper-content :visible="visible" placement="top">
      <div>This is the popper content</div>
      <el-popper-arrow />
    </el-popper-content>
  </el-popper>
</template>

<script setup>
import { ref } from 'vue'
import { ElPopper, ElPopperTrigger, ElPopperContent, ElPopperArrow } from '@element-plus/components/popper'

const visible = ref(false)
</script>
```

## Components

### ElPopper

The root component that provides the injection context for child components.

#### Props

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| `role` | Determines how ARIA attributes are distributed | `'dialog' \| 'grid' \| 'group' \| 'listbox' \| 'menu' \| 'navigation' \| 'tooltip' \| 'tree'` | `'tooltip'` |

#### Exposed Properties

- `triggerRef`: Reference to the trigger element
- `popperInstanceRef`: Reference to the Popper.js instance
- `contentRef`: Reference to the popper content element
- `referenceRef`: Reference to the popper reference element
- `role`: The role computed property

### ElPopperTrigger

The trigger component that wraps the element that activates the popper.

#### Props

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| `virtualRef` | Reference element to which the popper is attached | `Measurable` | - |
| `virtualTriggering` | Whether virtual triggering is enabled | `boolean` | `false` |
| `onMouseenter` | Mouse enter event handler | `(e: Event) => void` | - |
| `onMouseleave` | Mouse leave event handler | `(e: Event) => void` | - |
| `onClick` | Click event handler | `(e: Event) => void` | - |
| `onKeydown` | Keydown event handler | `(e: Event) => void` | - |
| `onFocus` | Focus event handler | `(e: Event) => void` | - |
| `onBlur` | Blur event handler | `(e: Event) => void` | - |
| `onContextmenu` | Context menu event handler | `(e: Event) => void` | - |
| `id` | Element ID | `string` | - |
| `open` | Whether the popper is open | `boolean` | `false` |

#### Exposed Properties

- `triggerRef`: Reference to the trigger element

### ElPopperContent

The content component that displays the popper content.

#### Props

##### Core Configuration Props

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| `placement` | Position of the popper | `Placement` | `'bottom'` |
| `offset` | Offset of the popper | `number` | `12` |
| `strategy` | Positioning strategy | `'fixed' \| 'absolute'` | `'absolute'` |
| `boundariesPadding` | Padding from boundaries | `number` | `0` |
| `fallbackPlacements` | Fallback placements if primary placement doesn't fit | `Placement[]` | - |
| `gpuAcceleration` | Enable GPU acceleration | `boolean` | `true` |
| `popperOptions` | Additional Popper.js options | `Partial<Options>` | `{}` |

##### Content Props

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| `visible` | Whether the popper is visible | `boolean` | `false` |
| `effect` | Theme effect | `'light' \| 'dark'` | `'dark'` |
| `enterable` | Whether mouse can enter the popper | `boolean` | `true` |
| `pure` | Pure mode (no styling) | `boolean` | `false` |
| `focusOnShow` | Focus the popper when shown | `boolean` | `false` |
| `trapping` | Enable focus trapping | `boolean` | `false` |
| `loop` | Enable focus loop | `boolean` | `false` |
| `id` | Element ID | `string` | - |
| `style` | Custom style | `StyleValue` | - |
| `className` | Custom class name | `string \| Array \| Object` | - |
| `popperClass` | Popper container class | `string \| Array \| Object` | - |
| `popperStyle` | Popper container style | `StyleValue` | - |
| `referenceEl` | Reference element (overrides trigger) | `HTMLElement` | - |
| `triggerTargetEl` | Trigger target element | `HTMLElement` | - |
| `stopPopperMouseEvent` | Stop mouse events on popper | `boolean` | `true` |
| `virtualTriggering` | Whether virtual triggering is enabled | `boolean` | `false` |
| `zIndex` | Z-index of the popper | `number` | - |
| `ariaLabel` | ARIA label | `string` | - |

##### Arrow Props

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| `arrowOffset` | Arrow offset from edge | `number` | `5` |

#### Events

| Event Name | Description | Parameters |
|------------|-------------|------------|
| `mouseenter` | Mouse enters the popper | `(evt: MouseEvent)` |
| `mouseleave` | Mouse leaves the popper | `(evt: MouseEvent)` |
| `focus` | Popper receives focus | - |
| `blur` | Popper loses focus | - |
| `close` | Popper is closed | - |

### ElPopperArrow

An optional arrow component that points to the trigger element.

#### Props

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| `arrowOffset` | Arrow offset from edge | `number` | `5` |

#### Exposed Properties

- `arrowRef`: Reference to the arrow element

## Placement Options

The `placement` prop accepts the following values from Popper.js:

- `'auto'`
- `'auto-start'`
- `'auto-end'`
- `'top'`
- `'top-start'`
- `'top-end'`
- `'bottom'`
- `'bottom-start'`
- `'bottom-end'`
- `'right'`
- `'right-start'`
- `'right-end'`
- `'left'`
- `'left-start'`
| `'left-end'`

## Advanced Usage

### Custom Positioning

```vue
<template>
  <el-popper>
    <el-popper-trigger>
      <button>Click me</button>
    </el-popper-trigger>
    <el-popper-content
      :visible="visible"
      placement="right-start"
      :offset="20"
      :fallback-placements="['right', 'left', 'top']"
      :popper-options="{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
      }"
    >
      <div>Custom positioned content</div>
    </el-popper-content>
  </el-popper>
</template>
```

### Virtual Triggering

When you need to position the popper relative to an element that's not a direct child:

```vue
<template>
  <div>
    <div ref="virtualRef">Virtual trigger</div>
    <el-popper>
      <el-popper-trigger
        :virtual-ref="virtualRef"
        :virtual-triggering="true"
      />
      <el-popper-content
        :visible="visible"
        :virtual-triggering="true"
        placement="bottom"
      >
        <div>Content positioned relative to virtual trigger</div>
      </el-popper-content>
    </el-popper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const virtualRef = ref()
const visible = ref(true)
</script>
```

### Focus Trapping

Enable focus trapping for accessibility:

```vue
<template>
  <el-popper>
    <el-popper-trigger>
      <button>Open dialog</button>
    </el-popper-trigger>
    <el-popper-content
      :visible="visible"
      :trapping="true"
      :focus-on-show="true"
      :loop="true"
      role="dialog"
    >
      <div>
        <input type="text" />
        <button>Action</button>
      </div>
    </el-popper-content>
  </el-popper>
</template>
```

### Custom Reference Element

Override the default trigger reference:

```vue
<template>
  <el-popper>
    <el-popper-trigger>
      <button>Trigger</button>
    </el-popper-trigger>
    <el-popper-content
      :visible="visible"
      :reference-el="customRef"
      placement="top"
    >
      <div>Content</div>
    </el-popper-content>
  </el-popper>
  <div ref="customRef">Custom reference</div>
</template>

<script setup>
import { ref } from 'vue'

const customRef = ref()
const visible = ref(true)
</script>
```

## TypeScript Types

### Exported Types

```typescript
import type {
  PopperProps,
  PopperInstance,
  PopperTriggerProps,
  PopperTriggerInstance,
  PopperContentProps,
  PopperContentInstance,
  PopperArrowProps,
  PopperArrowInstance,
  Placement,
  Options,
} from '@element-plus/components/popper'
```

### Constants

```typescript
import {
  Effect,
  // Effect.LIGHT
  // Effect.DARK
} from '@element-plus/components/popper'
```

## Implementation Details

### Architecture

The Popper component uses Vue's provide/inject pattern to share context between components:

1. **ElPopper** provides the injection context containing:
   - `triggerRef`: Reference to the trigger element
   - `contentRef`: Reference to the content element
   - `popperInstanceRef`: Reference to the Popper.js instance
   - `referenceRef`: Reference to the reference element
   - `role`: ARIA role for accessibility

2. **ElPopperTrigger** injects the context and manages:
   - Event listeners on the trigger element
   - ARIA attributes for accessibility
   - Virtual triggering support

3. **ElPopperContent** injects the context and manages:
   - Popper.js instance creation and updates
   - Positioning and styling
   - Focus trapping
   - Arrow positioning

4. **ElPopperArrow** injects content context to receive:
   - Arrow style calculations
   - Arrow element reference

### Popper.js Integration

The component wraps [@popperjs/core](https://popper.js.org/) and provides:
- Automatic positioning calculations
- Boundary detection and fallback placements
- Arrow positioning
- GPU acceleration support
- Custom modifier support

### Accessibility

The component includes built-in ARIA support:
- Role-based ARIA attribute distribution
- Focus management
- Keyboard navigation support
- Screen reader compatibility

## Notes

- The component is designed to be used as a foundation for other components (tooltips, popovers, etc.)
- Direct usage is typically not recommended; use higher-level components like `ElTooltip` or `ElPopover` instead
- The component handles positioning but not visibility logic; parent components should manage the `visible` prop
- Focus trapping should be used for modal-like components (dialogs, dropdowns)

