import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import decode from 'jwt-decode';

import validateUserPermissions from './validateUserPermissions';

import AuthTokenError from '../services/errors/AuthTokenError';

interface WithSSRAuthOptionsParams {
  permissions?: string[];
  roles?: string[];
}

function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptionsParams
) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);
    const token = cookies['@nextauth.token'];

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    if (options) {
      const user = decode<{ permissions: []; roles: string[] }>(token);

      const { permissions, roles } = options;

      const userHasPermissions = validateUserPermissions({
        user,
        permissions,
        roles,
      });

      if (!userHasPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          },
        };
      }
    }

    try {
      return await fn(context);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        console.error(err);

        destroyCookie(context, '@nextauth.token');
        destroyCookie(context, '@nextauth.refreshtoken');

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
}

export default withSSRAuth;
