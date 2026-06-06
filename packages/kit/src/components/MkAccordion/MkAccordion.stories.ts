import { h, ref } from 'vue';
import { MkAccordionItem } from '@magic/kit/components/MkAccordionItem';
import { MkDoneIcon } from '@magic/kit/icons';

import MkAccordion from './MkAccordion.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Components/Accordion/MkAccordion',
  component: MkAccordion,
  subcomponents: { MkAccordionItem },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    modelValue: {
      control: 'object',
    },
    multiple: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof MkAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { MkAccordion, MkAccordionItem },
    setup() {
      return { args };
    },
    template: `
      <MkAccordion v-bind="args">
        <MkAccordionItem name="1" title="Первый элемент">
          Контент первого элемента аккордеона.
        </MkAccordionItem>
        <MkAccordionItem name="2" title="Второй элемент">
          Контент второго элемента аккордеона.
        </MkAccordionItem>
        <MkAccordionItem name="3" title="Третий элемент">
          Контент третьего элемента аккордеона.
        </MkAccordionItem>
      </MkAccordion>
    `,
  }),
};

export const MultipleMode: Story = {
  args: {
    multiple: true,
  },
  render: (args) => ({
    components: { MkAccordion, MkAccordionItem },
    setup() {
      return { args };
    },
    template: `
      <MkAccordion v-bind="args">
        <MkAccordionItem name="1" title="Можно открыть все">
          Первый элемент раскрыт.
        </MkAccordionItem>
        <MkAccordionItem name="2" title="Независимо">
          Второй элемент раскрыт.
        </MkAccordionItem>
        <MkAccordionItem name="3" title="Друг от друга">
          Третий элемент раскрыт.
        </MkAccordionItem>
      </MkAccordion>
    `,
  }),
};

export const WithModelValue: Story = {
  render: () => ({
    components: { MkAccordion, MkAccordionItem },
    setup() {
      const open = ref(['2']);
      return { open };
    },
    template: `
      <div>
        <p>Открытые элементы: {{ open }}</p>
        <MkAccordion v-model="open">
          <MkAccordionItem name="1" title="Первый">
            Контент первого.
          </MkAccordionItem>
          <MkAccordionItem name="2" title="Второй (изначально открыт)">
            Контент второго.
          </MkAccordionItem>
          <MkAccordionItem name="3" title="Третий">
            Контент третьего.
          </MkAccordionItem>
        </MkAccordion>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { MkAccordion, MkAccordionItem },
    template: `
      <MkAccordion>
        <MkAccordionItem name="1" title="Доступный элемент">
          Контент доступного элемента.
        </MkAccordionItem>
        <MkAccordionItem name="2" title="Заблокированный элемент" disabled>
          Этот элемент нельзя раскрыть.
        </MkAccordionItem>
        <MkAccordionItem name="3" title="Ещё один элемент">
          Контент ещё одного элемента.
        </MkAccordionItem>
      </MkAccordion>
    `,
  }),
};

export const CustomHeader: Story = {
  render: () => ({
    components: { MkAccordion, MkAccordionItem, MkDoneIcon },
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
      <MkAccordion>
        <MkAccordionItem name="1" :title="customTitle">
          Заголовок передан как render-функция через проп title.
        </MkAccordionItem>
        <MkAccordionItem name="2" headerStyles="background:var(--mk-color-primary-200);" >
          <template #header="{ isOpen }">
          <span class="d-flex align-center ga-1 "
            :style="{ fontWeight: isOpen ? 'bold' : 'normal', color: isOpen ? 'var(--mk-color-primary)' : 'inherit' }">
              <MkDoneIcon size="10" />
              Кастомный заголовок через слот
            </span>
          </template>
          Заголовок передан через слот #header — полный контроль над разметкой.
        </MkAccordionItem>
        <MkAccordionItem name="3" title="Обычный строковый заголовок">
          Для сравнения.
        </MkAccordionItem>
      </MkAccordion>
    `,
  }),
};

export const DefaultOpen: Story = {
  render: () => ({
    components: { MkAccordion, MkAccordionItem },
    template: `
      <MkAccordion>
        <MkAccordionItem name="1" title="Обычный элемент">
          Закрыт по умолчанию.
        </MkAccordionItem>
        <MkAccordionItem name="2" title="Открыт по умолчанию" default-open>
          Этот элемент изначально раскрыт благодаря пропу defaultOpen.
        </MkAccordionItem>
      </MkAccordion>
    `,
  }),
};

export const StandaloneItem: Story = {
  render: () => ({
    components: { MkAccordionItem },
    template: `
      <div>
        <MkAccordionItem name="s" title="Автономный элемент (без MkAccordion)">
          Работает и без родительского MkAccordion — состояние управляется локально.
        </MkAccordionItem>
      </div>
    `,
  }),
};
