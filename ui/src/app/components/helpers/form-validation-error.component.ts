import { Component, Input } from '@angular/core';
import { FormErrorTable } from '../../utilities/form.utility';

@Component({
  selector: 'app-form-validation-error',
  templateUrl: './form-validation-error.component.html',
  styleUrls: ['./form-validation-error.component.scss']
})
export class FormValidationErrorComponent {
  @Input('error-table') errorTable: FormErrorTable = [];
}
