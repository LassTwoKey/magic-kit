# Компонент Popper

## Обзор

Компонент Popper — это гибкая система позиционирования, построенная на основе [@popperjs/core](https://popper.js.org/). Он предоставляет основу для создания подсказок, всплывающих окон, выпадающих меню и других оверлейных компонентов, которые необходимо позиционировать относительно элемента-триггера.

Компонент состоит из четырех основных частей:
- **ElPopper**: Корневой компонент-обертка, предоставляющий контекст
- **ElPopperTrigger**: Элемент-триггер, который активирует popper
- **ElPopperContent**: Контейнер контента, который отображается в popper
- **ElPopperArrow**: Опциональный элемент стрелки, указывающий на триггер

## Базовое использование

```vue
<template>
  <el-popper>
    <el-popper-trigger>
      <button>Наведите курсор</button>
    </el-popper-trigger>
    <el-popper-content :visible="visible" placement="top">
      <div>Это содержимое popper</div>
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

## Компоненты

### ElPopper

Корневой компонент, который предоставляет контекст внедрения для дочерних компонентов.

#### Props

| Атрибут | Описание | Тип | По умолчанию |
|---------|----------|-----|--------------|
| `role` | Определяет, как распределяются ARIA атрибуты | `'dialog' \| 'grid' \| 'group' \| 'listbox' \| 'menu' \| 'navigation' \| 'tooltip' \| 'tree'` | `'tooltip'` |

#### Открытые свойства

- `triggerRef`: Ссылка на элемент-триггер
- `popperInstanceRef`: Ссылка на экземпляр Popper.js
- `contentRef`: Ссылка на элемент контента popper
- `referenceRef`: Ссылка на элемент-референс popper
- `role`: Вычисляемое свойство role

### ElPopperTrigger

Компонент-триггер, который оборачивает элемент, активирующий popper.

#### Props

| Атрибут | Описание | Тип | По умолчанию |
|---------|----------|-----|--------------|
| `virtualRef` | Референсный элемент, к которому прикреплен popper | `Measurable` | - |
| `virtualTriggering` | Включена ли виртуальная активация | `boolean` | `false` |
| `onMouseenter` | Обработчик события наведения мыши | `(e: Event) => void` | - |
| `onMouseleave` | Обработчик события ухода мыши | `(e: Event) => void` | - |
| `onClick` | Обработчик события клика | `(e: Event) => void` | - |
| `onKeydown` | Обработчик события нажатия клавиши | `(e: Event) => void` | - |
| `onFocus` | Обработчик события фокуса | `(e: Event) => void` | - |
| `onBlur` | Обработчик события потери фокуса | `(e: Event) => void` | - |
| `onContextmenu` | Обработчик события контекстного меню | `(e: Event) => void` | - |
| `id` | ID элемента | `string` | - |
| `open` | Открыт ли popper | `boolean` | `false` |

#### Открытые свойства

- `triggerRef`: Ссылка на элемент-триггер

### ElPopperContent

Компонент контента, который отображает содержимое popper.

#### Props

##### Основные свойства конфигурации

| Атрибут | Описание | Тип | По умолчанию |
|---------|----------|-----|--------------|
| `placement` | Позиция popper | `Placement` | `'bottom'` |
| `offset` | Смещение popper | `number` | `12` |
| `strategy` | Стратегия позиционирования | `'fixed' \| 'absolute'` | `'absolute'` |
| `boundariesPadding` | Отступ от границ | `number` | `0` |
| `fallbackPlacements` | Резервные позиции, если основная не подходит | `Placement[]` | - |
| `gpuAcceleration` | Включить GPU ускорение | `boolean` | `true` |
| `popperOptions` | Дополнительные опции Popper.js | `Partial<Options>` | `{}` |

##### Свойства контента

| Атрибут | Описание | Тип | По умолчанию |
|---------|----------|-----|--------------|
| `visible` | Видим ли popper | `boolean` | `false` |
| `effect` | Эффект темы | `'light' \| 'dark'` | `'dark'` |
| `enterable` | Может ли мышь войти в popper | `boolean` | `true` |
| `pure` | Чистый режим (без стилей) | `boolean` | `false` |
| `focusOnShow` | Фокусировать popper при показе | `boolean` | `false` |
| `trapping` | Включить захват фокуса | `boolean` | `false` |
| `loop` | Включить цикл фокуса | `boolean` | `false` |
| `id` | ID элемента | `string` | - |
| `style` | Пользовательский стиль | `StyleValue` | - |
| `className` | Пользовательское имя класса | `string \| Array \| Object` | - |
| `popperClass` | Класс контейнера popper | `string \| Array \| Object` | - |
| `popperStyle` | Стиль контейнера popper | `StyleValue` | - |
| `referenceEl` | Референсный элемент (переопределяет триггер) | `HTMLElement` | - |
| `triggerTargetEl` | Целевой элемент триггера | `HTMLElement` | - |
| `stopPopperMouseEvent` | Останавливать события мыши на popper | `boolean` | `true` |
| `virtualTriggering` | Включена ли виртуальная активация | `boolean` | `false` |
| `zIndex` | Z-index popper | `number` | - |
| `ariaLabel` | ARIA метка | `string` | - |

##### Свойства стрелки

| Атрибут | Описание | Тип | По умолчанию |
|---------|----------|-----|--------------|
| `arrowOffset` | Смещение стрелки от края | `number` | `5` |

#### События

| Имя события | Описание | Параметры |
|-------------|----------|-----------|
| `mouseenter` | Мышь входит в popper | `(evt: MouseEvent)` |
| `mouseleave` | Мышь покидает popper | `(evt: MouseEvent)` |
| `focus` | Popper получает фокус | - |
| `blur` | Popper теряет фокус | - |
| `close` | Popper закрывается | - |

### ElPopperArrow

Опциональный компонент стрелки, указывающий на элемент-триггер.

#### Props

| Атрибут | Описание | Тип | По умолчанию |
|---------|----------|-----|--------------|
| `arrowOffset` | Смещение стрелки от края | `number` | `5` |

#### Открытые свойства

- `arrowRef`: Ссылка на элемент стрелки

## Варианты размещения

Свойство `placement` принимает следующие значения из Popper.js:

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

## Продвинутое использование

### Пользовательское позиционирование

```vue
<template>
  <el-popper>
    <el-popper-trigger>
      <button>Нажмите меня</button>
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
      <div>Пользовательски позиционированный контент</div>
    </el-popper-content>
  </el-popper>
</template>
```

### Виртуальная активация

Когда вам нужно позиционировать popper относительно элемента, который не является прямым дочерним элементом:

```vue
<template>
  <div>
    <div ref="virtualRef">Виртуальный триггер</div>
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
        <div>Контент, позиционированный относительно виртуального триггера</div>
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

### Захват фокуса

Включите захват фокуса для доступности:

```vue
<template>
  <el-popper>
    <el-popper-trigger>
      <button>Открыть диалог</button>
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
        <button>Действие</button>
      </div>
    </el-popper-content>
  </el-popper>
</template>
```

### Пользовательский референсный элемент

Переопределите референс триггера по умолчанию:

```vue
<template>
  <el-popper>
    <el-popper-trigger>
      <button>Триггер</button>
    </el-popper-trigger>
    <el-popper-content
      :visible="visible"
      :reference-el="customRef"
      placement="top"
    >
      <div>Контент</div>
    </el-popper-content>
  </el-popper>
  <div ref="customRef">Пользовательский референс</div>
</template>

<script setup>
import { ref } from 'vue'

const customRef = ref()
const visible = ref(true)
</script>
```

## TypeScript типы

### Экспортируемые типы

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

### Константы

```typescript
import {
  Effect,
  // Effect.LIGHT
  // Effect.DARK
} from '@element-plus/components/popper'
```

## Детали реализации

### Архитектура

Компонент Popper использует паттерн provide/inject Vue для обмена контекстом между компонентами:

1. **ElPopper** предоставляет контекст внедрения, содержащий:
   - `triggerRef`: Ссылка на элемент-триггер
   - `contentRef`: Ссылка на элемент контента
   - `popperInstanceRef`: Ссылка на экземпляр Popper.js
   - `referenceRef`: Ссылка на референсный элемент
   - `role`: ARIA роль для доступности

2. **ElPopperTrigger** внедряет контекст и управляет:
   - Обработчиками событий на элементе-триггере
   - ARIA атрибутами для доступности
   - Поддержкой виртуальной активации

3. **ElPopperContent** внедряет контекст и управляет:
   - Созданием и обновлением экземпляра Popper.js
   - Позиционированием и стилизацией
   - Захватом фокуса
   - Позиционированием стрелки

4. **ElPopperArrow** внедряет контекст контента для получения:
   - Вычислений стиля стрелки
   - Ссылки на элемент стрелки

### Интеграция с Popper.js

Компонент оборачивает [@popperjs/core](https://popper.js.org/) и предоставляет:
- Автоматические вычисления позиционирования
- Обнаружение границ и резервные позиции
- Позиционирование стрелки
- Поддержку GPU ускорения
- Поддержку пользовательских модификаторов

### Доступность

Компонент включает встроенную поддержку ARIA:
- Распределение ARIA атрибутов на основе роли
- Управление фокусом
- Поддержка навигации с клавиатуры
- Совместимость с программами чтения с экрана

## Примечания

- Компонент предназначен для использования в качестве основы для других компонентов (подсказки, всплывающие окна и т.д.)
- Прямое использование обычно не рекомендуется; вместо этого используйте компоненты более высокого уровня, такие как `ElTooltip` или `ElPopover`
- Компонент обрабатывает позиционирование, но не логику видимости; родительские компоненты должны управлять свойством `visible`
- Захват фокуса следует использовать для модальных компонентов (диалоги, выпадающие меню)

