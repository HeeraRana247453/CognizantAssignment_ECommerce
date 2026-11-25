import Input from './Input';
import { SearchIcon } from './Icons';
import { formatCategory } from '../utils/format';

const selectClasses =
  'rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/15';

function SearchFilterBar({
  searchTerm,
  onSearchChange,
  category,
  categories,
  onCategoryChange,
  sortOrder,
  onSortChange,
  onSaleOnly,
  onSaleOnlyChange,
}) {
  return (
    <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            type="search"
            placeholder="Search products by name"
            aria-label="Search products"
            className="[&_input]:pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          className={selectClasses}
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {formatCategory(cat)}
            </option>
          ))}
        </select>

        <select
          className={selectClasses}
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort by price"
        >
          <option value="default">Sort: Featured</option>
          <option value="low-high">Price: Low to high</option>
          <option value="high-low">Price: High to low</option>
        </select>
      </div>

      <label className="mt-3 inline-flex items-center gap-2 text-sm text-stone-600">
        <input
          type="checkbox"
          checked={onSaleOnly}
          onChange={(e) => onSaleOnlyChange(e.target.checked)}
          className="h-4 w-4 rounded border-stone-300 accent-teal-700"
        />
        Show only items on sale
      </label>
    </div>
  );
}

export default SearchFilterBar;
