import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../models/entities/Profile';
import route from '../utilities/route.utility';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProfileService {
  constructor (private readonly http: HttpClient) {

  }

  async get (): Promise<Profile> {
    return await firstValueFrom(this.http.get<Profile>(route('profile')));
  }

  async save (profile: Profile): Promise<Profile> {
    return await firstValueFrom(this.http.post<Profile>(route('profile'), profile));
  }
}
