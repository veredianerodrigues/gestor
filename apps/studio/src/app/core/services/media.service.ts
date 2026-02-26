import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiResponse } from '@cms/shared/interfaces';

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor(private api: ApiService) {}

  upload(file: File) {
    return this.api.upload<{ data: unknown }>('/media/upload', file);
  }

  findAll(page = '1', perPage = '20') {
    return this.api.get<ApiResponse<unknown[]>>('/media', { page, perPage });
  }

  remove(id: string) {
    return this.api.delete(`/media/${id}`);
  }
}
