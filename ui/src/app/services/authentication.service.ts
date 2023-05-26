import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import LoginRequest from '../models/authentication.service/login/LoginRequest';
import RegisterRequest from '../models/authentication.service/register/RegisterRequest';
import route from '../utilities/route.utility';
import { Role } from '../models/enums/RoleEnum';
import { Profile } from '../models/entities/Profile';
import { JwtFsm } from 'jwt-fsm';
import * as _ from 'lodash';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public isAuthenticated: () => Promise<boolean>;

  constructor (
    private readonly http: HttpClient,
    private readonly injector: Injector) {
    const memoizedIsAuthenticatedCall = _.memoize(async (_: string) => {
      return await this.isAuthenticatedCall();
    }, token => token);
    this.isAuthenticated = async () => await memoizedIsAuthenticatedCall(this.injector.get(JwtFsm).token);
  }

  private async isAuthenticatedCall (): Promise<boolean> {
    return await firstValueFrom(this.http.get<boolean>(
      route('account', 'isAuthenticated'),
      { headers: { responseType: 'text' } }
    ));
  }

  async login (loginRequest: LoginRequest): Promise<boolean> {
    try {
      const token = await firstValueFrom(this.http.post(route('account', 'login'), loginRequest, { responseType: 'text' }));
      await this.injector.get(JwtFsm).setToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async register (role: Role, registerRequest: RegisterRequest): Promise<boolean> {
    try {
      await this.http.post(route('account', 'register', role), registerRequest, { responseType: 'text' }).toPromise();
      return true;
    } catch (e) {
      return false;
    }
  }

  async logout (): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post(route('account', 'logout'), null, { responseType: 'text' }));
      this.injector.get(JwtFsm).dispose();
      return true;
    } catch (e) {
      return false;
    }
  }

  async account (): Promise<Profile> {
    return await firstValueFrom(this.http.get<Profile>(route('account')));
  }

  async refresh (): Promise<string> {
    return await firstValueFrom(this.http.post<string>(route('account', 'refresh'), {}));
  }
}
