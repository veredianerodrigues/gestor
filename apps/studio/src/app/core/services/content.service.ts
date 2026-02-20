import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiResponse } from '@cms/shared/interfaces';

@Injectable({ providedIn: 'root' })
export class ContentService {
  constructor(private api: ApiService) {}

  findAll(
    type: string,
    params?: {
      page?: string;
      perPage?: string;
      status?: string;
      search?: string;
      sort?: string;
      order?: string;
    }
  ) {
    return this.api.get<ApiResponse<unknown[]>>(
      `/content/${type}`,
      params as Record<string, string>
    );
  }

  findOne(type: string, id: string) {
    return this.api.get<{ data: unknown }>(`/content/${type}/${id}`);
  }

  create(type: string, data: Record<string, unknown>) {
    return this.api.post(`/content/${type}`, { data });
  }

  update(type: string, id: string, data: Record<string, unknown>) {
    return this.api.put(`/content/${type}/${id}`, { data });
  }

  updateStatus(type: string, id: string, status: string) {
    return this.api.patch(`/content/${type}/${id}/status`, { status });
  }

  remove(type: string, id: string) {
    return this.api.delete(`/content/${type}/${id}`);
  }
}
