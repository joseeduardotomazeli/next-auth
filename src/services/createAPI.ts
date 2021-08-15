import axios, { AxiosError } from 'axios';
import { setCookie, parseCookies } from 'nookies';

import AuthTokenError from './errors/AuthTokenError';

import { signOut } from '../contexts/AuthContext';

let isRefreshing = false;
let failedRequestsQueue = [];

function createAPI(context = undefined) {
  let cookies = parseCookies(context);

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
          cookies = parseCookies(context);

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

                setCookie(context, '@nextauth.token', token, {
                  maxAge: 60 * 60 * 24 * 30,
                  path: '/',
                });

                setCookie(context, '@nextauth.refreshtoken', newRefreshToken, {
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
                failedRequestsQueue.forEach((request) =>
                  request.onFailure(err)
                );

                failedRequestsQueue = [];

                if (process.browser) signOut();
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
          if (process.browser) signOut();
          else return Promise.reject(new AuthTokenError());
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}

export default createAPI;
