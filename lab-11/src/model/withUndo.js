/**
 * Ред'юсер вищого порядку: отримує ред'юсер і повертає новий, який веде
 * історію змін. Стан нового ред'юсера — історія:
 *
 *   { past: [...], present, future: [...] }
 *
 * present — стан, з яким працює reducer; past — попередні стани, від
 * найстарішого до останнього; future — скасовані стани, які можна
 * повторити, від найближчого.
 *
 * Дії:
 *   { type: 'undo' }  повертає попередній стан
 *   { type: 'redo' }  повторює скасовану дію
 *   будь-яка інша дія йде в reducer разом із present. Якщо reducer
 *   повернув той самий стан, історія не змінюється.
 *
 * Історія зберігає не більше limit кроків. Як і будь-який ред'юсер, новий
 * ред'юсер не змінює історію, яку отримав.
 *
 * Використання на прикладі лічильника:
 *   const undoableCounter = withUndo(counterReducer)
 *   undoableCounter(createHistory(0), { type: 'incremented' })
 *   // { past: [0], present: 1, future: [] }
 *
 * Поки що кидає помилку. Вимоги — у тестах tests/withUndo.test.js і
 * tests/HistoryButtons.test.jsx.
 */
export function withUndo(reducer, limit = 20) {
  return function historyReducer(history, action) {
    switch (action.type) {
      case 'undo': {
        if (history.past.length === 0) {
          return history
        }
        const previous = history.past[history.past.length - 1]
        return {
          past: history.past.slice(0, -1),
          present: previous,
          future: [history.present, ...history.future],
        }
      }

      case 'redo': {
        if (history.future.length === 0) {
          return history
        }
        const next = history.future[0]
        return {
          past: [...history.past, history.present].slice(-limit),
          present: next,
          future: history.future.slice(1),
        }
      }

      default: {
        const nextPresent = reducer(history.present, action)
        if (nextPresent === history.present) {
          return history
        }
        return {
          past:
            limit > 0 ? [...history.past, history.present].slice(-limit) : [],
          present: nextPresent,
          future: [],
        }
      }
    }
  }
}

/** Історія, з якої починають: present і порожні past та future. */
export function createHistory(present) {
  return { past: [], present, future: [] }
}
