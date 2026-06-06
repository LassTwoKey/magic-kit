import { EVENT_CODE } from '@magic/kit/constants';

import type { EventCode } from '@magic/kit/constants';

type EventHandler<E extends Event = Event> = (event: E) => boolean | void;

interface ComposeOptions {
  checkForDefaultPrevented?: boolean;
}

/**
 * Объединяет два обработчика события в один.
 *
 * Сначала вызывается `theirsHandler`. Если он возвращает `true` (или событие
 * помечено как `defaultPrevented` при `checkForDefaultPrevented: true`),
 * выполнение `oursHandler` пропускается.
 *
 * @param theirsHandler - внешний обработчик (например, переданный через `v-on`)
 * @param oursHandler - внутренний обработчик компонента
 * @param options - `checkForDefaultPrevented` (по умолчанию `true`)
 * @returns единый обработчик события
 */
export const composeEventHandlers = <E extends Event = Event>(
  theirsHandler: EventHandler<E>,
  oursHandler: EventHandler<E>,
  { checkForDefaultPrevented = true }: ComposeOptions = {}
): EventHandler<E> => {
  return (event: E) => {
    const shouldPrevent = theirsHandler?.(event);

    if (checkForDefaultPrevented === false || !shouldPrevent) {
      return oursHandler?.(event);
    }
  };
};

/**
 * Возвращает `event.code` клавиатурного события в виде `EventCode`,
 * если код идентифицирован, иначе `null`.
 *
 * Использует `event.code` (физическая клавиша, не зависит от раскладки),
 * что предпочтительнее `event.key` для обработки горячих клавиш.
 *
 * @param event - клавиатурное событие
 * @returns код клавиши или `null`
 */
export const getEventCode = (event: KeyboardEvent): EventCode | null => {
  if (event.code && event.code !== 'Unidentified') {
    return event.code as EventCode;
  }
  return null;
};

/**
 * Возвращает `event.key` клавиатурного события в виде `EventCode`,
 * если значение присутствует в перечне `EVENT_CODE`, иначе `null`.
 *
 * @param event - клавиатурное событие
 * @returns значение клавиши или `null`
 */
export const getEventKey = (event: KeyboardEvent): EventCode | null => {
  const key = event.key !== 'Unidentified' ? event.key : '';
  return Object.values(EVENT_CODE).includes(key as EventCode) ? (key as EventCode) : null;
};
