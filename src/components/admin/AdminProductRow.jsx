import { memo } from 'react';
import { Link } from 'react-router-dom';

import Badge from '../Badge';
import Button from '../Button';
import PriceTag from '../PriceTag';
import { formatCategory } from '../../utils/format';

function StatusBadge({ product }) {
  if (product.isRemoved) return <Badge variant="danger">Removed</Badge>;
  if (!product.isActive) return <Badge variant="warning">Hidden</Badge>;
  return <Badge variant="success">Active</Badge>;
}

// One row of the catalog list. memo keeps the rows from re-rendering when only
// the search box or a notice changes on the admin page.
function AdminProductRow({ product, onEdit, onToggleActive, onRemove, onRestore }) {
  return (
    <li
      className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
        product.isRemoved ? 'bg-stone-50 opacity-70' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-4">
        <img
          src={product.thumbnail}
          alt=""
          className="h-16 w-16 shrink-0 rounded-xl bg-stone-100 object-contain p-1"
        />
        <div className="min-w-0">
          <Link
            to={`/products/${product.id}`}
            className="line-clamp-1 font-semibold hover:text-teal-700"
          >
            {product.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-500">{formatCategory(product.category)}</span>
            <StatusBadge product={product} />
            {product.isCustom && <Badge variant="brand">Custom</Badge>}
            {product.discountPercentage > 0 && (
              <Badge variant="sale">-{product.discountPercentage}%</Badge>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4">
            <PriceTag
              price={product.price}
              finalPrice={product.finalPrice}
              discountPercentage={product.discountPercentage}
            />
            <span
              className={`text-xs ${
                product.stock < 1 ? 'font-semibold text-rose-600' : 'text-stone-500'
              }`}
            >
              {product.stock < 1 ? 'Out of stock' : `${product.stock} in stock`}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {product.isRemoved ? (
          <Button size="small" onClick={() => onRestore(product)}>
            Restore
          </Button>
        ) : (
          <>
            <Button size="small" variant="outline" onClick={() => onEdit(product)}>
              Edit
            </Button>
            <Button size="small" variant="outline" onClick={() => onToggleActive(product)}>
              {product.isActive ? 'Hide' : 'Show'}
            </Button>
            <Button size="small" variant="danger" onClick={() => onRemove(product)}>
              Remove
            </Button>
          </>
        )}
      </div>
    </li>
  );
}

export default memo(AdminProductRow);
