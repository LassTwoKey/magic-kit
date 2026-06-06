# Magic Kit

Библиотека UI-компонентов для Vue 3.

## Установка

```bash
yarn install
```

## Разработка

```bash
yarn storybook              # Запуск Storybook (localhost:6006)
yarn build-storybook        # Сборка статического Storybook
yarn test-storybook         # Запуск тестов (Vitest + Playwright)
yarn kit:build              # Сборка библиотеки → packages/kit/lib/
yarn make-icons             # Генерация Vue-компонентов из SVG-иконок
yarn create-component       # Создание заготовки нового компонента
```

## Компоненты

| Компонент | Описание |
|---|---|
| `MkAccordion` / `MkAccordionItem` | Аккордеон |
| `MkButton` | Кнопка (primary, secondary, danger, outline, text) |
| `MkCheckbox` / `MkCheckboxGroup` | Чекбокс и группа чекбоксов |
| `MkColorPicker` | Выбор цвета |
| `MkDatePicker` | Выбор даты |
| `MkDialog` | Диалоговое окно |
| `MkDivider` | Разделитель |
| `MkDropdown` / `MkDropdownItem` | Выпадающий список |
| `MkFocusTrap` | Ловушка фокуса |
| `MkIcon` | Иконка |
| `MkInput` | Текстовое поле |
| `MkInputDropdown` | Поле с выпадающим списком |
| `MkInputNumber` | Числовое поле |
| `MkPopover` | Поповер |
| `MkPreloader` | Загрузчик |
| `MkRadio` / `MkRadioGroup` | Радиокнопка и группа |
| `MkSlider` | Слайдер |
| `MkSwitch` / `MkSwitchGroup` | Переключатель и группа |
| `MkTextarea` | Многострочное поле |
| `MkTimePicker` | Выбор времени |
| `MkTooltip` | Тултип |
| `MkTree` | Дерево |

## Использование

### Глобальная регистрация

```ts
import { createApp } from 'vue';
import magicKit from '@magic/kit/config';
import '@magic/kit/styles/all.scss';

const app = createApp(App);
app.use(magicKit, {
  locale: {
    emptyFilterMessage: 'Ничего не найдено',
  },
});
```

### Импорт отдельных компонентов

```vue
<script setup lang="ts">
import { MkButton } from '@magic/kit/components/MkButton';
import { MkInput } from '@magic/kit/components/MkInput';
</script>

<template>
  <MkButton variant="primary" label="Сохранить" />
  <MkInput v-model="value" placeholder="Введите текст" />
</template>
```

### Иконки

```vue
<script setup lang="ts">
import { MkDoneIcon } from '@magic/kit/icons';
</script>

<template>
  <MkButton variant="primary" label="Сохранить">
    <template #icon>
      <MkDoneIcon />
    </template>
  </MkButton>
</template>
```

## Структура проекта

```
magic-kit/
├── packages/kit/
│   └── src/
│       ├── components/     # Vue-компоненты
│       ├── config/         # Глобальный конфиг (Vue-плагин)
│       ├── constants/      # Ключи provide/inject, константы
│       ├── hooks/          # Общие композаблы
│       ├── icons/          # SVG → Vue-иконки
│       ├── styles/         # SCSS (7-1: settings, tools, generic, elements, utilities)
│       └── utils/          # Утилиты
├── scripts/                # make-icons, create-component
└── package.json            # Yarn workspaces
```

## Стек

- **Vue 3** — Composition API, `<script setup>`
- **TypeScript** — строгая типизация
- **SCSS** — 7-1 архитектура, BEM-нотация, CSS custom properties
- **Vite** — сборка библиотеки и стилей
- **Storybook** — документация и тестирование компонентов
- **Vitest + Playwright** — браузерные тесты через Storybook
- **ESLint + Prettier + Stylelint** — линтинг и форматирование
