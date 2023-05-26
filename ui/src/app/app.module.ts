import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import appRoutes from './RouterConfig';
import { RouteReuseStrategy, RouterModule, UrlSerializer } from '@angular/router';
import { BoardModule } from './modules/board.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BlogModule } from './modules/blog.module';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AccountModule } from './modules/account.module';
import { CommonComponentModule } from './modules/common.module';
import { JwtInterceptor } from './intercepters/jwt.intercepter';
import { AboutComponent } from './components/about/about.component';
import { FormsModule } from '@angular/forms';
import { ProfileModule } from './modules/profile.module';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { UserModule } from './modules/user.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomCanActivate } from './utilities/injectables/custom.can.activate';
import { CustomReuseStrategy } from './utilities/injectables/custom.reuse.strategy.utility';
import { RouteStoreUtility } from './utilities/injectables/store/route.store.utility';
import { ErrorHandlerStoreUtility } from './utilities/injectables/store/error.handler.store.utility';
import { LowerCaseUrlSerializer } from './utilities/injectables/custom.url.serializer.utility';
import { ManagementModule } from './modules/management.module';
import { AuthenticationService } from './services/authentication.service';
import { LandingComponent } from './components/landing/landing.component';
import { UserService } from './services/user.service';
import { BlogService } from './services/blog.service';
import { ProfileService } from './services/profile.service';
import { JwtFsm } from 'jwt-fsm';
import * as store from 'store';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    WelcomeComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    ButtonsModule.forRoot(),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      disableConsoleLogging: false
    }),
    HttpClientModule,
    CommonComponentModule,
    AccountModule,
    BoardModule,
    ProfileModule,
    UserModule,
    BlogModule,
    FormsModule,
    BrowserAnimationsModule,
    ManagementModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
    deps: [HttpClientModule, AuthenticationService]
  },
  {
    provide: JwtFsm,
    deps: [AuthenticationService, NGXLogger],
    multi: false,
    useFactory: (authenticationService: AuthenticationService, logger: NGXLogger) =>
      new JwtFsm({
        logger: {
          info: (text: string) => { logger.info(text); },
          error: (text: string) => { logger.error(text); }
        },
        persist: (token: string) => store.set('token', token),
        renew: async () => await authenticationService.refresh(),
        recover: () => store.get('token')
      })
  },
  { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
  { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
  ErrorHandlerStoreUtility,
  RouteStoreUtility,
  CustomCanActivate,
  AuthenticationService,
  UserService,
  BlogService,
  ProfileService
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
