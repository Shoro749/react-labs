import { useId } from 'react'
import { AddToCartButton } from '../../../features/cart/index.js'
import { FavoriteButton } from '../../../features/favorite/index.js'
import Link from '../../../shared/ui/Link.jsx'
import { paths } from '../../../shared/lib/paths.js'

export default function BeanCard({ bean, compact = false }) {
  const titleId = useId()

  return (
    <article className="bean-card" aria-labelledby={titleId}>
      <h3 id={titleId}>
        <Link to={paths.bean(bean.id)}>{bean.name}</Link>
      </h3>
      <p>{bean.notes.join(', ')}</p>
      <p className="price">{bean.price} грн</p>
      <FavoriteButton productId={bean.id} name={bean.name} />
      {!compact && <AddToCartButton bean={bean} />}
    </article>
  )
}
