import { useCart } from '../../../features/cart/index.js'
import Link from '../../../shared/ui/Link.jsx'
import { paths } from '../../../shared/lib/paths.js'

export default function AppHeader() {
  const { count } = useCart()

  return (
    <header className="app-header">
      <Link to={paths.catalog()} className="brand">
        Кавова крамниця
      </Link>
      <nav aria-label="Основна навігація">
        <Link to={paths.cart()} className="cart-link">
          Кошик ({count})
        </Link>
      </nav>
    </header>
  )
}
