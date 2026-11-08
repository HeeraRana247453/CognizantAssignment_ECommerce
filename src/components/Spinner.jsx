function Spinner({ text = 'Loading...' }) {
  return (
    <div className="status-box">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}

export default Spinner;
