import { track } from '../analytics.js'
/**
 * Компонент вищого порядку (HOC): отримує компонент і повертає новий, який
 * рендерить `Component` з тими самими props, а під час кліку ще й надсилає
 * подію `event` в аналітику (`track` з src/analytics.js).
 *
 * Використання:
 *   const AddToCartButton = withAnalytics(Button, 'add_to_cart')
 *
 *   <AddToCartButton analyticsData={{ productId }} onClick={add}>
 *     Додати в кошик
 *   </AddToCartButton>
 *
 * Поки що повертає `Component` без змін. Вимоги — у тестах
 * tests/withAnalytics.test.jsx.
 */
export function withAnalytics(Component, event) {
  function AnalyticsComponent({ analyticsData, onClick, ref, ...props }) {
    function handleClick(...args) {
      track(event, analyticsData)
      onClick?.(...args)
    }

    return <Component {...props} ref={ref} onClick={handleClick} />
  }

  const componentName = Component.displayName || Component.name || 'Component'
  AnalyticsComponent.displayName = `withAnalytics(${componentName})`
  return AnalyticsComponent
}
