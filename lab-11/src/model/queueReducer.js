/**
 * Ред'юсер черги замовлень. Його написав колега; у нього черга працює.
 *
 * Стан: { orders: [...] }. Кожне замовлення — як у src/data/orders.js:
 *   { id, number, status, customer: { id, name }, items: [...] }
 * status — колонка на дошці: 'new' («Нові»), 'brewing' («Готуються»),
 * 'ready' («Готові») або 'served' («Видані»).
 *
 * Дії — події на сторінці:
 *   { type: 'order_placed', order: { id, customer: { id, name }, items } }
 *       бариста надіслав нове замовлення з форми. Номер і статус 'new'
 *       дає ред'юсер, кожен напій отримує done: false. id замовлення й
 *       гостя створює обробник події.
 *   { type: 'item_toggled', orderId, itemId }
 *       бариста відмітив напій готовим або зняв позначку
 *   { type: 'order_advanced', orderId }
 *       бариста натиснув «Почати», «Готово» чи «Видати»: замовлення
 *       переходить у наступну колонку
 *   { type: 'order_cancelled', orderId }
 *       бариста натиснув «Скасувати замовлення»
 *   { type: 'customer_renamed', customerId, name }
 *       бариста виправив ім'я гостя в «Деталях»
 *
 * Компоненти й тести читають стан лише через selectColumn і selectOrder
 * унизу файлу.
 */

const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

/** Початковий стан черги з вкладених замовлень, як їх повертає loadOrders(). */
export function createInitialState(orders) {
  const ordersById = {}
  const orderIds = []
  const customersById = {}
  const customerIds = []

  let lastNumber = 0

  for (const order of orders) {
    const { customer, ...orderData } = order

    ordersById[order.id] = { ...orderData, customerId: customer.id }

    orderIds.push(order.id)

    if (!customersById[customer.id]) {
      customersById[customer.id] = customer
      customerIds.push(customer.id)
    }

    lastNumber = Math.max(lastNumber, order.number)
  }

  return {
    orders: { byId: ordersById, ids: orderIds },
    customers: { byId: customersById, ids: customerIds },
    lastNumber,
  }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const number = state.lastNumber + 1
      const { customer, ...orderData } = action.order

      const order = {
        ...orderData,
        number,
        status: 'new',
        customerId: customer.id,
        items: action.order.items.map((item) => ({ ...item, done: false })),
      }
      return {
        ...state,
        lastNumber: number,
        orders: {
          byId: {
            ...state.orders.byId,
            [order.id]: order,
          },
          ids: [...state.orders.ids, order.id],
        },
        customers: {
          byId: {
            ...state.customers.byId,
            [customer.id]: customer,
          },
          ids: state.customers.ids.includes(customer.id)
            ? state.customers.ids
            : [...state.customers.ids, customer.id],
        },
      }
    }
    case 'item_toggled': {
      const order = state.orders.byId[action.orderId]

      if (!order) return state

      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [order.id]: {
              ...order,
              items: order.items.map((item) =>
                item.id === action.itemId
                  ? { ...item, done: !item.done }
                  : item,
              ),
            },
          },
        },
      }
    }
    case 'order_advanced': {
      const order = state.orders.byId[action.orderId]

      if (!order) return state

      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [order.id]: {
              ...order,
              status: nextStatus[order.status],
            },
          },
        },
      }
    }
    case 'order_cancelled': {
      const { [action.orderId]: removedOrder, ...remainingOrders } =
        state.orders.byId

      if (!removedOrder) return state

      return {
        ...state,
        orders: {
          byId: remainingOrders,
          ids: state.orders.ids.filter((id) => id !== action.orderId),
        },
      }
    }
    case 'customer_renamed': {
      const customer = state.customers.byId[action.customerId]

      if (!customer) return state

      return {
        ...state,
        customers: {
          ...state.customers,
          byId: {
            ...state.customers.byId,
            [customer.id]: {
              ...customer,
              name: action.name,
            },
          },
        },
      }
    }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

/**
 * Замовлення однієї колонки (status) у порядку надходження, кожне разом із
 * гостем і напоями.
 */
export function selectColumn(state, status) {
  return state.orders.ids
    .map((id) => state.orders.byId[id])
    .filter((order) => order.status === status)
    .map((order) => ({
      ...order,
      customer: state.customers.byId[order.customerId],
    }))
}

/** Замовлення за id разом із гостем і напоями; undefined, якщо його немає. */
export function selectOrder(state, id) {
  const order = state.orders.byId[id]

  if (!order) return undefined

  return { ...order, customer: state.customers.byId[order.customerId] }
}
