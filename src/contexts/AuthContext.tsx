import { createContext, ReactNode } from 'react';

import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider(props: AuthProviderProps) {
  const { children } = props;

  const isAuthenticated = false;

  async function signIn(credentials: SignInCredentials) {
    const { email, password } = credentials;

    try {
      const response = await api.post('/sessions', {
        email,
        password,
      });

      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
