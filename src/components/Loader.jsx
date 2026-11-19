function Loader({ text = 'Loading...' }) {
  return (
    <div className="status-box" role="status">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}

export default Loader;
