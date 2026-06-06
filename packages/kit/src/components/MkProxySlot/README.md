# Slot Component (Only Child)

## Overview

The Slot component (`ElOnlyChild`) is a utility component that ensures only one valid child element is rendered. It's particularly useful for components that need to forward props, refs, or attributes to a single child element, such as trigger components in tooltips, popovers, and other overlay components.

The component:
- Renders only the first valid child element
- Forwards all attributes to the child
- Supports ref forwarding through the forward ref injection system
- Handles edge cases like fragments, comments, and text nodes
- Wraps text content in a span element

## Basic Usage

```vue
<template>
  <el-only-child>
    <button>Click me</button>
  </el-only-child>
</template>

<script setup>
import { ElOnlyChild } from '@element-plus/components/slot'
</script>
```

## Props

The component accepts all standard HTML attributes and Vue props, which are forwarded to the child element.

## Behavior

### Single Child Rendering

The component renders only the first valid child element:

```vue
<template>
  <!-- Only the button will be rendered -->
  <el-only-child>
    <button>First</button>
    <button>Second</button>
  </el-only-child>
</template>
```

### Fragment Handling

Fragments are unwrapped to find the first valid child:

```vue
<template>
  <!-- The button inside the fragment will be rendered -->
  <el-only-child>
    <Fragment>
      <button>Inside Fragment</button>
    </Fragment>
  </el-only-child>
</template>
```

### Text Content

Text content is automatically wrapped in a `<span>` element:

```vue
<template>
  <!-- Text will be wrapped in <span class="el-only-child__content"> -->
  <el-only-child>
    Some text content
  </el-only-child>
</template>
```

### Comment Nodes

Comment nodes are ignored:

```vue
<template>
  <!-- Only the button will be rendered, comment is ignored -->
  <el-only-child>
    <!-- This is a comment -->
    <button>Button</button>
  </el-only-child>
</template>
```

### SVG Elements

SVG elements are handled specially and wrapped appropriately:

```vue
<template>
  <el-only-child>
    <svg viewBox="0 0 24 24">
      <path d="..." />
    </svg>
  </el-only-child>
</template>
```

## Advanced Usage

### With Attributes Forwarding

All attributes are forwarded to the child:

```vue
<template>
  <el-only-child class="custom-class" id="my-id" data-test="test">
    <button>Button</button>
  </el-only-child>
  <!-- Renders as: <button class="custom-class" id="my-id" data-test="test">Button</button> -->
</template>
```

### With Ref Forwarding

The component integrates with Element Plus's forward ref system:

```vue
<template>
  <el-only-child>
    <button>Button</button>
  </el-only-child>
</template>

<script setup>
import { provide } from 'vue'
import { FORWARD_REF_INJECTION_KEY } from '@element-plus/hooks'
import { ref } from 'vue'

const buttonRef = ref()

provide(FORWARD_REF_INJECTION_KEY, {
  setForwardRef: (el) => {
    buttonRef.value = el
  }
})
</script>
```

### Conditional Rendering

Works with conditional rendering:

```vue
<template>
  <el-only-child>
    <button v-if="showButton">Button</button>
    <span v-else>Fallback</span>
  </el-only-child>
</template>
```

### In Component Libraries

Common use case in trigger components:

```vue
<template>
  <el-only-child v-bind="$attrs">
    <slot />
  </el-only-child>
</template>

<script setup>
import { ElOnlyChild } from '@element-plus/components/slot'

defineOptions({
  name: 'MyTrigger',
  inheritAttrs: false,
})
</script>
```

## Edge Cases

### No Children

If no valid children are found, the component returns `null` and logs a warning:

```vue
<template>
  <!-- Returns null, logs warning -->
  <el-only-child />
</template>
```

### Multiple Children Warning

If multiple valid children are found, the component renders the first but logs a warning:

```vue
<template>
  <!-- Renders first button, logs warning about multiple children -->
  <el-only-child>
    <button>First</button>
    <button>Second</button>
  </el-only-child>
</template>
```

### Nested Fragments

Nested fragments are properly unwrapped:

```vue
<template>
  <el-only-child>
    <Fragment>
      <Fragment>
        <button>Deeply nested</button>
      </Fragment>
    </Fragment>
  </el-only-child>
</template>
```

## Implementation Details

### Child Detection Algorithm

The component uses a recursive algorithm to find the first valid child:

1. Filters out comment nodes
2. Handles text nodes by wrapping them
3. Unwraps Fragment nodes recursively
4. Handles SVG elements specially
5. Returns the first non-comment, non-fragment child

### Attribute Forwarding

Attributes are forwarded using Vue's `cloneVNode` function, which preserves:
- All HTML attributes
- Event listeners
- Vue directives
- Component props

### Ref Forwarding

The component uses Element Plus's forward ref directive system:
- Injects `FORWARD_REF_INJECTION_KEY` if available
- Applies the forward ref directive to the cloned child
- Allows parent components to access the child's ref

## TypeScript Types

### Exported Types

```typescript
import type {
  OnlyChildExpose,
} from '@element-plus/components/slot'
```

### Component Instance

```typescript
import type { ComponentPublicInstance } from 'vue'
import { ElOnlyChild } from '@element-plus/components/slot'

type OnlyChildInstance = InstanceType<typeof ElOnlyChild>
```

## Common Use Cases

### 1. Trigger Components

Used in components that need to wrap a trigger element:

```vue
<!-- Tooltip trigger -->
<el-only-child>
  <button>Hover me</button>
</el-only-child>
```

### 2. Form Input Wrappers

Wrap form inputs while preserving attributes:

```vue
<el-only-child class="input-wrapper">
  <input type="text" />
</el-only-child>
```

### 3. Button Groups

Ensure only one button receives forwarded props:

```vue
<el-only-child>
  <el-button>Action</el-button>
</el-only-child>
```

## Notes

- The component is designed for internal use in Element Plus components
- It's primarily used in trigger components (tooltips, popovers, etc.)
- Multiple children will cause a warning but the first child will still be rendered
- Text content is automatically wrapped in a span with class `el-only-child__content`
- The component respects Vue's `inheritAttrs: false` pattern
- Comment nodes are always ignored
- Fragment nodes are recursively unwrapped

## Warnings

The component will log warnings in development mode when:
- No valid children are found
- Multiple valid children are provided (only the first is used)

These warnings help developers identify incorrect usage patterns.

