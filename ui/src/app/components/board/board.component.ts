import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Role } from '../../models/enums/RoleEnum';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  public blobs: Blob[] = [];
  // public role: Role;
  public roles = Role;
  public projects: any[] = [];
  // public name: string;

  constructor (
    private readonly router: Router,
    private readonly manager: BlogService,
    private readonly authenticationService: AuthenticationService,
    private readonly contractorService: BlogService) {}

  async ngOnInit (): Promise<void> {
    const { name } = await this.authenticationService.account();
    // this.name = name;
  }
}
