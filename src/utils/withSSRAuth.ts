import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies, destroyCookie } from 'nookies';

import AuthTokenError from '../services/errors/AuthTokenError';

function withSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);

    if (!cookies['@nextauth.token']) {
      console.log('redirect');

      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
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
