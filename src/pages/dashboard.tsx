import { useContext, useEffect } from 'react';

import { AuthContext } from '../contexts/AuthContext';

import api from '../services/api';

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

  return <h1>{user?.email}</h1>;
}

export default Dashboard;
