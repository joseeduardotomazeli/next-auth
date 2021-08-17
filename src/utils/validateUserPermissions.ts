interface User {
  permissions: string[];
  roles: string[];
}

interface ValidateUserPermissionsParams {
  user: User;
  permissions?: string[];
  roles?: string[];
}

function validateUserPermissions(
  userPermissions: ValidateUserPermissionsParams
) {
  const { user, permissions, roles } = userPermissions;

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

export default validateUserPermissions;
