// Label + field + hint + error message in one place.
// Use multiline for a textarea.
function Input({ id, label, error, hint, multiline = false, className = '', ...rest }) {
  const Field = multiline ? 'textarea' : 'input';

  const fieldClasses = [
    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition',
    'placeholder:text-stone-400 focus:ring-4',
    error
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
      : 'border-stone-300 focus:border-teal-600 focus:ring-teal-600/15',
  ].join(' ');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <Field
        id={id}
        className={fieldClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
      {error ? (
        <span id={`${id}-error`} className="text-sm text-rose-600">
          {error}
        </span>
      ) : (
        hint && (
          <span id={`${id}-hint`} className="text-xs text-stone-500">
            {hint}
          </span>
        )
      )}
    </div>
  );
}

export default Input;
