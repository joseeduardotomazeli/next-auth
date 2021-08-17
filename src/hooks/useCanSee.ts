import { useContext } from 'react';

import { AuthContext } from '../contexts/AuthContext';

import validateUserPermissions from '../utils/validateUserPermissions';

interface UseCanSeeProps {
  permissions?: string[];
  roles?: string[];
}

function useCanSee(props: UseCanSeeProps) {
  const { user, isAuthenticated } = useContext(AuthContext);

  const { permissions, roles } = props;

  if (!isAuthenticated) return false;

  const userHasPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasPermissions;
}

export default useCanSee;
