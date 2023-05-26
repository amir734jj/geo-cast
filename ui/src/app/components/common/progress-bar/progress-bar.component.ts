import { Component } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  constructor (public loader: LoadingBarService) { }
}
