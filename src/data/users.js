// Local demo accounts. There is no backend, so these are checked in the browser.
// (A real app would never ship passwords like this, see the README.)
export const DEMO_USERS = [
  {
    id: 1,
    name: 'Store Admin',
    email: 'admin@store.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Demo User',
    email: 'user@store.com',
    password: 'User@123',
    role: 'user',
  },
];
