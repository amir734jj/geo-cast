// routerConfig.ts
import {
  Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { BlogIndexComponent } from "./components/blog/index/blog-index.component";
import { LogoutComponent } from "./components/account/logout/logout.component";
import { RegisterComponent } from "./components/account/register/register.component";
import { LoginComponent } from "./components/account/login/login.component";
import { BoardComponent } from "./components/board/board.component";
import { AboutComponent } from "./components/about/about.component";
import { ProfileComponent } from "./components/profile/index/profile.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { UsersComponent } from "./components/users/users.component";
import { BlogBoardComponent } from "./components/blog/board/blog-board.component";
import { CustomCanActivate } from "./utilities/injectables/custom.can.activate";
import { LandingComponent } from "./components/landing/landing.component";
import { BlogManagementComponent } from "./components/management/blog/blog-management.component";
import { inject } from "@angular/core";

export type CustomRouteSchema = Route & {
  data?: {
    allowAnonymous?: boolean;
    disallowAuthenticated?: boolean;
    shouldReuse?: boolean;
  };
};

const canActivate = [
  async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
    await inject(CustomCanActivate).canActivate(route, state),
];

const appRoutes: CustomRouteSchema[] = [
  {
    path: "",
    component: LandingComponent,
    data: { allowAnonymous: true },
    canActivate,
  },
  {
    path: "home",
    component: BoardComponent,
    data: { allowAnonymous: true },
    canActivate,
  },
  {
    path: "about",
    component: AboutComponent,
  },
  {
    path: "login",
    component: LoginComponent,
    data: { disallowAuthenticated: true },
    canActivate,
  },
  {
    path: "register",
    component: RegisterComponent,
    data: { disallowAuthenticated: true },
    canActivate,
  },
  {
    path: "logout",
    component: LogoutComponent,
    data: { allowAnonymous: false },
  },
  {
    path: "welcome",
    component: WelcomeComponent,
  },
  {
    path: "manage",
    data: { allowAnonymous: false },
    children: [
      {
        path: "blog",
        component: BlogManagementComponent,
      },
    ],
  },
  {
    path: "board",
    component: BoardComponent,
    data: { allowAnonymous: false },
  },
  {
    path: "user",
    component: UsersComponent,
    data: { allowAnonymous: false },
  },
  {
    path: "blog",
    component: BlogBoardComponent,
    data: { allowAnonymous: false },
    children: [
      {
        path: ":id",
        component: BlogIndexComponent,
      },
    ],
  },
  {
    path: "profile",
    component: ProfileComponent,
    data: { allowAnonymous: false },
    canActivate,
  },
];

export default appRoutes;
