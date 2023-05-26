import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CustomRouteSchema } from 'src/app/RouterConfig';

@Injectable()
export class CustomCanActivate {
  constructor (
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService) {
  }

  async canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const {
      data: {
        allowAnonymous = false,
        disallowAuthenticated = false
      } = {}
    } = route as CustomRouteSchema;
    const isAuthenticated = await this.authenticationService.isAuthenticated();

    // And disallow authenticated is true then redirect to board
    if (isAuthenticated) {
      if (disallowAuthenticated) {
        return await this.router.navigate(['./board']);
      } else if (!allowAnonymous) {
        return true;
      } else {
        return true;
      }
    } else {
      if (allowAnonymous || disallowAuthenticated) {
        return true;
      } else {
        await this.router.navigate(['./login']);
        return false;
      }
    }
  }
}
