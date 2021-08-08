import { useContext, useEffect } from 'react';

import { AuthContext } from '../contexts/AuthContext';

import api from '../services/api';

function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function getUser() {
      const response = await api.get('/me');
      console.log(response.data);
    }

    getUser();
  }, []);

  return <h1>{user?.email}</h1>;
}

export default Dashboard;
