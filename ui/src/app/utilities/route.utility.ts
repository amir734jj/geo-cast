import { environment } from '../../environments/environment';
import { urlJoin } from '@angular-devkit/build-angular/src/utils';

const apiUrl = environment.apiUrl;
const route: (...arg: any[]) => string = (...arg: any[]) => urlJoin(apiUrl, ...arg.map(x => x.toString()));

export default route;
