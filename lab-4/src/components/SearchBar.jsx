export default function SearchBar({filterText, setFilterText, inStockOnly, setInStockOnly }) {
  return (
    <search className="search-bar">
      <input
        type="search"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        placeholder="Пошук у меню"
        aria-label="Пошук у меню"
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          />{' '}
        Лише в наявності
      </label>
    </search>
  )
}
