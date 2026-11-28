import { createContext, use } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
/**
 * Контексти черги замовлень і хуки, які їх читають.
 *
 * §4.4. Створіть і експортуйте тут два контексти, кожен через
 * createContext(null):
 *   QueueContext          значення — { queue, canUndo, canRedo }: стан
 *                         черги (present з історії) і чи є що скасувати
 *                         й повторити;
 *   QueueDispatchContext  значення — dispatch ред'юсера черги.
 *
 * §4.5. Хуки для компонентів. Кожен читає свій контекст, а якщо компонент
 * рендериться не всередині <QueueProvider>, кидає помилку, у тексті якої
 * названо QueueProvider.
 *
 * Поки що хуки кидають помилку. Вимоги — у тестах
 * tests/queueContext.test.jsx і tests/QueueProvider.test.jsx.
 */
export const QueueStoreContext = createContext(null)

function useQueueStore() {
  const store = use(QueueStoreContext)
  if (store === null) {
    throw new Error('Queue hooks must be used within a QueueProvider')
  }
  return store
}

/** { queue, canUndo, canRedo } з найближчого QueueProvider. */
export function useQueue() {
  const store = useQueueStore()
  return useStore(
    store,
    useShallow((state) => ({
      queue: state.history.present,
      canUndo: state.history.past.length > 0,
      canRedo: state.history.future.length > 0,
    })),
  )
}

/** dispatch ред'юсера черги з найближчого QueueProvider. */
export function useQueueDispatch() {
  const store = useQueueStore()
  return useStore(store, (state) => state.dispatch)
}
