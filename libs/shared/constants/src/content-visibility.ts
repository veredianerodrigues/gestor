export const CONTENT_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  RESTRICTED: 'RESTRICTED',
} as const;

export type ContentVisibilityType =
  (typeof CONTENT_VISIBILITY)[keyof typeof CONTENT_VISIBILITY];
