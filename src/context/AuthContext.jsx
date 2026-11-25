import { createContext, useCallback, useMemo } from 'react';

import { DEMO_USERS } from '../data/users';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Only the user id is saved as the session, never the password.
  const [session, setSession] = useLocalStorage('shopease-session', null);

  // The user (and their role) is looked up from DEMO_USERS on every load instead of
  // trusting what is in localStorage, so editing the role there changes nothing.
  const user = useMemo(() => {
    if (!session) return null;
    const match = DEMO_USERS.find((u) => u.id === session.userId);
    if (!match) return null;
    const { password, ...safeUser } = match;
    return safeUser;
  }, [session]);

  const login = useCallback(
    (email, password) => {
      const match = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (!match) {
        return { ok: false, error: 'Incorrect email or password.' };
      }

      setSession({ userId: match.id });
      return { ok: true };
    },
    [setSession]
  );

  const logout = useCallback(() => setSession(null), [setSession]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
