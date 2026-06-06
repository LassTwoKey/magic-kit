/**
 * Резолвер компонентов Magic Kit для плагинов авто-импорта.
 *
 * Обрабатывает компоненты с префиксом `mk-` (kebab-case) или `Mk` (PascalCase)
 * и возвращает путь импорта из соответствующего пакета:
 * - иконки (`*Icon` / `*-icon`) — из `@magic/kit/icons`;
 * - остальные компоненты — из `@magic/kit/components`.
 *
 * @param componentName - Имя компонента в kebab-case или PascalCase.
 * @returns Объект с полями `name` (PascalCase-имя экспорта) и `from` (путь импорта),
 * или `undefined`, если компонент не относится к Magic Kit.
 *
 * @example
 * // В конфиге vite.config.ts / vue.config.ts:
 * Components({ resolvers: [MkResolver] })
 *
 * @example
 * MkResolver('mk-button');
 * // { name: 'MkButton', from: '@magic/kit/components' }
 *
 * MkResolver('mk-close-icon');
 * // { name: 'MkCloseIcon', from: '@magic/kit/icons' }
 *
 * MkResolver('MkInput');
 * // { name: 'MkInput', from: '@magic/kit/components' }
 *
 * MkResolver('MkSearchIcon');
 * // { name: 'MkSearchIcon', from: '@magic/kit/icons' }
 *
 * MkResolver('ElButton');
 * // undefined
 */
export default function MkResolver(componentName: string) {
  // Проверяем, начинается ли имя компонента с 'mk-' или 'Mk'
  if (componentName.startsWith('mk-') || componentName.startsWith('Mk')) {
    // Проверяем, заканчивается ли имя компонента на 'Icon' или '-icon'
    const isIconComponent = componentName.endsWith('Icon') || componentName.endsWith('-icon');

    // Определяем базовый путь импорта
    const basePath = isIconComponent ? '@magic/kit/icons' : '@magic/kit/components';

    // Преобразуем имя компонента в PascalCase для импорта
    let pascalCaseName;
    if (componentName.startsWith('mk-')) {
      // Преобразуем 'mk-component-icon' -> 'MkComponentIcon'
      pascalCaseName =
        'Mk' +
        componentName
          .slice(2) // Убираем 'mk'
          .replace(/-icon$/i, 'Icon') // Заменяем '-icon' в конце на 'Icon'
          .replace(/-(\w)/g, (_, c: string) => c.toUpperCase()); // Остальные дефисы в PascalCase
    } else {
      // Для имен, начинающихся с 'Mk' (уже в PascalCase)
      pascalCaseName = componentName;
    }

    return {
      name: pascalCaseName, // Имя импортируемого компонента
      from: basePath, // Путь, откуда импортировать
    };
  }
  // Возвращаем undefined, если компонент не подходит под условия
  return undefined;
}
