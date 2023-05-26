import { AfterViewChecked, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements AfterViewChecked {
  constructor (private readonly router: Router, private readonly authenticationService: AuthenticationService) { }

  async ngAfterViewChecked (): Promise<void> {
    await this.logOut();
  }

  async logOut (): Promise<void> {
    const result = await this.authenticationService.logout();

    if (result) {
      await this.router.navigate(['./home']);
    }
  }
}
