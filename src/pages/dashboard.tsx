import { useContext, useEffect } from 'react';

import { AuthContext } from '../contexts/AuthContext';

import CanSee from '../components/CanSee';

import api from '../services/api';
import createAPI from '../services/createAPI';

import withSSRAuth from '../utils/withSSRAuth';

function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await api.get('/me');
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getUser();
  }, []);

  return (
    <>
      <h1>{user?.email}</h1>

      <CanSee permissions={['metrics.list']}>
        <h2>Métricas</h2>
      </CanSee>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const api = createAPI(context);

  const response = await api.get('/me');
  console.log(response.data);

  return {
    props: {},
  };
});

export default Dashboard;
