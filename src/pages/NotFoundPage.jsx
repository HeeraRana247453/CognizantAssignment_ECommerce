import EmptyState from '../components/EmptyState';

function NotFoundPage() {
  return (
    <EmptyState
      title="404 - Page not found"
      message="The page you are looking for does not exist or has been moved."
      actionLabel="Go to products"
      actionTo="/"
    />
  );
}

export default NotFoundPage;
