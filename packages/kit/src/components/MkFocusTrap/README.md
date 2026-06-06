# Focus Trap Component

## Overview

The Focus Trap component (`ElFocusTrap`) is an accessibility utility component that traps keyboard focus within a specific DOM element. It's essential for creating accessible modal dialogs, dropdowns, and other overlay components where focus should be contained.

The component ensures that when a user presses Tab or Shift+Tab, focus cycles within the trapped element and doesn't escape to other parts of the page. This is a critical accessibility feature for modal dialogs and other overlay components.

## Basic Usage

```vue
<template>
  <el-focus-trap :trapped="isOpen" :focus-trap-el="containerRef">
    <div ref="containerRef" tabindex="-1">
      <input type="text" />
      <button>Action</button>
      <button @click="isOpen = false">Close</button>
    </div>
  </el-focus-trap>
</template>

<script setup>
import { ref } from 'vue'
import { ElFocusTrap } from '@element-plus/components/focus-trap'

const isOpen = ref(true)
const containerRef = ref()
</script>
```

## Props

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| `trapped` | Whether focus trapping is active | `boolean` | `false` |
| `loop` | Enable focus looping (Tab cycles from last to first element) | `boolean` | `false` |
| `focusTrapEl` | The element to trap focus within | `HTMLElement` | - |
| `focusStartEl` | Element to focus when trap starts | `'container' \| 'first' \| HTMLElement` | `'first'` |

### focusStartEl Options

- `'first'`: Focus the first focusable descendant (default)
- `'container'`: Focus the container element itself
- `HTMLElement`: Focus a specific element

## Events

| Event Name | Description | Parameters |
|------------|-------------|------------|
| `focusAfterTrapped` | Emitted when focus is trapped | `(e: Event)` |
| `focusAfterReleased` | Emitted when focus trap is released | `(e: CustomEvent)` |
| `focusin` | Emitted when focus enters the trap | `(e: FocusEvent)` |
| `focusout` | Emitted when focus leaves the trap (only when not trapped) | `(e: FocusEvent)` |
| `focusout-prevented` | Emitted when focus out is prevented | `(e: CustomEvent)` |
| `release-requested` | Emitted when Escape key is pressed (request to release trap) | `(e: KeyboardEvent)` |

### Event Details

#### focusAfterReleased Event

The `focusAfterReleased` event includes a `detail` object with:
- `focusReason`: `'pointer' \| 'keyboard'` - How focus was moved

#### focusout-prevented Event

The `focusout-prevented` event includes a `detail` object with:
- `focusReason`: `'pointer' \| 'keyboard'` - How focus was moved

You can call `preventDefault()` on this event to allow focus to leave the trap.

## Slot Props

The component provides a scoped slot with:

| Prop | Description | Type |
|------|-------------|------|
| `handle-keydown` | Keydown handler function | `(e: KeyboardEvent) => void` |

## Advanced Usage

### Basic Modal Dialog

```vue
<template>
  <el-focus-trap
    :trapped="visible"
    :focus-trap-el="dialogRef"
    focus-start-el="container"
    @focus-after-trapped="onOpenAutoFocus"
    @focus-after-released="onCloseAutoFocus"
    @release-requested="handleClose"
  >
    <div
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <h2>Dialog Title</h2>
      <input type="text" />
      <button>Save</button>
      <button @click="handleClose">Cancel</button>
    </div>
  </el-focus-trap>
</template>

<script setup>
import { ref } from 'vue'
import { ElFocusTrap } from '@element-plus/components/focus-trap'

const visible = ref(false)
const dialogRef = ref()

const handleClose = () => {
  visible.value = false
}

const onOpenAutoFocus = () => {
  // Focus management when dialog opens
  console.log('Focus trapped')
}

const onCloseAutoFocus = () => {
  // Focus management when dialog closes
  console.log('Focus released')
}
</script>
```

### Focus Looping

Enable focus looping so Tab cycles from the last element back to the first:

