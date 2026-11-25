import { useState } from 'react';

import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import { formatPrice } from '../../utils/format';
import { applyDiscount } from '../../utils/catalog';
import { validateEditProductForm, MAX_DISCOUNT } from '../../utils/validation';

// Only mounted while a product is being edited (see AdminPage), so the form
// state below starts fresh with that product's values every time it opens.
function EditProductModal({ product, onSave, onClose }) {
  const [formData, setFormData] = useState({
    discount: String(product.discountPercentage),
    stock: String(product.stock),
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSave() {
    const validationErrors = validateEditProductForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSave(product.id, {
      discount: Number(formData.discount),
      stock: Number(formData.stock),
    });
  }

  function handleRemoveDiscount() {
    onSave(product.id, { discount: 0, stock: Number(formData.stock) || product.stock });
  }

  // live preview, only while the typed discount is valid
  const typedDiscount = Number(formData.discount);
  const previewIsValid =
    formData.discount.trim() !== '' &&
    Number.isInteger(typedDiscount) &&
    typedDiscount >= 0 &&
    typedDiscount <= MAX_DISCOUNT;

  return (
    <Modal
      isOpen
      title="Edit discount & stock"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </>
      }
    >
      <p className="mb-4 font-medium text-stone-800">{product.title}</p>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="edit-discount"
          name="discount"
          type="number"
          min="0"
          max={MAX_DISCOUNT}
          label="Discount %"
          value={formData.discount}
          onChange={handleChange}
          error={errors.discount}
        />
        <Input
          id="edit-stock"
          name="stock"
          type="number"
          min="0"
          label="Stock"
          value={formData.stock}
          onChange={handleChange}
          error={errors.stock}
        />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3">
        <span className="text-stone-500">Customers pay</span>
        <span className="font-semibold text-stone-900">
          {previewIsValid
            ? formatPrice(applyDiscount(product.price, typedDiscount))
            : formatPrice(product.price)}
        </span>
      </div>

      {product.discountPercentage > 0 && (
        <Button variant="link" className="mt-3 text-xs text-rose-600 hover:text-rose-800" onClick={handleRemoveDiscount}>
          Remove current {product.discountPercentage}% discount
        </Button>
      )}
    </Modal>
  );
}

export default EditProductModal;
