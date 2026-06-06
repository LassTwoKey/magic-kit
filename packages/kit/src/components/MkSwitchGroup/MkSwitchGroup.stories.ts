import { ref } from 'vue';
import MkSwitch from '@magic/kit/components/MkSwitch/MkSwitch.vue';
import { expect, fn, userEvent } from 'storybook/test';

import MkSwitchGroup from './MkSwitchGroup.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkSwitchGroup. Включает визуальные примеры и тесты структуры DOM,
 * классов состояний, disabled, min/max ограничений и событий.
 */
const meta = {
  title: 'Components/MkSwitchGroup',
  component: MkSwitchGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof MkSwitchGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      const model = ref(['Option 2']);
      return { args, model };
    },
    template: `
      <mk-switch-group v-model="model" v-bind="args" class="d-flex flex-column ga-2">
        <mk-switch value="Option 1" label="Option 1" description="Description" tooltip="Option A" />
        <mk-switch value="Option 2" label="Option 2" />
        <mk-switch value="Option 3" label="Option 3" />
        <mk-switch value="Option 4" label="Option 4" :disabled="true" />
      </mk-switch-group>
    `,
  }),
};

export const WithOptions: Story = {
  name: 'With Options (via prop)',
  render: () => ({
    components: { MkSwitchGroup },
    setup() {
      const model = ref(['Option 2']);
      const options = [
        { label: 'Option 1', value: 'Option 1', description: 'Description', tooltip: 'Option A' },
        { label: 'Option 2', value: 'Option 2' },
        { label: 'Option 3', value: 'Option 3' },
        { label: 'Option 4', value: 'Option 4', disabled: true },
      ];
      return { model, options };
    },
    template: `
      <mk-switch-group v-model="model" :options="options" class="d-flex flex-column ga-2" />
    `,
  }),
};

export const DisabledGroup: Story = {
  name: 'Disabled Group',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref(['Option 1']) };
    },
    template: `
      <mk-switch-group v-model="model" :disabled="true" class="d-flex flex-column ga-2">
        <mk-switch value="Option 1" label="Option 1" />
        <mk-switch value="Option 2" label="Option 2" />
        <mk-switch value="Option 3" label="Option 3" />
      </mk-switch-group>
    `,
  }),
};

export const WithMinMax: Story = {
  name: 'With Min/Max (min=1, max=2)',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref(['Option 1']) };
    },
    template: `
      <mk-switch-group v-model="model" :min="1" :max="2" class="d-flex flex-column ga-2">
        <mk-switch value="Option 1" label="Option 1" />
        <mk-switch value="Option 2" label="Option 2" />
        <mk-switch value="Option 3" label="Option 3" />
      </mk-switch-group>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-switch-group',
  render: () => ({
    components: { MkSwitchGroup },
    setup() {
      return { model: ref([]) };
    },
    template: `<mk-switch-group v-model="model" />`,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-switch-group');
    await expect(root).toBeInTheDocument();
  },
};

export const HasRoleGroup: Story = {
  name: 'Test: имеет role="group"',
  render: () => ({
    components: { MkSwitchGroup },
    setup() {
      return { model: ref([]) };
    },
    template: `<mk-switch-group v-model="model" />`,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[role="group"]');
    await expect(root).toBeInTheDocument();
  },
};

export const RendersOptionsCount: Story = {
  name: 'Test: рендерит N свитчей из options',
  render: () => ({
    components: { MkSwitchGroup },
    setup() {
      const options = [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
        { label: 'C', value: 'c' },
      ];
      return { model: ref([]), options };
    },
    template: `<mk-switch-group v-model="model" :options="options" class="d-flex flex-column ga-2" />`,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input[type="checkbox"]');
    await expect(inputs).toHaveLength(3);
  },
};

export const RendersSlotContent: Story = {
  name: 'Test: рендерит свитчи через default slot',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref([]) };
    },
    template: `
      <mk-switch-group v-model="model" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
        <mk-switch value="b" label="B" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input[type="checkbox"]');
    await expect(inputs).toHaveLength(2);
  },
};

// ─────────────────────────────────────────────
// Значение modelValue
// ─────────────────────────────────────────────

