import { createContext, use, useId, useState } from 'react'
/**
 * Вкладки — складений компонент (compound component): `Tabs` і його частини
 * `Tabs.List`, `Tabs.Tab` і `Tabs.Panel`. Вміст кожної частини приходить між
 * її тегами як `children`, а яка вкладка обрана, частини дізнаються з
 * контексту, який створює `Tabs`.
 *
 * Використання:
 *   <Tabs defaultValue="brew">
 *     <Tabs.List aria-label="Про каву">
 *       <Tabs.Tab value="brew">Заварювання</Tabs.Tab>
 *       <Tabs.Tab value="reviews">Відгуки</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="brew">…</Tabs.Panel>
 *     <Tabs.Panel value="reviews">…</Tabs.Panel>
 *   </Tabs>
 *
 * Вимоги — у тестах tests/Tabs.children.test.jsx і tests/Tabs.a11y.test.jsx.
 */

const TabsContext = createContext(null)

function useTabsContext() {
  const context = use(TabsContext)
  if (!context) {
    throw new Error('Tabs parts must be used inside <Tabs>')
  }
  return context
}

function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue)
  const id = useId()

  return (
    <TabsContext value={{ value, setValue, id }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

function List({ children, ...props }) {
  function handleKeyDown(event) {
    const tabs = Array.from(
      event.currentTarget.querySelectorAll('[role="tab"]'),
    )
    const currentIndex = tabs.indexOf(event.target)
    if (currentIndex === -1) return

    let nextIndex
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1
    } else {
      return
    }

    event.preventDefault()
    tabs[nextIndex].click()
    tabs[nextIndex].focus()
  }

  return (
    <div
      className="tab-list"
      role="tablist"
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  )
}

function Tab({ value, children }) {
  const context = useTabsContext()
  const tabId = `${context.id}-tab-${encodeURIComponent(String(value))}`
  const panelId = `${context.id}-panel-${encodeURIComponent(String(value))}`
  const selected = context.value === value

  return (
    <button
      id={tabId}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      onClick={() => context.setValue(value)}
      onFocus={() => context.setValue(value)}
    >
      {children}
    </button>
  )
}

function Panel({ value, children }) {
  const context = useTabsContext()
  const tabId = `${context.id}-tab-${encodeURIComponent(String(value))}`
  const panelId = `${context.id}-panel-${encodeURIComponent(String(value))}`

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={context.value !== value}
    >
      {children}
    </div>
  )
}

Tabs.List = List
Tabs.Tab = Tab
Tabs.Panel = Panel

export default Tabs
