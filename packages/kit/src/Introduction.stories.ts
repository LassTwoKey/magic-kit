import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Introduction',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => ({
    template: /* html */ `
      <div :style="wrapperStyle">
        <h1 :style="titleStyle">Magic Kit</h1>
        <p :style="subtitleStyle">Библиотека UI-компонентов для Vue 3</p>

        <hr />

        <h2 :style="h2Style">Установка</h2>
        <pre :style="codeStyle">yarn install</pre>

        <h2 :style="h2Style">Быстрый старт</h2>

        <h3 :style="h3Style">Глобальная регистрация</h3>
        <p>Зарегистрируйте все компоненты разом через Vue-плагин:</p>
        <pre :style="codeStyle"><code>import { createApp } from 'vue';
import magicKit from '@magic/kit/config';
import '@magic/kit/styles/all.scss';

const app = createApp(App);
app.use(magicKit, {
  locale: {
    emptyFilterMessage: 'Ничего не найдено',
  },
});</code></pre>

        <h3 :style="h3Style">Импорт отдельных компонентов</h3>
        <p>Подключайте только нужные компоненты — каждый из них доступен по отдельному пути:</p>
        <pre :style="codeStyle"><code>&lt;script setup lang="ts"&gt;
import { MkButton } from '@magic/kit/components/MkButton';
import { MkInput } from '@magic/kit/components/MkInput';
&lt;/script&gt;

&lt;template&gt;
  &lt;MkButton variant="primary" label="Сохранить" /&gt;
  &lt;MkInput v-model="value" placeholder="Введите текст" /&gt;
&lt;/template&gt;</code></pre>

        <h3 :style="h3Style">Иконки</h3>
        <p>Иконки автоматически генерируются из SVG и экспортируются из <code>@magic/kit/icons</code>:</p>
        <pre :style="codeStyle"><code>&lt;script setup lang="ts"&gt;
import { MkDoneIcon } from '@magic/kit/icons';
&lt;/script&gt;

&lt;template&gt;
  &lt;MkButton variant="primary" label="Сохранить"&gt;
    &lt;template #icon&gt;
      &lt;MkDoneIcon /&gt;
    &lt;/template&gt;
  &lt;/MkButton&gt;
&lt;/template&gt;</code></pre>

        <hr />

        <h2 :style="h2Style">Компоненты</h2>
        <table :style="tableStyle">
          <thead>
            <tr>
              <th :style="thStyle">Компонент</th>
              <th :style="thStyle">Описание</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in components" :key="row.name">
              <td :style="tdNameStyle"><code>{{ row.name }}</code></td>
              <td :style="tdStyle">{{ row.description }}</td>
            </tr>
          </tbody>
        </table>

        <hr />

        <h2 :style="h2Style">Стек</h2>
        <ul>
          <li v-for="item in stack" :key="item"><strong v-html="item"></strong></li>
        </ul>
      </div>
    `,
    setup() {
      const wrapperStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px 16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: '1.6',
        color: '#333',
      };

      const titleStyle = {
        fontSize: '2.5em',
        marginBottom: '0',
        fontWeight: '700',
      };

      const subtitleStyle = {
        fontSize: '1.2em',
        color: '#666',
        marginTop: '8px',
      };

      const h2Style = {
        marginTop: '32px',
        marginBottom: '12px',
        fontSize: '1.5em',
      };

      const h3Style = {
        marginTop: '24px',
        marginBottom: '8px',
        fontSize: '1.15em',
      };

      const codeStyle = {
        background: '#f5f5f5',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        padding: '16px',
        fontSize: '14px',
        overflowX: 'auto' as const,
        lineHeight: '1.5',
      };

      const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginTop: '16px',
      };

      const thStyle = {
        textAlign: 'left' as const,
        padding: '10px 12px',
        borderBottom: '2px solid #e0e0e0',
        fontWeight: '600',
      };

      const tdStyle = {
        padding: '10px 12px',
        borderBottom: '1px solid #f0f0f0',
      };

      const tdNameStyle = {
        ...tdStyle,
        whiteSpace: 'nowrap' as const,
      };

      const components = [
        { name: 'MkAccordion / MkAccordionItem', description: 'Аккордеон' },
        { name: 'MkButton', description: 'Кнопка (primary, secondary, danger, outline, text)' },
        { name: 'MkCheckbox / MkCheckboxGroup', description: 'Чекбокс и группа чекбоксов' },
        { name: 'MkColorPicker', description: 'Выбор цвета' },
        { name: 'MkDatePicker', description: 'Выбор даты' },
        { name: 'MkDialog', description: 'Диалоговое окно' },
        { name: 'MkDivider', description: 'Разделитель' },
        { name: 'MkDropdown / MkDropdownItem', description: 'Выпадающий список' },
        { name: 'MkFocusTrap', description: 'Ловушка фокуса' },
        { name: 'MkIcon', description: 'Иконка' },
        { name: 'MkInput', description: 'Текстовое поле' },
        { name: 'MkInputDropdown', description: 'Поле с выпадающим списком' },
        { name: 'MkInputNumber', description: 'Числовое поле' },
        { name: 'MkPopover', description: 'Поповер' },
        { name: 'MkPreloader', description: 'Анимированный лоадер' },
        { name: 'MkRadio / MkRadioGroup', description: 'Радиокнопка и группа' },
        { name: 'MkSlider', description: 'Слайдер' },
        { name: 'MkSwitch / MkSwitchGroup', description: 'Переключатель и группа' },
        { name: 'MkTextarea', description: 'Многострочное поле' },
        { name: 'MkTimePicker', description: 'Выбор времени' },
        { name: 'MkTooltip', description: 'Тултип' },
        { name: 'MkTree', description: 'Дерево' },
      ];

      const stack = [
        '<strong>Vue 3</strong> — Composition API, <code>&lt;script setup&gt;</code>',
        '<strong>TypeScript</strong> — строгая типизация',
        '<strong>SCSS</strong> — 7-1 архитектура, BEM-нотация, CSS custom properties',
        '<strong>Vite</strong> — сборка библиотеки и стилей',
        '<strong>Storybook</strong> — документация и тестирование компонентов',
        '<strong>Vitest + Playwright</strong> — браузерные тесты через Storybook',
      ];

      return {
        wrapperStyle,
        titleStyle,
        subtitleStyle,
        h2Style,
        h3Style,
        codeStyle,
        tableStyle,
        thStyle,
        tdStyle,
        tdNameStyle,
        components,
        stack,
      };
    },
  }),
};
