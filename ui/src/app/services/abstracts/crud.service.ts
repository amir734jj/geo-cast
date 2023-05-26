import { HttpClient } from '@angular/common/http';
import route from '../../utilities/route.utility';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { firstValueFrom } from 'rxjs';

export default abstract class CrudService<T> {
  abstract default (): T

  abstract resolveRoute (): string

  abstract resolveHttpClient (): HttpClient

  async save (item: T): Promise<T> {
    return await firstValueFrom(this.resolveHttpClient()
      .post<T>(route(this.resolveRoute()), item));
  }

  async update (id: string, item: T): Promise<T> {
    return await firstValueFrom(this.resolveHttpClient()
      .put<T>(route(this.resolveRoute(), id), item));
  }

  async get (id: string): Promise<T> {
    return await firstValueFrom(this.resolveHttpClient()
      .get<T>(route(this.resolveRoute(), id))
      .pipe(map(x => _.merge(this.default(), x))));
  }

  async getAll (): Promise<T[]> {
    return await firstValueFrom(this.resolveHttpClient()
      .get<T[]>(route(this.resolveRoute()))
      .pipe(map(l => l.map(x => _.merge(this.default(), x)))));
  }

  async delete (id: string): Promise<boolean> {
    return await firstValueFrom(this.resolveHttpClient()
      .delete<boolean>(route(this.resolveRoute(), id)));
  }
}
