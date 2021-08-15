import { useContext } from 'react';

import { AuthContext } from '../contexts/AuthContext';

interface UseCanSeeProps {
  permissions?: string[];
  roles?: string[];
}

function useCanSee(props: UseCanSeeProps) {
  const { user, isAuthenticated } = useContext(AuthContext);

  const { permissions, roles } = props;

  if (!isAuthenticated) return false;

  if (permissions?.length) {
    const hasAllPermissions = permissions.every((permission) => {
      return user.permissions.includes(permission);
    });

    if (!hasAllPermissions) return false;
  }

  if (roles?.length) {
    const hasAllRoles = roles.some((role) => {
      return user.roles.includes(role);
    });

    if (!hasAllRoles) return false;
  }

  return true;
}

export default useCanSee;
