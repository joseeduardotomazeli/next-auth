import axios, { AxiosError } from 'axios';
import { setCookie, parseCookies } from 'nookies';

import { signOut } from '../contexts/AuthContext';

let cookies = parseCookies();

let isRefreshing = false;
let failedRequestsQueue = [];

const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['@nextauth.token']}`,
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies();

        const config = error.config;
        const { '@nextauth.refreshtoken': refreshToken } = cookies;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post('/refresh', {
              refreshToken,
            })
            .then((response) => {
              const { token, refreshToken: newRefreshToken } = response.data;

              setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
              });

              setCookie(undefined, '@nextauth.refreshtoken', newRefreshToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
              });

              api.defaults.headers['Authorization'] = `Bearer ${token}`;

              failedRequestsQueue.forEach((request) =>
                request.onSuccess(token)
              );

              failedRequestsQueue = [];
            })
            .catch((err) => {
              failedRequestsQueue.forEach((request) => request.onFailure(err));
              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              config.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(config));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      } else {
        signOut();
      }

      return Promise.reject(error);
    }
  }
);

export default api;
