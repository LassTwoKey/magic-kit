import fs from 'fs';
import path from 'path';

import { camelCase, upperFirst } from 'lodash-es';
import prettier from 'prettier';
import { optimize } from 'svgo';

import type { Config } from 'svgo';

/** Конфигурация SVGO */
const svgoConfig = {
  plugins: [
    'preset-default',
    {
      name: 'convertColors',
      params: {
        currentColor: true,
      },
    },
  ],
} satisfies Config;

/** Функция для форматирования кода с Prettier */
async function formatWithPrettier(code: string, parser = 'vue') {
  const options = await prettier.resolveConfig(process.cwd(), {
    config: 'prettier.config.js',
  });

  return prettier.format(code, {
    ...options,
    parser,
  });
}

/** Функция для преобразования имени файла в PascalCase */
function toPascalCase(filename: string) {
  const nameWithoutExt = filename.replace(/\.svg$/i, '');
  const withSpaces = nameWithoutExt.replace(/[-_]/g, ' ');
  return upperFirst(camelCase(withSpaces));
}

/** Функция для создания Vue компонента */
async function createVueComponent(svgContent: string) {
  const componentTemplate = `
<template>
${svgContent}
</template>
`;

  return await formatWithPrettier(componentTemplate);
}

/** Всегда генерируем index.ts */
async function generateIndexFile(directory: string) {
  const files = fs.readdirSync(directory);
  const vueComponents = files.filter((file) => file.endsWith('.vue'));

  const exports = vueComponents
    .map((component) => {
      const componentName = component.replace(/\.vue$/, '');
      return `export { default as ${componentName} } from './${componentName}.vue';`;
    })
    .join('\r\n');

  const indexContent = `// Auto-generated file
${exports}
`;

  const formattedContent = await formatWithPrettier(indexContent, 'babel');
  const indexPath = path.join(directory, 'index.ts');
  fs.writeFileSync(indexPath, formattedContent, 'utf8');
  console.log('Index.ts regenerated with all components');
}

/** Основная функция */
async function makeIcons() {
  const iconsDir = path.join(process.cwd(), 'packages/kit/src/icons');

  // Обработка SVG файлов
  const files = fs.readdirSync(iconsDir);
  const svgFiles = files.filter((file) => file.endsWith('.svg'));

  if (svgFiles.length > 0) {
    for (const file of svgFiles) {
      try {
        const filePath = path.join(iconsDir, file);
        const svgContent = fs.readFileSync(filePath, 'utf8');
        const result = optimize(svgContent, svgoConfig);
        const componentName = `Mk${toPascalCase(file)}Icon`;
        const vueComponent = await createVueComponent(result.data);

        fs.writeFileSync(path.join(iconsDir, `${componentName}.vue`), vueComponent, 'utf8');
        fs.unlinkSync(filePath);
        console.log(`Converted ${file} to ${componentName}.vue`);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }
  } else {
    console.log('No SVG files found to process');
  }

  await generateIndexFile(iconsDir);
}

// Запускаем процесс
void makeIcons();
