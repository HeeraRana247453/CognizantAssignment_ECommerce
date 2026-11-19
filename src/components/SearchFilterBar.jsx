import Input from './Input';
import { formatCategory } from '../utils/format';

function SearchFilterBar({
  searchTerm,
  onSearchChange,
  category,
  categories,
  onCategoryChange,
  sortOrder,
  onSortChange,
}) {
  return (
    <div className="filter-bar">
      <Input
        type="search"
        placeholder="Search products by name"
        aria-label="Search products"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        className="input"
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
        className="input"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort by price"
      >
        <option value="default">Sort: Featured</option>
        <option value="low-high">Price: Low to high</option>
        <option value="high-low">Price: High to low</option>
      </select>
    </div>
  );
}

export default SearchFilterBar;
