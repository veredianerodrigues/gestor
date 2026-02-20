import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { MediaService } from '../../../core/services/media.service';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ToolbarComponent],
  template: `
    <div class="layout">
      <app-toolbar />
      <div class="layout-body">
        <app-sidebar />
        <main class="main-content">
          <div class="header">
            <h2>Media Library</h2>
            <label class="btn-primary upload-btn">
              Upload
              <input type="file" hidden (change)="onFileSelected($event)" />
            </label>
          </div>

          <div class="media-grid">
            @for (item of items; track item['id']) {
              <div class="media-card">
                @if (isImage(item)) {
                  <img [src]="item['url']" [alt]="item['alt'] || item['filename']" />
                } @else {
                  <div class="file-icon">
                    <span class="material-icons">insert_drive_file</span>
                  </div>
                }
                <div class="media-info">
                  <span class="filename">{{ item['filename'] }}</span>
                  <button class="btn-danger-sm" (click)="onDelete(item['id'])">Delete</button>
                </div>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; flex-direction: column; height: 100vh; }
    .layout-body { display: flex; flex: 1; overflow: hidden; }
    .main-content { flex: 1; padding: 2rem; overflow-y: auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h2 { font-size: 1.5rem; font-weight: 700; }
    .btn-primary { padding: 0.5rem 1rem; background: var(--primary); color: white; border-radius: 6px; font-weight: 500; cursor: pointer; }
    .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .media-card { background: white; border-radius: 8px; border: 1px solid var(--gray-200); overflow: hidden; }
    .media-card img { width: 100%; height: 150px; object-fit: cover; }
    .file-icon { height: 150px; display: flex; align-items: center; justify-content: center; background: var(--gray-50); }
    .file-icon .material-icons { font-size: 3rem; color: var(--gray-400); }
    .media-info { padding: 0.75rem; display: flex; justify-content: space-between; align-items: center; }
    .filename { font-size: 0.75rem; color: var(--gray-600); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 120px; }
    .btn-danger-sm { padding: 0.25rem 0.5rem; background: var(--danger); color: white; border: none; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }
  `],
})
export class MediaLibraryComponent implements OnInit {
  items: Record<string, unknown>[] = [];

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.loadMedia();
  }

  isImage(item: Record<string, unknown>): boolean {
    return (item['mimetype'] as string)?.startsWith('image/') ?? false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.mediaService.upload(input.files[0]).subscribe(() => {
        this.loadMedia();
      });
    }
  }

  onDelete(id: unknown) {
    this.mediaService.remove(id as string).subscribe(() => {
      this.loadMedia();
    });
  }

  private loadMedia() {
    this.mediaService.findAll().subscribe((res) => {
      this.items = res.data as Record<string, unknown>[];
    });
  }
}
