export interface ContentDocument {
  id: string;
  type: string;
  data: Record<string, unknown>;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version: number;
}
