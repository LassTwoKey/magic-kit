# Компонент Focus Trap

## Обзор

Компонент Focus Trap (`ElFocusTrap`) — это утилита для доступности, которая захватывает фокус клавиатуры в пределах определенного DOM элемента. Он необходим для создания доступных модальных диалогов, выпадающих меню и других оверлейных компонентов, где фокус должен быть ограничен.

Компонент гарантирует, что когда пользователь нажимает Tab или Shift+Tab, фокус циклически перемещается внутри захваченного элемента и не выходит за его пределы. Это критически важная функция доступности для модальных диалогов и других оверлейных компонентов.

## Базовое использование

```vue
<template>
  <el-focus-trap :trapped="isOpen" :focus-trap-el="containerRef">
    <div ref="containerRef" tabindex="-1">
      <input type="text" />
      <button>Действие</button>
      <button @click="isOpen = false">Закрыть</button>
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

| Атрибут | Описание | Тип | По умолчанию |
|---------|----------|-----|--------------|
| `trapped` | Активен ли захват фокуса | `boolean` | `false` |
| `loop` | Включить цикл фокуса (Tab переходит от последнего к первому элементу) | `boolean` | `false` |
| `focusTrapEl` | Элемент, в пределах которого захватывается фокус | `HTMLElement` | - |
| `focusStartEl` | Элемент для фокуса при запуске захвата | `'container' \| 'first' \| HTMLElement` | `'first'` |

### Опции focusStartEl

- `'first'`: Фокусировать первый доступный для фокуса потомок (по умолчанию)
- `'container'`: Фокусировать сам элемент-контейнер
- `HTMLElement`: Фокусировать конкретный элемент

## События

| Имя события | Описание | Параметры |
|-------------|----------|-----------|
| `focusAfterTrapped` | Вызывается, когда фокус захвачен | `(e: Event)` |
| `focusAfterReleased` | Вызывается, когда захват фокуса освобожден | `(e: CustomEvent)` |
| `focusin` | Вызывается, когда фокус входит в захват | `(e: FocusEvent)` |
| `focusout` | Вызывается, когда фокус покидает захват (только когда не захвачен) | `(e: FocusEvent)` |
| `focusout-prevented` | Вызывается, когда выход фокуса предотвращен | `(e: CustomEvent)` |
| `release-requested` | Вызывается при нажатии клавиши Escape (запрос на освобождение захвата) | `(e: KeyboardEvent)` |

### Детали событий

#### Событие focusAfterReleased

Событие `focusAfterReleased` включает объект `detail` с:
- `focusReason`: `'pointer' \| 'keyboard'` - Как был перемещен фокус

#### Событие focusout-prevented

Событие `focusout-prevented` включает объект `detail` с:
- `focusReason`: `'pointer' \| 'keyboard'` - Как был перемещен фокус

Вы можете вызвать `preventDefault()` на этом событии, чтобы разрешить фокусу покинуть захват.

## Свойства слота

Компонент предоставляет слот с областью видимости:

| Свойство | Описание | Тип |
|----------|----------|-----|
| `handle-keydown` | Функция-обработчик keydown | `(e: KeyboardEvent) => void` |

## Продвинутое использование

### Базовый модальный диалог

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
      <h2>Заголовок диалога</h2>
      <input type="text" />
      <button>Сохранить</button>
      <button @click="handleClose">Отмена</button>
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
  // Управление фокусом при открытии диалога
  console.log('Фокус захвачен')
}

const onCloseAutoFocus = () => {
  // Управление фокусом при закрытии диалога
  console.log('Фокус освобожден')
}
</script>
```

### Цикл фокуса

Включите цикл фокуса, чтобы Tab переходил от последнего элемента обратно к первому:

```vue
<template>
  <el-focus-trap
    :trapped="true"
    :loop="true"
    :focus-trap-el="containerRef"
  >
    <div ref="containerRef">
      <button>Первый</button>
      <button>Второй</button>
      <button>Последний</button>
    </div>
  </el-focus-trap>
</template>
```

### Пользовательский элемент начала фокуса

Фокусировать конкретный элемент при запуске захвата:

