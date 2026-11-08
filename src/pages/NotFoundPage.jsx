import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="status-box">
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn">
        Go to products
      </Link>
    </div>
  );
}

export default NotFoundPage;
