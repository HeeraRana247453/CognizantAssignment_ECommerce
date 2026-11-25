import { useState, useMemo, useEffect, useCallback } from 'react';

import { useProducts } from '../hooks/useProducts';
import Alert from '../components/Alert';
import Button from '../components/Button';
import ConfirmModal from '../components/ConfirmModal';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import Input from '../components/Input';
import AddProductForm from '../components/admin/AddProductForm';
import AdminProductRow from '../components/admin/AdminProductRow';
import EditProductModal from '../components/admin/EditProductModal';
import StatCard from '../components/admin/StatCard';

const PAGE_SIZE = 20;

const selectClasses =
  'rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/15';

// Only admins can reach this page, <ProtectedRoute allowedRoles={['admin']}> in App.jsx
// takes care of that. Everything here changes the shared catalog in ProductsContext.
function AdminPage() {
  const {
    products,
    loading,
    error,
    refetch,
    addProduct,
    updateProduct,
    toggleActive,
    removeProduct,
    restoreProduct,
    resetCatalog,
  } = useProducts();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [editing, setEditing] = useState(null); // product being edited
  const [removing, setRemoving] = useState(null); // product waiting for remove confirmation
  const [showReset, setShowReset] = useState(false);
  const [notice, setNotice] = useState(null); // { variant, text }

  // success/error banner goes away by itself after a few seconds
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const stats = useMemo(() => {
    const live = products.filter((p) => !p.isRemoved);
    return {
      total: live.length,
      active: live.filter((p) => p.isActive).length,
      hidden: live.filter((p) => !p.isActive).length,
      onSale: live.filter((p) => p.discountPercentage > 0).length,
      outOfStock: live.filter((p) => p.stock < 1).length,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      if (!product.title.toLowerCase().includes(term)) return false;

      switch (statusFilter) {
        case 'active':
          return product.isActive && !product.isRemoved;
        case 'hidden':
          return !product.isActive && !product.isRemoved;
        case 'removed':
          return product.isRemoved;
        case 'sale':
          return product.discountPercentage > 0 && !product.isRemoved;
        case 'out-of-stock':
          return product.stock < 1 && !product.isRemoved;
        default:
          return true;
      }
    });
  }, [products, search, statusFilter]);

  const shownProducts = filteredProducts.slice(0, visibleCount);

  // These go into memoized children (AddProductForm, AdminProductRow). Keeping the
  // function references stable means typing in the search box doesn't re-render them.
  const handleAddProduct = useCallback(
    (values) => {
      const created = addProduct(values);
      setNotice({ variant: 'success', text: `"${created.title}" was added to the catalog.` });
    },
    [addProduct]
  );

  const handleToggleActive = useCallback(
    (product) => {
      toggleActive(product.id);
      setNotice({
        variant: 'success',
        text: product.isActive
          ? `"${product.title}" is now hidden from the store.`
          : `"${product.title}" is visible in the store again.`,
      });
    },
    [toggleActive]
  );

  const handleRestore = useCallback(
    (product) => {
      restoreProduct(product.id);
      setNotice({ variant: 'success', text: `"${product.title}" was restored.` });
    },
    [restoreProduct]
  );

  function handleSaveEdit(id, changes) {
    updateProduct(id, changes);
    setNotice({
      variant: 'success',
      text:
        changes.discount > 0
          ? `Saved. "${editing.title}" now has a ${changes.discount}% discount.`
          : `Saved. "${editing.title}" has no discount.`,
    });
    setEditing(null);
  }

  function confirmRemove() {
    removeProduct(removing.id);
    setNotice({ variant: 'success', text: `"${removing.title}" was removed. You can restore it later.` });
    setRemoving(null);
  }

  function confirmReset() {
    resetCatalog();
    setShowReset(false);
    setVisibleCount(PAGE_SIZE);
    setNotice({ variant: 'success', text: 'Catalog reset to the demo data.' });
  }

  if (loading) return <Loader text="Loading catalog..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Admin Panel</h1>
          <p className="mt-1 text-stone-500">
            Add products, set discounts and control what customers see.
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowReset(true)}>
          Reset demo data
        </Button>
      </div>

      {notice && (
        <Alert variant={notice.variant} onClose={() => setNotice(null)}>
          {notice.text}
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Products" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Hidden" value={stats.hidden} />
        <StatCard label="On sale" value={stats.onSale} />
        <StatCard label="Out of stock" value={stats.outOfStock} />
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-[400px_1fr]">
        <AddProductForm categories={categories} onAddProduct={handleAddProduct} />

        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 p-5">
            <h2 className="font-display text-xl font-semibold">Catalog</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px]">
              <Input
                type="search"
                placeholder="Search by name"
                aria-label="Search catalog"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className={selectClasses}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All products</option>
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
                <option value="removed">Removed</option>
                <option value="sale">On sale</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="p-10 text-center text-sm text-stone-500">
              No products match these filters.
            </p>
          ) : (
            <>
              <ul className="divide-y divide-stone-200">
                {shownProducts.map((product) => (
                  <AdminProductRow
                    key={product.id}
                    product={product}
                    onEdit={setEditing}
                    onToggleActive={handleToggleActive}
                    onRemove={setRemoving}
                    onRestore={handleRestore}
                  />
                ))}
              </ul>

              {filteredProducts.length > visibleCount && (
                <div className="border-t border-stone-200 p-4 text-center">
                  <Button variant="outline" onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}>
                    Show more ({filteredProducts.length - visibleCount} left)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {editing && (
        <EditProductModal
          key={editing.id}
          product={editing}
          onSave={handleSaveEdit}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(removing)}
        title="Remove this product?"
        message={removing ? `"${removing.title}" will disappear from the store. You can restore it from the Removed filter.` : ''}
        confirmLabel="Remove"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setRemoving(null)}
      />

      <ConfirmModal
        isOpen={showReset}
        title="Reset demo data?"
        message="This deletes the products you added and puts every discount, hidden and removed product back to the starting state."
        confirmLabel="Reset"
        danger
        onConfirm={confirmReset}
        onCancel={() => setShowReset(false)}
      />
    </section>
  );
}

export default AdminPage;
