// This impl. bases upon one that can be found in the router's test cases.
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, DetachedRouteHandle } from '@angular/router';
import { Injectable } from '@angular/core';
import { RouteStoreUtility } from './store/route.store.utility';

@Injectable()
export class CustomReuseStrategy extends BaseRouteReuseStrategy {
  constructor (private readonly routeStoreUtility: RouteStoreUtility) {
    super();
  }

  override shouldDetach (route: ActivatedRouteSnapshot): boolean {
    const { shouldReuse = false } = route.data as { shouldReuse?: boolean };
    return shouldReuse;
  }

  override store (route: ActivatedRouteSnapshot, handle: {}): void {
    const { shouldReuse = false } = route.data as { shouldReuse?: boolean };

    if (route.routeConfig?.path && shouldReuse && handle) {
      this.routeStoreUtility.store = this.routeStoreUtility.store.set(route.routeConfig.path, handle);
    }
  }

  override shouldAttach (route: ActivatedRouteSnapshot): boolean {
    if (!route.routeConfig?.path) { return false; }
    return !!this.routeStoreUtility.store.get(route.routeConfig.path) ?? null;
  }

  override retrieve (route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig?.path) { return null; }
    return this.routeStoreUtility.store.get(route.routeConfig.path) ?? null;
  }

  override shouldReuseRoute (future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const { shouldReuse = false } = future.data as { shouldReuse?: boolean };
    return shouldReuse;
  }
}
