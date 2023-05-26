import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { Role } from '../../../models/enums/RoleEnum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrorTable, resolveFormGroupErrors } from '../../../utilities/form.utility';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  roleRef: Role = Role.User;
  form: FormGroup;
  errorTable: FormErrorTable = [];

  constructor (
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      ])
    });
  }

  async handleRegister (event: Event): Promise<void> {
    event.preventDefault();

    if (this.form.invalid) {
      this.errorTable = resolveFormGroupErrors(this.form);
      return;
    } else {
      this.errorTable = [] as FormErrorTable;
    }

    const response = await this.authenticationService.register(this.roleRef, this.form.value);

    if (response) {
      await this.router.navigate(['./login']);
    }
  }
}
