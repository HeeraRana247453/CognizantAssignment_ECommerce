// Label + field + error message in one place.
// Use multiline for a textarea.
function Input({ id, label, error, multiline = false, ...rest }) {
  const Field = multiline ? 'textarea' : 'input';

  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <Field
        id={id}
        className={error ? 'input input-error' : 'input'}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className="error-text">
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;
