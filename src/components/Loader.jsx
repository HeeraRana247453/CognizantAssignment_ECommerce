function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-teal-700" />
      <p className="text-sm text-stone-500">{text}</p>
    </div>
  );
}

export default Loader;
