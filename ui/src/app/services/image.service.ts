import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import route from '../utilities/route.utility';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ImageService {
  constructor (private readonly http: HttpClient) {
  }

  downloadUrl (key: string): string | undefined {
    return key ? route('image', key) : undefined;
  }

  async upload (file: File, description: string = ''): Promise<string> {
    if (file) {
      const formData = new FormData();
      formData.append('File', file, file.name);
      formData.set('description', description);
      const key = await firstValueFrom(this.http.post(route('image', 'upload'), formData, {
        responseType: 'text',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }));
      return key.replace(/"/g, '');
    } else {
      return '';
    }
  }
}
