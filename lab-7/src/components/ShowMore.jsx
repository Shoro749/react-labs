import { useState } from 'react'
/**
 * Показує перші `step` елементів з `items` і кнопку, що показує наступні.
 *
 * Використання:
 *   <ShowMore items={reviews} step={3}>
 *     {(visibleItems) => <ul>…</ul>}
 *   </ShowMore>
 *
 * Вимоги — у тестах tests/ShowMore.test.jsx.
 */

export default function ShowMore({ items, step, children }) {
  const [visibleCount, setVisibleCount] = useState(step)

  const visibleItems = items.slice(0, visibleCount)
  const isExpanded = visibleCount >= items.length
  const remaining = items.length - visibleCount

  function handleClick() {
    if (isExpanded) {
      setVisibleCount(step)
    } else {
      setVisibleCount((count) => Math.min(count + step, items.length))
    }
  }

  return (
    <>
      {children(visibleItems)}

      {items.length > step && (
        <button onClick={handleClick}>
          {isExpanded ? 'Згорнути' : `Показати ще ${Math.min(step, remaining)}`}
        </button>
      )}
    </>
  )
}
