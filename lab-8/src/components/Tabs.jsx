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
import { createContext, use, useState } from 'react'

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

  return (
    <TabsContext value={{ value, setValue }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

function List({ children, ...props }) {
  return (
    <div className="tab-list" {...props}>
      {children}
    </div>
  )
}

function Tab({ value, children }) {
  const context = useTabsContext()
  return (
    <button
      type="button"
      className={context.value === value ? 'active' : ''}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  )
}

function Panel({ value, children }) {
  const context = useTabsContext()
  return <div hidden={context.value !== value}>{children}</div>
}

Tabs.List = List
Tabs.Tab = Tab
Tabs.Panel = Panel

export default Tabs
