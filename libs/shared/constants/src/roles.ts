export const ROLES = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
