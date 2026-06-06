import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

import { kebabCase } from 'lodash-es';

/** Создать компонент в packages/kit/src/components/... */
async function createComponent(componentName: string) {
  try {
    const basePath = path.join(process.cwd(), 'packages', 'kit', 'src', 'components');
    const indexPath = path.join(process.cwd(), 'packages', 'kit', 'src', 'components', 'index.ts');
    const componentPath = path.join(basePath, componentName);
    const componentNameKebab = kebabCase(componentName);

    // Проверяем, существует ли папка
    try {
      await fs.access(componentPath);
      console.log(`✗ Папка ${componentName} уже существует`);
      return;
    } catch {
      console.error('Папка не существует, продолжаем');
    }

    // Создаем папку компонента
    await fs.mkdir(componentPath, { recursive: true });
    console.log(`✓ Папка ${componentName} создана`);

    // Создаем Vue файл
    const vueContent = `<template>
  <div class="${componentNameKebab}"></div>
</template>

<script>
export default {
  name: '${componentName}',
}
</script>

<style src="./${componentName}.scss"></style>
`;

    await fs.writeFile(path.join(componentPath, `${componentName}.vue`), vueContent);
    console.log(`✓ Файл ${componentName}.vue создан`);

    // Создаем SCSS файл
    const scssContent = `.${componentNameKebab} {
    
}`;

    await fs.writeFile(path.join(componentPath, `${componentName}.scss`), scssContent);
    console.log(`✓ Файл ${componentName}.scss создан`);

    // Создаем index.ts файл
    const indexContent = `export { default as ${componentName} } from './${componentName}.vue';\n`;

    await fs.writeFile(path.join(componentPath, 'index.ts'), indexContent);
    console.log(`✓ Файл index.ts создан`);

    console.log(`\n✓ Компонент ${componentName} успешно создан в ${componentPath}`);
    console.log(`\n! Не забудьте добавить экспорт в ${indexPath} !`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('✗ Ошибка при создании компонента:', error.message);
    } else {
      console.error('Непредвиденная ошибка');
    }
  }
}

/** Спросить имя компонента в CLI */
function askComponentName(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Введите название компонента: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/** Запуск скрипта создания компонента */
async function main() {
  const componentName = await askComponentName();

  if (!componentName) {
    console.log('✗ Название компонента не может быть пустым');
    return;
  }

  // Форматируем название (первая буква заглавная, убираем пробелы)
  const formattedName = componentName
    .trim()
    .replace(/\s+/g, '')
    .replace(/^\w/, (c) => c.toUpperCase());

  await createComponent(formattedName);
}

// Запускаем скрипт
main().catch(console.error);