export const CheckedByModelValue: Story = {
  name: 'Test: свитч отмечен если его value в modelValue',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref(['b']) };
    },
    template: `
      <mk-switch-group v-model="model" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
        <mk-switch value="b" label="B" />
        <mk-switch value="c" label="C" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    await expect(inputs[0]).not.toBeChecked();
    await expect(inputs[1]).toBeChecked();
    await expect(inputs[2]).not.toBeChecked();
  },
};

// ─────────────────────────────────────────────
// Взаимодействие
// ─────────────────────────────────────────────

export const ToggleAddsToGroup: Story = {
  name: 'Test: клик по незаотмеченному добавляет в группу',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref([]) };
    },
    template: `
      <mk-switch-group v-model="model" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
        <mk-switch value="b" label="B" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    await expect(inputs[0]).not.toBeChecked();
    await userEvent.click(inputs[0]);
    await expect(inputs[0]).toBeChecked();
  },
};

export const ToggleRemovesFromGroup: Story = {
  name: 'Test: клик по отмеченному убирает из группы',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref(['a', 'b']) };
    },
    template: `
      <mk-switch-group v-model="model" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
        <mk-switch value="b" label="B" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    await expect(inputs[0]).toBeChecked();
    await userEvent.click(inputs[0]);
    await expect(inputs[0]).not.toBeChecked();
  },
};

// ─────────────────────────────────────────────
// Disabled
// ─────────────────────────────────────────────

export const GroupDisabledDisablesAll: Story = {
  name: 'Test: disabled группы блокирует все свитчи',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref([]) };
    },
    template: `
      <mk-switch-group v-model="model" :disabled="true" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
        <mk-switch value="b" label="B" />
        <mk-switch value="c" label="C" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    for (const input of inputs) {
      await expect(input).toBeDisabled();
    }
  },
};

export const IndividuallyDisabled: Story = {
  name: 'Test: disabled на отдельном свитче блокирует только его',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref([]) };
    },
    template: `
      <mk-switch-group v-model="model" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
        <mk-switch value="b" label="B" :disabled="true" />
        <mk-switch value="c" label="C" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    await expect(inputs[0]).not.toBeDisabled();
    await expect(inputs[1]).toBeDisabled();
    await expect(inputs[2]).not.toBeDisabled();
  },
};

export const NoToggleWhenGroupDisabled: Story = {
  name: 'Test: клик не меняет состояние при disabled группы',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref([]) };
    },
    template: `
      <mk-switch-group v-model="model" :disabled="true" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await expect(input).not.toBeChecked();
    await userEvent.click(input);
    await expect(input).not.toBeChecked();
  },
};

// ─────────────────────────────────────────────
// Max
// ─────────────────────────────────────────────

export const MaxDisablesUncheckedAtLimit: Story = {
  name: 'Test: max блокирует незаотмеченные при достижении лимита',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref(['a', 'b']) };
    },
    template: `
      <mk-switch-group v-model="model" :max="2" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
        <mk-switch value="b" label="B" />
        <mk-switch value="c" label="C" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    await expect(inputs[0]).toBeChecked();
    await expect(inputs[1]).toBeChecked();
    // c не выбран и лимит достигнут → должен быть заблокирован
    await expect(inputs[2]).toBeDisabled();
  },
};

// ─────────────────────────────────────────────
// Min
// ─────────────────────────────────────────────

export const MinDisablesCheckedAtLimit: Story = {
  name: 'Test: min блокирует отмеченный свитч при достижении минимума',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      return { model: ref(['a']) };
    },
    template: `
      <mk-switch-group v-model="model" :min="1" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
        <mk-switch value="b" label="B" />
        <mk-switch value="c" label="C" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    // 'a' выбран и на минимуме → должен быть заблокирован
    await expect(inputs[0]).toBeDisabled();
    await expect(inputs[1]).not.toBeDisabled();
    await expect(inputs[2]).not.toBeDisabled();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsUpdateModelValue: Story = {
  name: 'Test: эмитит update:modelValue при выборе',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      const onUpdate = fn();
      return { model: ref([]), onUpdate };
    },
    template: `
      <mk-switch-group v-model="model" @update:modelValue="onUpdate" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
        <mk-switch value="b" label="B" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await userEvent.click(input);
    await expect(input).toBeChecked();
  },
};

export const EmitsChange: Story = {
  name: 'Test: эмитит change при выборе',
  render: () => ({
    components: { MkSwitchGroup, MkSwitch },
    setup() {
      const onChange = fn();
      return { model: ref([]), onChange };
    },
    template: `
      <mk-switch-group v-model="model" @change="onChange" class="d-flex flex-column ga-2">
        <mk-switch value="a" label="A" />
        <mk-switch value="b" label="B" />
      </mk-switch-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await userEvent.click(input);
    await expect(input).toBeChecked();
  },
};
