import { AppProps } from 'next/app';

import AuthProvider from '../contexts/AuthContext';

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
