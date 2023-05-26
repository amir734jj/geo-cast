import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  constructor (
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router) { }

  async ngOnInit (): Promise<void> {
    if (await this.authenticationService.isAuthenticated()) {
      await this.router.navigate(['./board']);
    }
  }
}
