import { ReactNode } from 'react';

import useCanSee from '../hooks/useCanSee';

interface CanSeeProps {
  permissions?: string[];
  roles?: string[];
  children: ReactNode;
}

function CanSee(props: CanSeeProps) {
  const { permissions, roles, children } = props;

  const canSee = useCanSee({
    permissions,
    roles,
  });

  if (!canSee) return null;

  return <>{children}</>;
}

export default CanSee;
