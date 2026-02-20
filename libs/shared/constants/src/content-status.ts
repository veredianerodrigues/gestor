export const CONTENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ContentStatusType =
  (typeof CONTENT_STATUS)[keyof typeof CONTENT_STATUS];
