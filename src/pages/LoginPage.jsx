import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { DEMO_USERS } from '../data/users';
import { validateLoginForm } from '../utils/validation';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import Badge from '../components/Badge';

function LoginPage() {
  const { user, isAuthenticated, isAdmin, login } = useAuth();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  // Already logged in (or just logged in): go back to where they were headed,
  // otherwise admins land on the panel and users on the shop.
  if (isAuthenticated) {
    const destination = location.state?.from || (isAdmin ? '/admin' : '/');
    return <Navigate to={destination} replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLoginError('');
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const result = login(formData.email, formData.password);
    if (!result.ok) setLoginError(result.error);
  }

  function fillDemo(demoUser) {
    setFormData({ email: demoUser.email, password: demoUser.password });
    setErrors({});
    setLoginError('');
  }

  return (
    <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-900/5 md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-stone-900 p-10 text-white md:block">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal-500/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between">
          <p className="font-display text-2xl font-bold">ShopEase</p>
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight">
              Welcome back.
            </h2>
            <p className="mt-3 text-sm text-stone-300">
              Sign in to check out, or manage the catalog if you are an admin.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-10">
        <h1 className="font-display text-3xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-stone-500">Use one of the demo accounts below.</p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          {loginError && <Alert variant="error">{loginError}</Alert>}

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="username"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button type="submit" fullWidth>
            Sign in
          </Button>
        </form>

        <div className="mt-8 rounded-2xl bg-stone-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Demo accounts
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {DEMO_USERS.map((demoUser) => (
              <li key={demoUser.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{demoUser.email}</span>
                    <Badge variant={demoUser.role === 'admin' ? 'admin' : 'brand'}>
                      {demoUser.role}
                    </Badge>
                  </div>
                  <p className="text-stone-500">{demoUser.password}</p>
                </div>
                <Button size="small" variant="outline" onClick={() => fillDemo(demoUser)}>
                  Fill
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
