import { createContext, useState, useEffect, ReactNode } from 'react';
import Router, { useRouter } from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

import api from '../services/api';

interface User {
  email: string;
  permissions: [];
  roles: [];
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  isAuthenticated: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, '@nextauth.token');
  destroyCookie(undefined, '@nextauth.refreshtoken');

  Router.push('/');
}

function AuthProvider(props: AuthProviderProps) {
  const router = useRouter();

  const [user, setUser] = useState<User>(null);

  const { children } = props;

  const isAuthenticated = !!user;

  useEffect(() => {
    async function getUser() {
      const { '@nextauth.token': token } = parseCookies();

      if (token) {
        try {
          const response = await api.get('/me');
          const { email, permissions, roles } = response.data;

          setUser({
            email,
            permissions,
            roles,
          });
        } catch (err) {
          console.error(err);
          signOut();
        }
      }
    }

    getUser();
  }, [router]);

  async function signIn(credentials: SignInCredentials) {
    const { email, password } = credentials;

    try {
      const response = await api.post('/sessions', {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      setCookie(undefined, '@nextauth.refreshtoken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
