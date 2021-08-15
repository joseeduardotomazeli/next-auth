class AuthTokenError extends Error {
  constructor() {
    super('Error with authentication token.');
  }
}

export default AuthTokenError;
