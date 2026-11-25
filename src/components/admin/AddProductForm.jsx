import { memo, useState } from 'react';

import Button from '../Button';
import Input from '../Input';
import { validateProductForm, MAX_DISCOUNT } from '../../utils/validation';
import { formatCategory } from '../../utils/format';

const emptyForm = {
  title: '',
  price: '',
  category: '',
  discount: '0',
  stock: '',
  description: '',
  imageUrl: '',
};

// Keeps its own form state, so typing here doesn't re-render the rest of the admin page.
function AddProductForm({ categories, onAddProduct }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateProductForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onAddProduct(formData);
    setFormData(emptyForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="font-display text-xl font-semibold">Add new product</h2>
        <p className="mt-1 text-sm text-stone-500">It appears in the store as soon as you save.</p>
      </div>

      <Input
        id="title"
        name="title"
        label="Product name"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          label="Price (USD)"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
        />
        <Input
          id="discount"
          name="discount"
          type="number"
          min="0"
          max={MAX_DISCOUNT}
          label="Discount %"
          value={formData.discount}
          onChange={handleChange}
          error={errors.discount}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            id="category"
            name="category"
            label="Category"
            list="category-options"
            placeholder="Pick or type new"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
          />
          <datalist id="category-options">
            {categories.map((cat) => (
              <option key={cat} value={formatCategory(cat)} />
            ))}
          </datalist>
        </div>
        <Input
          id="stock"
          name="stock"
          type="number"
          min="0"
          label="Stock"
          value={formData.stock}
          onChange={handleChange}
          error={errors.stock}
        />
      </div>

      <Input
        id="description"
        name="description"
        label="Description"
        multiline
        rows="3"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
      />

      <Input
        id="imageUrl"
        name="imageUrl"
        label="Image URL (optional)"
        placeholder="https://..."
        hint="Leave empty and a placeholder image is used."
        value={formData.imageUrl}
        onChange={handleChange}
        error={errors.imageUrl}
      />

      <Button type="submit" fullWidth>
        Add product
      </Button>
    </form>
  );
}

export default memo(AddProductForm);