```vue
<template>
  <el-focus-trap
    :trapped="visible"
    :focus-trap-el="containerRef"
    :focus-start-el="inputRef"
  >
    <div ref="containerRef">
      <input ref="inputRef" type="text" />
      <button>Действие</button>
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

### Обработка предотвращения выхода фокуса

Контролируйте, когда фокус может покинуть захват:

```vue
<template>
  <el-focus-trap
    :trapped="trapped"
    :focus-trap-el="containerRef"
    @focusout-prevented="onFocusoutPrevented"
  >
    <div ref="containerRef">
      <input type="text" />
      <button>Действие</button>
    </div>
  </el-focus-trap>
</template>

<script setup>
const onFocusoutPrevented = (event: CustomEvent) => {
  // Разрешить фокусу покинуть захват, если это было вызвано взаимодействием указателя
  if (event.detail.focusReason === 'pointer') {
    event.preventDefault()
  }
}
</script>
```

### Использование слота с областью видимости

Получить прямой доступ к обработчику keydown:

```vue
<template>
  <el-focus-trap :trapped="true" :focus-trap-el="containerRef">
    <template #default="{ handleKeydown }">
      <div ref="containerRef" @keydown="handleKeydown">
        <input type="text" />
        <button>Действие</button>
      </div>
    </template>
  </el-focus-trap>
</template>
```

## Стек фокуса

Компонент поддерживает стек фокуса для обработки вложенных захватов фокуса. Когда активны несколько захватов фокуса:

- Самый верхний (самый последний) захват активен
- Другие захваты автоматически приостанавливаются
- Когда захват удаляется, предыдущий захват возобновляется

Это позволяет корректно работать вложенным модальным окнам и выпадающим меню.

## Детали реализации

### Обнаружение фокуса

Компонент отслеживает, как был перемещен фокус:
- **Клавиатура**: Пользователь нажал Tab/Shift+Tab
- **Указатель**: Пользователь кликнул или коснулся элемента

Эта информация используется для принятия интеллектуальных решений об управлении фокусом.

### Элементы, доступные для фокуса

Компонент автоматически находит все элементы, доступные для фокуса, в контейнере захвата. Элемент считается доступным для фокуса, если:
- Он имеет `tabIndex >= 0`
- Он является текущим активным элементом
- Он не отключен и не скрыт
- Он не является скрытым полем ввода

### Обработка клавиши Escape

Когда клавиша Escape нажата, пока фокус захвачен, компонент вызывает событие `release-requested`. Родительский компонент должен обработать это, установив `trapped` в `false`.

## Доступность

Компонент Focus Trap разработан для соблюдения лучших практик доступности:

- **WCAG 2.1**: Соответствует требованиям управления фокусом
- **ARIA**: Работает бесшовно с ARIA атрибутами
- **Навигация с клавиатуры**: Полная поддержка клавиатуры
- **Программы чтения с экрана**: Совместим с вспомогательными технологиями

### Лучшие практики

1. **Всегда предоставляйте способ закрытия**: Используйте событие `release-requested` для обработки клавиши Escape
2. **Фокусируйте контейнер**: Используйте `focus-start-el="container"` для диалогов
3. **Восстанавливайте фокус**: Обрабатывайте `focusAfterReleased`, чтобы восстановить фокус на элементе-триггере
4. **Предотвращайте случайную потерю фокуса**: Используйте событие `focusout-prevented` для контроля, когда фокус может покинуть захват

## TypeScript типы

### Экспортируемые типы

```typescript
import type {
  FocusTrapInjectionContext,
} from '@element-plus/components/focus-trap'

import type {
  FocusLayer,
  FocusStack,
} from '@element-plus/components/focus-trap'
```

### Константы

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

## Примечания

- Компонент требует валидный `focusTrapEl` для правильной работы
- Захват фокуса работает только когда `trapped` равен `true`
- Компонент автоматически обрабатывает вложенные захваты фокуса
- Фокус восстанавливается на элемент, который имел фокус до захвата, когда захват освобождается
- Компонент использует паттерн provide/inject Vue внутренне для поддержки вложенных захватов

