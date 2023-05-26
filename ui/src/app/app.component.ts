import { Component, OnInit } from "@angular/core";
import { setTheme } from "ngx-bootstrap/utils";
import { AuthenticationService } from "./services/authentication.service";
import { Router } from "@angular/router";
import { Profile } from "./models/entities/Profile";
import { Role } from "./models/enums/RoleEnum";
import { JwtFsm } from "jwt-fsm";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "angular-template";
  public navBarCollapsed = true;
  public profile: Profile | undefined;
  public roles = Role;
  // public roleToString = RoleToString;

  constructor(
    private readonly router: Router,
    private readonly jwtFsm: JwtFsm,
    private readonly authenticationService: AuthenticationService
  ) {
    setTheme("bs5");
  }

  async ngOnInit(): Promise<void> {
    if (await this.authenticated) {
      this.profile = await this.authenticationService.account();
    } else {
      await this.router.navigate(["./login"]);
    }
  }

  get authenticated(): Promise<boolean> {
    return this.authenticationService.isAuthenticated();
  }
}