```vue
<template>
  <el-focus-trap
    :trapped="true"
    :loop="true"
    :focus-trap-el="containerRef"
  >
    <div ref="containerRef">
      <button>First</button>
      <button>Second</button>
      <button>Last</button>
    </div>
  </el-focus-trap>
</template>
```

### Custom Focus Start Element

Focus a specific element when the trap starts:

```vue
<template>
  <el-focus-trap
    :trapped="visible"
    :focus-trap-el="containerRef"
    :focus-start-el="inputRef"
  >
    <div ref="containerRef">
      <input ref="inputRef" type="text" />
      <button>Action</button>
    </div>
  </el-focus-trap>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(true)
const containerRef = ref()
const inputRef = ref()
</script>
```

### Handling Focus Out Prevention

Control when focus can leave the trap:

```vue
<template>
  <el-focus-trap
    :trapped="trapped"
    :focus-trap-el="containerRef"
    @focusout-prevented="onFocusoutPrevented"
  >
    <div ref="containerRef">
      <input type="text" />
      <button>Action</button>
    </div>
  </el-focus-trap>
</template>

<script setup>
const onFocusoutPrevented = (event: CustomEvent) => {
  // Allow focus to leave if it was caused by pointer interaction
  if (event.detail.focusReason === 'pointer') {
    event.preventDefault()
  }
}
</script>
```

### Using Scoped Slot

Access the keydown handler directly:

```vue
<template>
  <el-focus-trap :trapped="true" :focus-trap-el="containerRef">
    <template #default="{ handleKeydown }">
      <div ref="containerRef" @keydown="handleKeydown">
        <input type="text" />
        <button>Action</button>
      </div>
    </template>
  </el-focus-trap>
</template>
```

## Focus Stack

The component maintains a focus stack to handle nested focus traps. When multiple focus traps are active:

- The topmost (most recent) trap is active
- Other traps are automatically paused
- When a trap is removed, the previous trap resumes

This allows for nested modals and dropdowns to work correctly.

## Implementation Details

### Focus Detection

The component tracks how focus was moved:
- **Keyboard**: User pressed Tab/Shift+Tab
- **Pointer**: User clicked or touched an element

This information is used to make intelligent decisions about focus management.

### Focusable Elements

The component automatically finds all focusable elements within the trap container. An element is considered focusable if:
- It has `tabIndex >= 0`
- It is the currently active element
- It is not disabled or hidden
- It is not a hidden input field

### Escape Key Handling

When the Escape key is pressed while focus is trapped, the component emits a `release-requested` event. The parent component should handle this by setting `trapped` to `false`.

## Accessibility

The Focus Trap component is designed to follow accessibility best practices:

- **WCAG 2.1**: Complies with focus management requirements
- **ARIA**: Works seamlessly with ARIA attributes
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Compatible with assistive technologies

### Best Practices

1. **Always provide a way to close**: Use the `release-requested` event to handle Escape key
2. **Focus the container**: Use `focus-start-el="container"` for dialogs
3. **Restore focus**: Handle `focusAfterReleased` to restore focus to the triggering element
4. **Prevent accidental focus loss**: Use `focusout-prevented` event to control when focus can leave

## TypeScript Types

### Exported Types

```typescript
import type {
  FocusTrapInjectionContext,
} from '@element-plus/components/focus-trap'

import type {
  FocusLayer,
  FocusStack,
} from '@element-plus/components/focus-trap'
```

### Constants

```typescript
import {
  FOCUS_AFTER_TRAPPED,
  FOCUS_AFTER_RELEASED,
  FOCUSOUT_PREVENTED,
  ON_TRAP_FOCUS_EVT,
  ON_RELEASE_FOCUS_EVT,
  FOCUS_TRAP_INJECTION_KEY,
} from '@element-plus/components/focus-trap'
```

## Notes

- The component requires a valid `focusTrapEl` to function properly
- Focus trapping only works when `trapped` is `true`
- The component automatically handles nested focus traps
- Focus is restored to the element that had focus before trapping when the trap is released
- The component uses Vue's provide/inject pattern internally for nested trap support

