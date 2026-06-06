import { h } from 'vue';
import { MkAccordion } from '@magic/kit/components/MkAccordion';
import { MkDoneIcon, MkCloseIcon } from '@magic/kit/icons';

import MkAccordionItem from './MkAccordionItem.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Components/Accordion/MkAccordionItem',
  component: MkAccordionItem,
  subcomponents: { MkAccordion },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    name: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    defaultOpen: {
      control: 'boolean',
    },
    headerClasses: {
      control: 'text',
    },
    headerStyles: {
      control: 'object',
    },
  },
} satisfies Meta<typeof MkAccordionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    name: '1',
    title: 'Заголовок элемента',
  },
  render: (args) => ({
    components: { MkAccordionItem },
    setup() {
      return { args };
    },
    template: `
      <MkAccordionItem v-bind="args">
        Контент элемента аккордеона.
      </MkAccordionItem>
    `,
  }),
};

export const DefaultOpen: Story = {
  args: {
    name: '1',
    title: 'Открыт по умолчанию',
    defaultOpen: true,
  },
  render: (args) => ({
    components: { MkAccordionItem },
    setup() {
      return { args };
    },
    template: `
      <MkAccordionItem v-bind="args">
        Этот элемент раскрыт по умолчанию благодаря пропу defaultOpen.
      </MkAccordionItem>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    name: '1',
    title: 'Заблокированный элемент',
    disabled: true,
  },
  render: (args) => ({
    components: { MkAccordionItem },
    setup() {
      return { args };
    },
    template: `
      <MkAccordionItem v-bind="args">
        Этот контент нельзя раскрыть.
      </MkAccordionItem>
    `,
  }),
};

export const CustomHeaderSlot: Story = {
  args: { name: '1' },
  render: () => ({
    components: { MkAccordionItem, MkDoneIcon },
    template: `
      <MkAccordionItem name="1">
        <template #header="{ isOpen, disabled }">
          <span :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: isOpen ? 'bold' : 'normal',
            color: isOpen ? 'var(--mk-color-primary)' : 'inherit',
          }">
            <MkDoneIcon size="16" />
            Кастомный заголовок через слот
          </span>
        </template>
        Заголовок полностью контролируется через слот #header.
      </MkAccordionItem>
    `,
  }),
};

export const TitleRenderFunction: Story = {
  args: { name: '1' },
  render: () => ({
    components: { MkAccordionItem },
    setup() {
      const customTitle = () =>
        h('span', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
          h('span', {
            style: {
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--mk-color-primary)',
            },
          }),
          'Заголовок через render-функцию',
        ]);
      return { customTitle };
    },
    template: `
      <MkAccordionItem name="1" :title="customTitle">
        Проп title принимает render-функцию, которая возвращает VNode.
      </MkAccordionItem>
    `,
  }),
};

export const CustomIconSlot: Story = {
  args: { name: '1' },
  render: () => ({
    components: { MkAccordionItem, MkCloseIcon },
    template: `
      <MkAccordionItem name="1" title="Кастомная иконка">
        <template #icon="{ isOpen }">
          <MkCloseIcon
            size="20"
            :style="{
              transform: isOpen ? 'rotate(0deg)' : 'rotate(45deg)',
              transition: 'transform 0.3s ease',
            }"
          />
        </template>
        Иконка-индикатор заменена через слот #icon.
      </MkAccordionItem>
    `,
  }),
};

export const InsideAccordion: Story = {
  args: { name: '1' },
  render: () => ({
    components: { MkAccordion, MkAccordionItem },
    template: `
      <MkAccordion>
        <MkAccordionItem name="1" title="Элемент 1">
          Контент первого элемента. В одиночном режиме открывается только один.
        </MkAccordionItem>
        <MkAccordionItem name="2" title="Элемент 2">
          Контент второго элемента.
        </MkAccordionItem>
        <MkAccordionItem name="3" title="Элемент 3">
          Контент третьего элемента.
        </MkAccordionItem>
      </MkAccordion>
    `,
  }),
};
